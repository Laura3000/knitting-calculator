import styles from "./NumberField.module.css";

interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function NumberField({ label, value, onChange }: NumberFieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <input
        type="number"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
