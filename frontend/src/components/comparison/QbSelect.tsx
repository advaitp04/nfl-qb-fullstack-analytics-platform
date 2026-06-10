type Props = {
  label: string;
  qbNames: string[];
  selectedQb: string;
  onChange: (name: string) => void;
};

function QbSelect({ label, qbNames, selectedQb, onChange }: Props) {
  return (
    <label className="comparison-select">
      <span>{label}</span>
      <select
        value={selectedQb}
        onChange={(event) => onChange(event.target.value)}
      >
        {qbNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}

export default QbSelect;
