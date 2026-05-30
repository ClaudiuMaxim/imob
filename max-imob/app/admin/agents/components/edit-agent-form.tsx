import { FormEvent } from "react";
import TextInput from "./text-input";

type EditAgentFormProps = {
  editIsActive: boolean;
  editName: string;
  editPhone: string;
  isSaving: boolean;
  onCancel: () => void;
  onEditIsActiveChange: (value: boolean) => void;
  onEditNameChange: (value: string) => void;
  onEditPhoneChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function EditAgentForm({
  editIsActive,
  editName,
  editPhone,
  isSaving,
  onCancel,
  onEditIsActiveChange,
  onEditNameChange,
  onEditPhoneChange,
  onSubmit,
}: EditAgentFormProps) {
  return (
    <section className="card border-0 shadow-sm mt-4">
      <div className="card-body">
        <h2 className="h5 fw-bold mb-3">Editează agent</h2>
        <form onSubmit={onSubmit}>
          <TextInput
            label="Nume"
            name="edit-name"
            onChange={onEditNameChange}
            required
            value={editName}
          />
          <TextInput
            label="Telefon"
            name="edit-phone"
            onChange={onEditPhoneChange}
            value={editPhone}
          />
          <div className="form-check form-switch mb-3">
            <input
              checked={editIsActive}
              className="form-check-input"
              id="edit-active"
              onChange={(event) => onEditIsActiveChange(event.target.checked)}
              type="checkbox"
            />
            <label className="form-check-label" htmlFor="edit-active">
              Agent activ
            </label>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-primary" disabled={isSaving} type="submit">
              Salvează
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={onCancel}
              type="button"
            >
              Anulează
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
