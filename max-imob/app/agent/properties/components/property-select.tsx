type PropertySelectOption = {
  label: string;
  value: string;
};

type PropertySelectProps = {
  label: string;
  name: string;
  onChange: (value: string) => void;
  options: PropertySelectOption[];
  required?: boolean;
  value: string;
};

export default function PropertySelect({
  label,
  name,
  onChange,
  options,
  required = false,
  value,
}: PropertySelectProps) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <select
        className="form-select"
        id={name}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
