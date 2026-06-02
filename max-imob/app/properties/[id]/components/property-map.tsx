"use client";

import { useEffect, useState } from "react";

type PropertyMapProps = {
  address: string;
};

export default function PropertyMap({ address }: PropertyMapProps) {
  const [mapUrl, setMapUrl] = useState("");
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState("");

  useEffect(() => {
    if (!address) {
      setMapUrl("");
      setMapError("");
      return;
    }

    const controller = new AbortController();
    const encodedAddress = encodeURIComponent(address);
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`;

    setMapLoading(true);
    setMapError("");
    setMapUrl("");

    fetch(nominatimUrl, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Nu s-a putut geocodifica adresa.");
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Adresa nu a fost găsită pe OpenStreetMap.");
        }

        const { lat, lon } = data[0];
        const delta = 0.01;
        const minLon = Number(lon) - delta;
        const minLat = Number(lat) - delta;
        const maxLon = Number(lon) + delta;
        const maxLat = Number(lat) + delta;

        setMapUrl(
          `https://www.openstreetmap.org/export/embed.html?bbox=${minLon},${minLat},${maxLon},${maxLat}&layer=mapnik&marker=${lat},${lon}`,
        );
      })
      .catch((error) => {
        if (error instanceof Error && error.name !== "AbortError") {
          setMapError(error.message);
        }
      })
      .finally(() => {
        setMapLoading(false);
      });

    return () => controller.abort();
  }, [address]);

  return (
    <div>
      {mapLoading && <p className="text-secondary">Se încarcă harta...</p>}
      {mapError && <div className="alert alert-warning">{mapError}</div>}

      {mapUrl && (
        <div className="mb-3">
          <div className="ratio ratio-16x9">
            <iframe
              src={mapUrl}
              title="Hartă OpenStreetMap"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
            />
          </div>
        </div>
      )}

      <div className="mb-3">
        <a
          href={`https://openstreetmap.org/search?query=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-outline-primary"
        >
          Deschide pe hartă în OpenStreetMap
        </a>
      </div>
    </div>
  );
}
