"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { requestMessages, getErrorMessage } from "../lib/api";
import type { Message } from "../lib/types";

export default function MessagesList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadMessages();
  }, []);

  async function loadMessages() {
    setIsLoading(true);
    setError("");

    try {
      const payload = await requestMessages("/api/agent/messages");
      setMessages(payload.data?.messages ?? []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h5 fw-bold mb-0">Mesaje primite</h2>
            <p className="text-secondary mb-0">Mesajele primite din formularul de contact.</p>
          </div>
          <button className="btn btn-outline-primary btn-sm" type="button" onClick={loadMessages}>
            Reîncarcă
          </button>
        </div>

        {error ? <div className="alert alert-danger">{error}</div> : null}

        {isLoading ? (
          <p className="text-secondary mb-0">Se încarcă mesajele...</p>
        ) : messages.length === 0 ? (
          <div className="alert alert-info">Nu există mesaje primite în acest moment.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Proprietate</th>
                  <th>Nume</th>
                  <th>Email</th>
                  <th>Telefon</th>
                  <th>Mesaj</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id}>
                    <td>{new Date(message.createdAt).toLocaleString("ro-RO")}</td>
                    <td>
                      <Link href={`/properties/${message.propertyId}`} className="text-decoration-none">
                        {message.propertyTitle}
                      </Link>
                    </td>
                    <td>{message.contactName}</td>
                    <td>{message.contactEmail}</td>
                    <td>{message.contactPhone}</td>
                    <td>{message.messageContent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
