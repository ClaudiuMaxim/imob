type TextInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: "email" | "password" | "text";
};

export default function TextInput({
  label,
  name,
  onChange,
  required = false,
  type = "text",
  value,
}: TextInputProps) {
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
