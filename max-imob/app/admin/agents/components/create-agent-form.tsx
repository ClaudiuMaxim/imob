import { FormEvent } from "react";
import TextInput from "./text-input";

type CreateAgentFormProps = {
  createEmail: string;
  createName: string;
  createPassword: string;
  createPhone: string;
  isSaving: boolean;
  onCreateEmailChange: (value: string) => void;
  onCreateNameChange: (value: string) => void;
  onCreatePasswordChange: (value: string) => void;
  onCreatePhoneChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function CreateAgentForm({
  createEmail,
  createName,
  createPassword,
  createPhone,
  isSaving,
  onCreateEmailChange,
  onCreateNameChange,
  onCreatePasswordChange,
  onCreatePhoneChange,
  onSubmit,
}: CreateAgentFormProps) {
  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body">
        <h2 className="h5 fw-bold mb-3">Agent nou</h2>
        <form onSubmit={onSubmit}>
          <TextInput
            label="Nume"
            name="name"
            onChange={onCreateNameChange}
            required
            value={createName}
          />
          <TextInput
            label="Email"
            name="email"
            onChange={onCreateEmailChange}
            required
            type="email"
            value={createEmail}
          />
          <TextInput
            label="Telefon"
            name="phone"
            onChange={onCreatePhoneChange}
            value={createPhone}
          />
          <TextInput
            label="Parolă"
            name="password"
            onChange={onCreatePasswordChange}
            required
            type="password"
            value={createPassword}
          />
          <button className="btn btn-primary w-100" disabled={isSaving} type="submit">
            Creează agent
          </button>
        </form>
      </div>
    </section>
  );
}
