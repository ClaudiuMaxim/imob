import Image from "next/image";
import type { PropertyImage } from "../lib/types";

type PropertyExistingImagesProps = {
  images: PropertyImage[];
  onMoveDown: (imageId: string) => void;
  onMoveUp: (imageId: string) => void;
  onRemove: (imageId: string) => void;
};

export default function PropertyExistingImages({
  images,
  onMoveDown,
  onMoveUp,
  onRemove,
}: PropertyExistingImagesProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mb-3">
      <label className="form-label">Poze existente</label>
      <div className="d-flex flex-column gap-2">
        {images.map((image, index) => (
          <div
            className="border rounded p-2 d-flex align-items-center gap-2"
            key={image.id}
          >
            <Image
              alt={image.fileName}
              className="rounded object-fit-cover"
              height={64}
              src={image.imageUrl}
              width={88}
            />
            <div className="flex-grow-1 small text-secondary">
              {index === 0 ? "Imagine principala" : `Pozitia ${index + 1}`}
            </div>
            <div className="btn-group btn-group-sm" role="group">
              <button
                className="btn btn-outline-secondary"
                disabled={index === 0}
                onClick={() => onMoveUp(image.id)}
                title="Muta mai sus"
                type="button"
              >
                <i className="bi bi-arrow-up"></i>
              </button>
              <button
                className="btn btn-outline-secondary"
                disabled={index === images.length - 1}
                onClick={() => onMoveDown(image.id)}
                title="Muta mai jos"
                type="button"
              >
                <i className="bi bi-arrow-down"></i>
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => onRemove(image.id)}
                title="Sterge poza"
                type="button"
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="form-text">
        Prima poza din lista este folosita ca imagine principala.
      </div>
    </div>
  );
}
