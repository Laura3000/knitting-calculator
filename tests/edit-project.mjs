// Run after npm run build: node tests/edit-project.mjs
// Uses an installed Chromium browser, with an isolated temporary profile.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, extname } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const profile = await mkdtemp(join(tmpdir(), 'count-knit-edit-'));
const root = resolve('dist');
const server = createServer(async (request, response) => {
  try {
    const path = new URL(request.url, 'http://localhost').pathname;
    const file = resolve(root, `.${path === '/' ? '/index.html' : path}`);
    assert.ok(file.startsWith(root + '\\') || file.startsWith(root + '/'));
    const body = await readFile(file);
    response.setHeader('Content-Type', { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[extname(file)] ?? 'application/octet-stream');
    response.end(body);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}`;
const browser = spawn(process.env.BROWSER_PATH ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', [
  '--headless=new', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Browser startup timed out')), 15000);
    let output = '';
    browser.on('error', reject);
    browser.stderr.on('data', chunk => {
      output += chunk;
      const match = output.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) { clearTimeout(timeout); resolve(match[1]); }
    });
  });
  socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let sequence = 0;
  let sessionId;
  const pending = new Map();
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id) return;
    const handler = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) handler.reject(new Error(JSON.stringify(message.error)));
    else handler.resolve(message.result);
  });
  function cdp(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++sequence;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }
  const { targetId } = await cdp('Target.createTarget', { url: 'about:blank' });
  ({ sessionId } = await cdp('Target.attachToTarget', { targetId, flatten: true }));
  async function evaluate(expression) {
    const value = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (value.exceptionDetails) throw new Error(JSON.stringify(value.exceptionDetails));
    return value.result.value;
  }
  async function wait(expression) {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await evaluate(expression)) return;
      await delay(50);
    }
    throw new Error(`Timed out: ${expression}`);
  }
  async function route(hash) {
    await evaluate(`location.hash = ${JSON.stringify(hash)}`);
    await wait(`document.title.startsWith(${JSON.stringify(hash === 'projects' ? 'Projects' : hash === 'home' ? 'Home' : 'Stitch & Row Calculator')})`);
  }
  async function click(text) {
    const found = await evaluate(`(() => {
      const button = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === ${JSON.stringify(text)} && b.getClientRects().length);
      if (!button || button.disabled) return false;
      button.click(); return true;
    })()`);
    assert.ok(found, `Enabled button: ${text}`);
    await delay(70);
  }
  async function fill(label, value) {
    await evaluate(`(() => {
      const input = [...document.querySelectorAll('label')].find(l => l.querySelector('span')?.textContent === ${JSON.stringify(label)}).querySelector('input');
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, ${JSON.stringify(String(value))});
      input.dispatchEvent(new Event('input', { bubbles: true }));
    })()`);
    await delay(30);
  }
  const stored = () => evaluate('JSON.parse(localStorage.getItem("savedProjects"))');
  const original = {
    id: 'legacy-project', savedAt: '2024-01-02T03:04:05.000Z',
    data: { projectName: 'Old scarf', swatchStitches: 20, swatchWidthCm: 10, desiredWidthCm: 30 },
    result: { requiredStitches: 60 },
  };
  const other = { ...original, id: 'other-project', data: { ...original.data, projectName: 'Other project' } };
  await cdp('Page.navigate', { url });
  await wait('document.querySelector("h1") !== null');
  await evaluate(`localStorage.setItem('savedProjects', ${JSON.stringify(JSON.stringify([original, other]))})`);
  await cdp('Page.navigate', { url: `${url}/#projects` });
  await cdp('Page.reload');
  await wait('document.body.textContent.includes("Old scarf")');
  console.log('PASS: legacy projects load');
  await evaluate('document.querySelector(\'button[aria-label="Edit Other project"]\').click()');
  await wait('document.querySelector("form")?.getClientRects().length > 0');
  assert.equal(await evaluate('document.querySelector("form input").value'), 'Other project');
  await click('Cancel editing');
  assert.deepEqual(await stored(), [original, other]);
  console.log('PASS: Edit selects the correct project');

  async function edit() {
    await route('projects');
    await click('Edit');
    await wait('document.querySelector("form")?.getClientRects().length > 0');
    assert.ok(await evaluate('document.body.textContent.includes("Editing project:")'));
  }
  async function saveEdit() {
    const before = await stored();
    await click('Calculate');
    await click('Save Changes');
    await wait('document.title.startsWith("Projects")');
    const after = await stored();
    assert.equal(after.length, before.length);
    assert.equal(after[0].id, original.id);
    assert.equal(after[0].savedAt, original.savedAt);
    assert.deepEqual(after[1], other);
    return after[0];
  }
  await edit();
  assert.deepEqual(await evaluate('[...document.querySelectorAll("form input")].map(i => i.value)'), ['Old scarf', '20', '10', '30', '', '', '', '', '']);
  await fill('Project name', 'Edited scarf');
  assert.deepEqual((await saveEdit()).data, { ...original.data, projectName: 'Edited scarf' });
  console.log('PASS: name-only edit; identity, savedAt, count and other projects preserved');
  await edit();
  await fill('Yarn name/brand', 'Cotton');
  await fill('Needle size', '4 mm');
  const materials = await saveEdit();
  assert.equal(materials.data.yarnName, 'Cotton');
  assert.equal(materials.data.needleSize, '4 mm');
  assert.equal(materials.result.requiredStitches, 60);
  await edit();
  await fill('Desired width (cm)', 45);
  assert.equal((await saveEdit()).result.requiredStitches, 90);
  await edit();
  await fill('Swatch rows', 30);
  await fill('Swatch height (cm)', 10);
  await fill('Desired height (cm)', 50);
  assert.equal((await saveEdit()).result.requiredRows, 150);
  await edit();
  assert.deepEqual(await evaluate('[...document.querySelectorAll("form input")].map(i => i.value)'), ['Edited scarf', '20', '10', '45', '30', '10', '50', 'Cotton', '4 mm']);
  await fill('Desired height (cm)', 60);
  assert.equal((await saveEdit()).result.requiredRows, 180);
  console.log('PASS: materials, width and rows edits; all fields prefilled');

  const beforeCancel = await stored();
  await edit();
  await fill('Project name', 'Discard this');
  await click('Cancel editing');
  assert.deepEqual(await stored(), beforeCancel);
  await edit();
  await fill('Desired width (cm)', 0);
  await click('Calculate');
  assert.ok(await evaluate('document.querySelector("[role=alert]") !== null'));
  assert.deepEqual(await stored(), beforeCancel);
  await fill('Desired width (cm)', 80);
  await click('Calculate');
  await click('Cancel editing');
  assert.deepEqual(await stored(), beforeCancel);
  await edit();
  await click('Calculate');
  await route('home');
  await route('stitch-row');
  assert.equal(await evaluate('document.querySelector("form input").value'), '');
  assert.equal(await evaluate('document.body.textContent.includes("Editing project:")'), false);
  assert.deepEqual(await stored(), beforeCancel);
  console.log('PASS: validation, cancel from form/result and leaving route discard edits');

  await fill('Project name', 'New project');
  await fill('Gauge stitches', 22);
  await fill('Gauge width (cm)', 10);
  await fill('Desired width (cm)', 40);
  await click('Calculate');
  await click('Save project');
  const added = await stored();
  assert.equal(added.length, 3);
  assert.equal(added[2].result.requiredStitches, 88);
  assert.notEqual(added[2].id, original.id);
  assert.ok(await evaluate('[...document.querySelectorAll("button")].some(b => b.textContent === "Saved!" && b.disabled)'));
  console.log('PASS: creating a new project still works');

  await edit();
  await fill('Project name', 'Retry edit');
  await click('Calculate');
  await evaluate('window.alerts = []; window.alert = message => window.alerts.push(message); window.originalSetItem = Storage.prototype.setItem; Storage.prototype.setItem = function() { throw new Error("quota"); }');
  await click('Save Changes');
  assert.deepEqual(await stored(), added);
  assert.equal(await evaluate('location.hash'), '#stitch-row');
  assert.equal(await evaluate('window.alerts.length'), 1);
  await evaluate('Storage.prototype.setItem = window.originalSetItem');
  await click('Cancel editing');
  assert.ok(await evaluate('document.body.textContent.includes("Edited scarf")'));
  assert.equal(await evaluate('document.body.textContent.includes("Retry edit")'), false);
  console.log('PASS: failed write preserves storage and React state');

  await edit();
  await click('Calculate');
  await evaluate('localStorage.setItem("savedProjects", JSON.stringify(JSON.parse(localStorage.getItem("savedProjects")).slice(1)))');
  await click('Save Changes');
  assert.equal((await stored()).length, 2);
  assert.equal(await evaluate('location.hash'), '#stitch-row');
  await evaluate(`localStorage.setItem('savedProjects', ${JSON.stringify(JSON.stringify(added))})`);
  await click('Save Changes');
  await wait('document.title.startsWith("Projects")');
  console.log('PASS: missing ID cannot create a duplicate; failed save can be retried');

  const beforeReload = await stored();
  await cdp('Page.reload');
  await delay(150);
  await wait('document.body.textContent.includes("Edited scarf")');
  assert.deepEqual(await stored(), beforeReload);
  for (const width of [320, 430, 768, 1440]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `No overflow at ${width}px`);
    assert.ok(await evaluate('[...document.querySelectorAll("button")].filter(b => b.textContent.trim() === "Edit").every(b => b.getBoundingClientRect().height >= 44 && b.getBoundingClientRect().right <= innerWidth)'), `Accessible Edit buttons at ${width}px`);
  }
  await click('Delete');
  assert.deepEqual(await stored(), beforeReload.slice(1));
  console.log('PASS: reload, delete and Projects layout at 320/430/768/1440px');
  await cdp('Browser.close');
} finally {
  socket?.close();
  browser.kill();
  server.close();
}
