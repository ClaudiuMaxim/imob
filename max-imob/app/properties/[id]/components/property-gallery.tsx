import Image from "next/image";
import type { PropertyImage } from "../../lib/types";

type PropertyGalleryProps = {
  images: PropertyImage[];
  title: string;
};

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const mainImage = images[0];
  const secondaryImages = images.slice(1);

  if (!mainImage) {
    return (
      <div className="rounded bg-light p-5 text-center text-secondary">
        Proprietatea nu are poze.
      </div>
    );
  }

  return (
    <div>
      <div className="ratio ratio-16x9 bg-light rounded overflow-hidden mb-3">
        <Image
          alt={title}
          className="object-fit-cover"
          fill
          priority
          sizes="100vw"
          src={mainImage.imageUrl}
        />
      </div>
      {secondaryImages.length > 0 ? (
        <div className="row g-3">
          {secondaryImages.map((image) => (
            <div className="col-6 col-md-4" key={image.id}>
              <div className="ratio ratio-4x3 bg-light rounded overflow-hidden">
                <Image
                  alt={title}
                  className="object-fit-cover"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  src={image.imageUrl}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
