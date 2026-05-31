import type { ChangeEvent } from "react";

type PropertyImagesInputProps = {
  inputKey: number;
  isEditing: boolean;
  onChange: (files: File[]) => void;
  selectedCount: number;
};

export default function PropertyImagesInput({
  inputKey,
  isEditing,
  onChange,
  selectedCount,
}: PropertyImagesInputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    onChange(files);
  }

  return (
    <div className="mb-3">
      <label className="form-label" htmlFor="property-images">
        Poze
      </label>
      <input
        accept="image/jpeg,image/png,image/webp"
        className="form-control"
        id="property-images"
        key={inputKey}
        multiple
        onChange={handleChange}
        required={!isEditing}
        type="file"
      />
      <div className="form-text">
        {selectedCount > 0
          ? `${selectedCount} poze selectate`
          : isEditing
            ? "Pozele noi se adauga peste cele existente."
            : "Adauga cel putin o poza."}
      </div>
    </div>
  );
}
