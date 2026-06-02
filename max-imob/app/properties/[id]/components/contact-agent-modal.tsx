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

  const handleOpen = () => {
    setIsOpen(true);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSuccess = () => {
    setSuccessMessage("Mesajul a fost trimis cu succes! Agentul va reveni în scurt timp.");
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  return (
    <>
      {/* Button */}
      <button className="btn btn-primary w-100 mb-3" onClick={handleOpen}>
        Contactează Agent
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex={-1}
          role="dialog"
          aria-labelledby="contactAgentModalLabel"
          aria-hidden="false"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="contactAgentModalLabel">
                  Contactează Agentul
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                  aria-label="Close"
                />
              </div>

              <div className="modal-body">
                {successMessage && (
                  <div className="alert alert-success mb-3">{successMessage}</div>
                )}

                {errorMessage && (
                  <div className="alert alert-danger mb-3">{errorMessage}</div>
                )}

                <ContactAgentForm
                  propertyId={propertyId}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  Anulează
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="modal-backdrop fade show"
          onClick={handleClose}
          style={{ display: "block" }}
        />
      )}
    </>
  );
}
