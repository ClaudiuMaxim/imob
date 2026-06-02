"use client";

import { useState } from "react";
import Image from "next/image";
import type { PropertyImage } from "../../lib/types";

type PropertyGalleryProps = {
  images: PropertyImage[];
  title: string;
};

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="rounded bg-light p-5 text-center text-secondary">
        Proprietatea nu are poze.
      </div>
    );
  }

  function goToIndex(index: number) {
    const nextIndex = (index + images.length) % images.length;
    setActiveIndex(nextIndex);
  }

  function goPrevious() {
    goToIndex(activeIndex - 1);
  }

  function goNext() {
    goToIndex(activeIndex + 1);
  }

  return (
    <div className="carousel slide mb-3">
      {images.length > 1 ? (
        <div className="carousel-indicators mb-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={index === activeIndex ? "active" : ""}
              aria-current={index === activeIndex ? "true" : undefined}
              aria-label={`Slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      ) : null}

      <div className="carousel-inner rounded overflow-hidden bg-light" style={{ minHeight: 360 }}>
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`carousel-item ${index === activeIndex ? "active" : ""}`}
          >
            <div className="ratio ratio-16x9 bg-light">
              <Image
                alt={`${title} - imagine ${index + 1}`}
                className="object-fit-cover"
                fill
                priority={index === 0}
                sizes="100vw"
                src={image.imageUrl}
              />
            </div>
          </div>
        ))}
      </div>

      {images.length > 1 ? (
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-outline-primary btn-sm" type="button" onClick={goPrevious}>
            Poza anterioară
          </button>
          <button className="btn btn-outline-primary btn-sm" type="button" onClick={goNext}>
            Următoarea poza
          </button>
        </div>
      ) : null}
        
    </div>
  );
}
