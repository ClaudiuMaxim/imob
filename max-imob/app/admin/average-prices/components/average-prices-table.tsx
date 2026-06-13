import type { AveragePrice } from "../lib/types";

type AveragePricesTableProps = {
  averagePrices: AveragePrice[];
};

export default function AveragePricesTable({
  averagePrices,
}: AveragePricesTableProps) {
  if (averagePrices.length === 0) {
    return (
      <p className="text-secondary mb-0">
        Nu exista preturi medii calculate momentan.
      </p>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Oras</th>
            <th>Tip proprietate</th>
            <th>Oferta</th>
            <th className="text-end">Pret mediu</th>
          </tr>
        </thead>
        <tbody>
          {averagePrices.map((averagePrice) => (
            <tr key={averagePrice.id}>
              <td className="fw-semibold">{averagePrice.city}</td>
              <td>{getPropertyTypeLabel(averagePrice.propertyType)}</td>
              <td>
                <span className="badge text-bg-light border">
                  {getOfferTypeLabel(averagePrice.offerType)}
                </span>
              </td>
              <td className="text-end fw-semibold">
                {formatAveragePrice(averagePrice.price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getPropertyTypeLabel(propertyType: AveragePrice["propertyType"]) {
  const labels: Record<AveragePrice["propertyType"], string> = {
    apartament: "Apartament",
    casa: "Casa",
    teren: "Teren",
    comercial: "Comercial",
  };

  return labels[propertyType];
}

function getOfferTypeLabel(offerType: AveragePrice["offerType"]) {
  return offerType === "vanzare" ? "Vanzare" : "Inchiriere";
}

function formatAveragePrice(price: number) {
  return `${Math.round(price).toLocaleString("ro-RO")} EUR/mp`;
}
