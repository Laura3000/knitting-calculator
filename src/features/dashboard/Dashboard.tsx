import type { SavedProject } from "../../types/knitting.types";
import { Icon } from "../../components/common/Icon";
import { quickTools } from "../../app/navigation";
import styles from "./Dashboard.module.css";

export function ToolGrid() {
  return (
    <div className={styles.tools}>
      {quickTools.map((tool) => (
        <a
          className={`${styles.tool} ${styles[tool.tone]}`}
          href={`#${tool.id}`}
          key={tool.id}
        >
          <Icon name={tool.icon} />
          <h3>{tool.label}</h3>
          <p>{tool.description}</p>
          <span className={styles.toolBottom}>
            <span>
              {tool.id === "stitch-row" ? "Open calculator" : "Coming soon"}
            </span>
            <Icon name="arrow" />
          </span>
        </a>
      ))}
    </div>
  );
}

export function Dashboard({ projects }: { projects: SavedProject[] }) {
  const preview = projects.slice(-3).reverse();
  return (
    <>
      <section className={styles.hero} aria-labelledby="welcome-title">
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>YOUR KNITTING DASHBOARD</span>
          <h1 id="welcome-title">Hello, maker.</h1>
          <p>What are you working on today?</p>
          <span className={styles.handwriting}>
            A little math. A lot of knitting. ♡
          </span>
        </div>
        <div className={styles.heroArt} aria-hidden="true">
          <span>
            Less counting.
            <br />
            More creating.
          </span>
          <Icon name="yarn" />
          <Icon name="heart" />
          <i />
        </div>
      </section>
      <section className={styles.section} aria-labelledby="tools-title">
        <div className={styles.sectionHeading}>
          <h2 id="tools-title">Quick Tools</h2>
          <a href="#calculators">
            See all tools <Icon name="arrow" />
          </a>
        </div>
        <ToolGrid />
      </section>
      <div className={styles.lowerGrid}>
        <section className={styles.section} aria-labelledby="projects-title">
          <div className={styles.sectionHeading}>
            <h2 id="projects-title">My Projects</h2>
            <a href="#projects">
              View all <Icon name="arrow" />
            </a>
          </div>
          <div className={styles.projectCaption}>
            <span>Your ideas, a few stitches closer.</span>
            <span>{projects.length} saved</span>
          </div>
          {preview.length ? (
            <ul className={styles.projectList}>
              {preview.map((project) => (
                <li key={project.id}>
                  <a href="#projects">
                    <span className={styles.projectIcon}>
                      <Icon name="yarn" />
                    </span>
                    <div>
                      <h3>{project.data.projectName || "Untitled project"}</h3>
                      <p>
                        {project.result.requiredStitches} stitches
                        {project.result.requiredRows !== undefined
                          ? ` · ${project.result.requiredRows} rows`
                          : ""}
                      </p>
                      <span>
                        {project.data.yarnName || "Saved calculation"}
                      </span>
                    </div>
                    <Icon name="arrow" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>
                <Icon name="folder" />
              </span>
              <h3>Every project starts with a little idea.</h3>
              <p>
                Calculate your stitches and save your first project.
                <br />
                We’ll keep it right here for you.
              </p>
              <a className={styles.primaryLink} href="#stitch-row">
                <Icon name="plus" /> Start a calculation
              </a>
            </div>
          )}
          <div className={styles.tip}>
            <Icon name="stitch" />
            <p>
              <strong>A little care goes a long way.</strong>
              <br />
              Make a swatch before you begin. Your future stitches will thank
              you.
            </p>
          </div>
        </section>
        <section
          className={`${styles.section} ${styles.statsPanel}`}
          aria-labelledby="stats-title"
        >
          <div className={styles.sectionHeading}>
            <h2 id="stats-title">Knitting Stats</h2>
            <span className={styles.badge}>Your knitting journey</span>
          </div>
          <div className={styles.stats}>
            <div>
              <Icon name="folder" />
              <p>
                <strong>{projects.length}</strong>
                <span>Saved projects</span>
              </p>
            </div>
            <div>
              <Icon name="rows" />
              <p>
                <strong aria-label="Not available">—</strong>
                <span>Rows completed</span>
                <small>Coming soon</small>
              </p>
            </div>
            <div>
              <Icon name="clock" />
              <p>
                <strong aria-label="Not available">—</strong>
                <span>Time spent</span>
                <small>Coming soon</small>
              </p>
            </div>
            <div>
              <Icon name="stitch" />
              <p>
                <strong aria-label="Not available">—</strong>
                <span>Stitches knitted</span>
                <small>Coming soon</small>
              </p>
            </div>
          </div>
          <p className={styles.statsNote}>
            Progress tracking is on its way. For now, your saved projects are
            counted here.
          </p>
          <blockquote className={styles.motto}>
            “Progress, not perfection.” <Icon name="heart" />
          </blockquote>
        </section>
      </div>
    </>
  );
}
