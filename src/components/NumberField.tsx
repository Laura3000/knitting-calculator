interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function NumberField({ label, value, onChange }: NumberFieldProps) {
  return (
    <label>
      {label}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
