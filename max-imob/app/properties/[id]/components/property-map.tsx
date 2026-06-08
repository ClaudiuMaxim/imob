"use client";

import { useEffect, useState } from "react";

type PropertyMapProps = {
  address: string;
};

export default function PropertyMap({ address }: PropertyMapProps) {
  const [mapState, setMapState] = useState({
    address: "",
    error: "",
    url: "",
  });
  const mapLoading = Boolean(address && mapState.address !== address);
  const mapUrl = mapState.address === address ? mapState.url : "";
  const mapError = mapState.address === address ? mapState.error : "";

  useEffect(() => {
    if (!address) {
      return;
    }

    const controller = new AbortController();
    const encodedAddress = encodeURIComponent(address);
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`;

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

        setMapState({
          address,
          error: "",
          url: `https://www.openstreetmap.org/export/embed.html?bbox=${minLon},${minLat},${maxLon},${maxLat}&layer=mapnik&marker=${lat},${lon}`,
        });
      })
      .catch((error) => {
        if (error instanceof Error && error.name !== "AbortError") {
          setMapState({
            address,
            error: error.message,
            url: "",
          });
        }
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
