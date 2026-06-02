"use client";

import { useState } from "react";

type ContactAgentFormProps = {
  propertyId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
};

export default function ContactAgentForm({
  propertyId,
  onSuccess,
  onError,
}: ContactAgentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        throw new Error(data.error || "Eroare la trimiterea mesajului");
      }

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");

      onSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Eroare necunoscută";
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-12">
        <label htmlFor="contactName" className="form-label">
          Nume
        </label>
        <input
          type="text"
          className="form-control"
          id="contactName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={100}
          placeholder="Introdu-ți numele"
        />
      </div>

      <div className="col-12">
        <label htmlFor="contactEmail" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="contactEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Introdu-ți email-ul"
        />
      </div>

      <div className="col-12">
        <label htmlFor="contactPhone" className="form-label">
          Telefon
        </label>
        <input
          type="tel"
          className="form-control"
          id="contactPhone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="Introdu-ți telefonul"
        />
      </div>

      <div className="col-12">
        <label htmlFor="messageContent" className="form-label">
          Mesaj
        </label>
        <textarea
          className="form-control"
          id="messageContent"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={10}
          maxLength={5000}
          rows={4}
          placeholder="Introdu mesajul tău (minim 10 caractere)"
        />
      </div>

      <div className="col-12">
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isLoading}
        >
          {isLoading ? "Se trimite..." : "Trimite Mesaj"}
        </button>
      </div>
    </form>
  );
}
