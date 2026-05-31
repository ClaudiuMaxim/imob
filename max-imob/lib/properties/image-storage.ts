import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type SavedPropertyImage = {
  fileName: string;
  imageUrl: string;
};

const uploadFolder = path.join(process.cwd(), "public", "uploads", "properties");

export function getImageFiles(formData: FormData) {
  const values = formData.getAll("images");
  const files: File[] = [];

  for (const value of values) {
    if (value instanceof File && value.size > 0) {
      files.push(value);
    }
  }

  return files;
}

export function validateImageFiles(files: File[], mustHaveImages: boolean) {
  if (mustHaveImages && files.length === 0) {
    return "Trebuie să încarci cel puțin o poză.";
  }

  for (const file of files) {
    if (!isAllowedImageType(file.type)) {
      return "Pozele trebuie să fie JPEG, PNG sau WEBP.";
    }
  }

  return null;
}

export async function savePropertyImages(files: File[]) {
  const savedImages: SavedPropertyImage[] = [];

  await mkdir(uploadFolder, {
    recursive: true,
  });

  for (const file of files) {
    const fileName = createFileName(file.type);
    const filePath = path.join(uploadFolder, fileName);
    const bytes = await file.arrayBuffer();

    await writeFile(filePath, Buffer.from(bytes));

    savedImages.push({
      fileName,
      imageUrl: `/uploads/properties/${fileName}`,
    });
  }

  return savedImages;
}

function isAllowedImageType(type: string) {
  return type === "image/jpeg" || type === "image/png" || type === "image/webp";
}

function createFileName(type: string) {
  return `${randomUUID()}${getFileExtension(type)}`;
}

function getFileExtension(type: string) {
  if (type === "image/png") {
    return ".png";
  }

  if (type === "image/webp") {
    return ".webp";
  }

  return ".jpg";
}
