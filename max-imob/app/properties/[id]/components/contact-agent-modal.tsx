"use client";

import { useState } from "react";
import ContactAgentForm from "./contact-agent-form";

type ContactAgentModalProps = {
  propertyId: string;
};

export default function ContactAgentModal({ propertyId }: ContactAgentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleOpen() {
    setIsOpen(true);
    setSuccessMessage("");
    setErrorMessage("");
  }

  function handleClose() {
    setIsOpen(false);
    setSuccessMessage("");
    setErrorMessage("");
  }

  function handleSuccess() {
    setSuccessMessage("Mesajul a fost trimis cu succes! Agentul va reveni în scurt timp.");
    setTimeout(() => {
      handleClose();
    }, 2000);
  }

  function handleError(error: string) {
    setErrorMessage(error);
  }

  return (
    <>
      <button className="btn btn-primary w-100 mb-3" onClick={handleOpen}>
        Contactează agent
      </button>

      {isOpen ? (
        <div
          aria-hidden="false"
          aria-labelledby="contactAgentModalLabel"
          className="modal fade show"
          role="dialog"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex={-1}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="contactAgentModalLabel">
                  Contactează agentul
                </h5>
                <button
                  aria-label="Inchide"
                  className="btn-close"
                  onClick={handleClose}
                  type="button"
                />
              </div>

              <div className="modal-body">
                {successMessage ? (
                  <div className="alert alert-success mb-3">{successMessage}</div>
                ) : null}

                {errorMessage ? (
                  <div className="alert alert-danger mb-3">{errorMessage}</div>
                ) : null}

                <ContactAgentForm
                  onError={handleError}
                  onSuccess={handleSuccess}
                  propertyId={propertyId}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleClose}
                  type="button"
                >
                  Anulează
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isOpen ? (
        <div
          className="modal-backdrop fade show"
          onClick={handleClose}
          style={{ display: "block" }}
        />
      ) : null}
    </>
  );
}
