type PropertyDescriptionProps = {
  onChange: (value: string) => void;
  value: string;
};

export default function PropertyDescription({
  onChange,
  value,
}: PropertyDescriptionProps) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor="description">
        Descriere
      </label>
      <textarea
        className="form-control"
        id="description"
        name="description"
        onChange={(event) => onChange(event.target.value)}
        required
        rows={4}
        value={value}
      />
    </div>
  );
}
