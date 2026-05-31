type PropertyTextInputProps = {
  label: string;
  name: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: "number" | "text";
  value: string;
};

export default function PropertyTextInput({
  label,
  name,
  onChange,
  required = false,
  type = "text",
  value,
}: PropertyTextInputProps) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <input
        className="form-control"
        id={name}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
    </div>
  );
}
