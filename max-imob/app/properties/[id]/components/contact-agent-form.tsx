"use client";

import { useState, type FormEvent } from "react";

type ContactAgentFormProps = {
  onError: (error: string) => void;
  onSuccess: () => void;
  propertyId: string;
};

export default function ContactAgentForm({
  onError,
  onSuccess,
  propertyId,
}: ContactAgentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/properties/${propertyId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          contactName: name,
          contactEmail: email,
          contactPhone: phone,
          messageContent: message,
        }),
      });

      const data = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Eroare la trimiterea mesajului.");
      }

      setName("");
      setEmail("");
      setPhone("");
      setMessage("");

      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Eroare necunoscută.";
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="row g-3" onSubmit={handleSubmit}>
      <div className="col-12">
        <label className="form-label" htmlFor="contactName">
          Nume
        </label>
        <input
          className="form-control"
          id="contactName"
          maxLength={100}
          minLength={2}
          onChange={(event) => setName(event.target.value)}
          placeholder="Introdu numele"
          required
          type="text"
          value={name}
        />
      </div>

      <div className="col-12">
        <label className="form-label" htmlFor="contactEmail">
          Email
        </label>
        <input
          className="form-control"
          id="contactEmail"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Introdu email-ul"
          required
          type="email"
          value={email}
        />
      </div>

      <div className="col-12">
        <label className="form-label" htmlFor="contactPhone">
          Telefon
        </label>
        <input
          className="form-control"
          id="contactPhone"
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Introdu telefonul"
          required
          type="tel"
          value={phone}
        />
      </div>

      <div className="col-12">
        <label className="form-label" htmlFor="messageContent">
          Mesaj
        </label>
        <textarea
          className="form-control"
          id="messageContent"
          maxLength={5000}
          minLength={10}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Introdu mesajul tău (minim 10 caractere)"
          required
          rows={4}
          value={message}
        />
      </div>

      <div className="col-12">
        <button className="btn btn-primary w-100" disabled={isLoading} type="submit">
          {isLoading ? "Se trimite..." : "Trimite mesaj"}
        </button>
      </div>
    </form>
  );
}
