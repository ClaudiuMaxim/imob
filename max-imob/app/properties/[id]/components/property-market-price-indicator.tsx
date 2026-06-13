"use client";

import { useState } from "react";
import type { Property } from "../../lib/types";

type MarketStatus = "below" | "near" | "above";

type PropertyMarketPriceIndicatorProps = {
  property: Property;
};

const nearMarketThreshold = 0.05;

export default function PropertyMarketPriceIndicator({
  property,
}: PropertyMarketPriceIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const marketPrice = property.averagePrice?.price ?? 0;

  if (property.area <= 0 || marketPrice <= 0) {
    return ""
  }

  const propertyPricePerSquareMeter = property.price / property.area;
  const difference = propertyPricePerSquareMeter - marketPrice;
  const differencePercent = difference / marketPrice;
  const status = getMarketStatus(differencePercent);
  const config = getMarketStatusConfig(status);

  return (
    <>
      <button
        className={`btn btn-sm ${config.buttonClass} mt-2`}
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <i className={`bi ${config.icon} me-1`}></i>
        {config.label}
      </button>

      {isOpen ? (
        <>
          <div
            aria-modal="true"
            className="modal d-block"
            role="dialog"
            tabIndex={-1}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title h5">Comparatie pret piata</h2>
                  <button
                    aria-label="Inchide"
                    className="btn-close"
                    onClick={() => setIsOpen(false)}
                    type="button"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className={`badge ${config.badgeClass}`}>
                      <i className={`bi ${config.icon} me-1`}></i>
                      {config.label}
                    </span>
                  </div>

                  <dl className="row mb-0">
                    <dt className="col-7 fw-normal text-secondary">
                      {property.offerType ==='vanzare' ? 'Pret proprietate' :'Pret inchiriere'}
                    
                      </dt>
                    <dd className="col-5 text-end fw-semibold">
                      {formatCurrency(property.price)}
                    </dd>

                    <dt className="col-7 fw-normal text-secondary">Suprafata</dt>
                    <dd className="col-5 text-end fw-semibold">
                      {formatArea(property.area)}
                    </dd>

                    <dt className="col-7 fw-normal text-secondary">
                      {property.offerType ==='vanzare' ? ' Pret proprietate/mp' :'Pret inchiriere/mp'}
                     
                      </dt>
                    <dd className="col-5 text-end fw-semibold">
                      {formatCurrency(propertyPricePerSquareMeter)}
                    </dd>

                    <dt className="col-7 fw-normal text-secondary">
                      {property.offerType ==='vanzare' ? 'Pret mediu piata/mp' :'Pret mediu inchiriere/mp'}
                      
                      </dt>
                    <dd className="col-5 text-end fw-semibold">
                      {formatCurrency(marketPrice)}
                    </dd>

                    <dt className="col-7 fw-normal text-secondary">Diferenta fata de medie</dt>
                    <dd className={`col-5 text-end fw-semibold ${config.textClass}`}>
                      {formatDifference(difference, differencePercent)}
                    </dd>
                  </dl>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setIsOpen(false)}
                    type="button"
                  >
                    Inchide
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" onClick={() => setIsOpen(false)}></div>
        </>
      ) : null}
    </>
  );
}

function getMarketStatus(differencePercent: number): MarketStatus {
  if (Math.abs(differencePercent) <= nearMarketThreshold) {
    return "near";
  }

  return differencePercent < 0 ? "below" : "above";
}

function getMarketStatusConfig(status: MarketStatus) {
  if (status === "below") {
    return {
      badgeClass: "text-bg-success",
      buttonClass: "btn-outline-success",
      icon: "bi-arrow-down-circle",
      label: "Sub media pietei",
      textClass: "text-success",
    };
  }

  if (status === "above") {
    return {
      badgeClass: "text-bg-danger",
      buttonClass: "btn-outline-danger",
      icon: "bi-arrow-up-circle",
      label: "Peste media pietei",
      textClass: "text-danger",
    };
  }

  return {
    badgeClass: "text-bg-primary",
    buttonClass: "btn-outline-primary",
    icon: "bi-dash-circle",
    label: "Aproape de medie",
    textClass: "text-primary",
  };
}

function formatCurrency(value: number) {
  return `${Math.round(value).toLocaleString("ro-RO")} EUR`;
}

function formatArea(value: number) {
  return `${value.toLocaleString("ro-RO")} mp`;
}

function formatDifference(value: number, percent: number) {
  const sign = value > 0 ? "+" : "";
  const formattedPercent = Math.abs(percent * 100).toFixed(1);

  return `${sign}${formatCurrency(value)} (${formattedPercent}%)`;
}
