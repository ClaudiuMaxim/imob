import { randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import { getPool } from "@/lib/db/pool";
import type { SavedPropertyImage } from "@/lib/properties/image-storage";
import type {
  CreatePropertyInput,
  PublicPropertyFilters,
  PropertyOffer,
  PropertyStatus,
  PropertyType,
  UpdatePropertyInput,
} from "@/lib/properties/validation";

export type PropertyImage = {
  id: string;
  imageUrl: string;
  fileName: string;
  sortOrder: number;
};

export type Property = {
  id: string;
  agentId: string;
  title: string;
  description: string;
  price: number;
  cityId: string;
  city: string;
  address: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  offerType: PropertyOffer;
  bedrooms: number;
  bathrooms: number;
  area: number;
  isActive: boolean;
  images: PropertyImage[];
  createdAt: string;
  updatedAt: string;
};

export type PropertyImageUpdate = {
  keptImageIds: string[];
  imageOrder: string[];
};

type PropertyRow = {
  id: string;
  agent_id: string;
  title: string;
  description: string;
  price: string;
  city_id: string;
  city: string;
  address: string;
  property_type: PropertyType;
  status: PropertyStatus;
  offer_type: PropertyOffer;
  bedrooms: number;
  bathrooms: number;
  area: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

type PropertyImageRow = {
  id: string;
  image_url: string;
  file_name: string;
  sort_order: number;
};

export class PropertyInputError extends Error {
  status = 400;
}

export async function listAgentProperties(agentId: string) {
  const result = await getPool().query<PropertyRow>(
    `
      SELECT properties.*, cities.name AS city
      FROM properties
      JOIN cities ON cities.id = properties.city_id
      WHERE properties.agent_id = $1
      ORDER BY properties.created_at DESC
    `,
    [agentId],
  );

  return mapPropertyRows(result.rows);
}

export async function listPublicProperties(filters: PublicPropertyFilters = {}) {
  const queryParts = [
    "properties.status = 'publicata'",
    "properties.is_active = true",
  ];
  const queryValues: Array<string | number> = [];

  if (filters.cityId) {
    queryValues.push(filters.cityId);
    queryParts.push(`properties.city_id = $${queryValues.length}`);
  }

  if (filters.propertyType) {
    queryValues.push(filters.propertyType);
    queryParts.push(`properties.property_type = $${queryValues.length}`);
  }

  if (filters.offerType) {
    queryValues.push(filters.offerType);
    queryParts.push(`properties.offer_type = $${queryValues.length}`);
  }

  if (filters.bedrooms) {
    queryValues.push(filters.bedrooms);
    queryParts.push(`properties.bedrooms = $${queryValues.length}`);
  }

  const result = await getPool().query<PropertyRow>(
    `
      SELECT properties.*, cities.name AS city
      FROM properties
      JOIN cities ON cities.id = properties.city_id
      WHERE ${queryParts.join(" AND ")}
      ORDER BY properties.created_at DESC
      
    `,
    queryValues,
  );

  return mapPropertyRows(result.rows);
}

export async function getLastProperties(){
    const result = await getPool().query<PropertyRow>(
    `
      SELECT properties.*, cities.name AS city
      FROM properties
      JOIN cities ON cities.id = properties.city_id
      ORDER BY properties.created_at DESC LIMIT 3
    `
  );

  return mapPropertyRows(result.rows);
}

export async function createProperty(
  agentId: string,
  input: CreatePropertyInput,
  images: SavedPropertyImage[],
) {
  const client = await getPool().connect();
  const propertyId = randomUUID();

  try {
    await client.query("BEGIN");

    const cityId = await resolveCityId(client, input.cityId);
    await client.query(
      `
        INSERT INTO properties (
          id,
          agent_id,
          title,
          description,
          price,
          city_id,
          address,
          property_type,
          status,
          offer_type,
          bedrooms,
          bathrooms,
          area,
          is_active,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      [
        propertyId,
        agentId,
        input.title,
        input.description,
        input.price,
        cityId,
        input.address,
        input.propertyType,
        input.status,
        input.offerType,
        input.bedrooms,
        input.bathrooms,
        input.area,
      ],
    );

    await insertPropertyImages(client, propertyId, images, 0);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return getAgentPropertyById(agentId, propertyId);
}

export async function getAgentPropertyById(agentId: string, propertyId: string) {
  const result = await getPool().query<PropertyRow>(
    `
      SELECT properties.*, cities.name AS city
      FROM properties
      JOIN cities ON cities.id = properties.city_id
      WHERE properties.id = $1 AND properties.agent_id = $2
      LIMIT 1
    `,
    [propertyId, agentId],
  );

  return mapOptionalProperty(result.rows[0]);
}

export async function getPublicPropertyById(propertyId: string) {
  const result = await getPool().query<PropertyRow>(
    `
      SELECT properties.*, cities.name AS city
      FROM properties
      JOIN cities ON cities.id = properties.city_id
      WHERE properties.id = $1 AND properties.status = 'publicata' AND properties.is_active = true
      LIMIT 1
    `,
    [propertyId],
  );

  return mapOptionalProperty(result.rows[0]);
}

export async function updateProperty(
  agentId: string,
  propertyId: string,
  input: UpdatePropertyInput,
  images: SavedPropertyImage[],
  imageUpdate?: PropertyImageUpdate,
) {
  const currentProperty = await getAgentPropertyById(agentId, propertyId);

  if (!currentProperty) {
    return null;
  }

  const nextProperty = {
    title: input.title ?? currentProperty.title,
    description: input.description ?? currentProperty.description,
    price: input.price ?? currentProperty.price,
    cityId: input.cityId ?? currentProperty.cityId,
    address: input.address ?? currentProperty.address,
    propertyType: input.propertyType ?? currentProperty.propertyType,
    status: input.status ?? currentProperty.status,
    offerType: input.offerType ?? currentProperty.offerType,
    bedrooms: input.bedrooms ?? currentProperty.bedrooms,
    bathrooms: input.bathrooms ?? currentProperty.bathrooms,
    area: input.area ?? currentProperty.area,
  };

  const client = await getPool().connect();

  try {
    await client.query("BEGIN");

    const cityId =
      input.cityId
        ? await resolveCityId(client, input.cityId)
        : currentProperty.cityId;
    await client.query(
      `
        UPDATE properties
        SET title = $3,
            description = $4,
            price = $5,
            city_id = $6,
            address = $7,
            property_type = $8,
            status = $9,
            offer_type = $10,
            bedrooms = $11,
            bathrooms = $12,
            area = $13,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND agent_id = $2
        RETURNING *
      `,
      [
        propertyId,
        agentId,
        nextProperty.title,
        nextProperty.description,
        nextProperty.price,
        cityId,
        nextProperty.address,
        nextProperty.propertyType,
        nextProperty.status,
        nextProperty.offerType,
        nextProperty.bedrooms,
        nextProperty.bathrooms,
        nextProperty.area,
      ],
    );

    const imageStartIndex = await applyPropertyImageUpdate(
      client,
      propertyId,
      currentProperty.images,
      imageUpdate,
      images.length,
    );
    await insertPropertyImages(client, propertyId, images, imageStartIndex);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return getAgentPropertyById(agentId, propertyId);
}

async function applyPropertyImageUpdate(
  client: PoolClient,
  propertyId: string,
  currentImages: PropertyImage[],
  imageUpdate: PropertyImageUpdate | undefined,
  newImageCount: number,
) {
  if (!imageUpdate) {
    return currentImages.length;
  }

  validatePropertyImageUpdate(currentImages, imageUpdate, newImageCount);

  const keptImageIds = new Set(imageUpdate.keptImageIds);

  for (const image of currentImages) {
    if (!keptImageIds.has(image.id)) {
      await client.query(
        `
          DELETE FROM property_images
          WHERE id = $1 AND property_id = $2
        `,
        [image.id, propertyId],
      );
    }
  }

  for (const [index, imageId] of imageUpdate.imageOrder.entries()) {
    await client.query(
      `
        UPDATE property_images
        SET sort_order = $3
        WHERE id = $1 AND property_id = $2
      `,
      [imageId, propertyId, index],
    );
  }

  return imageUpdate.imageOrder.length;
}

function validatePropertyImageUpdate(
  currentImages: PropertyImage[],
  imageUpdate: PropertyImageUpdate,
  newImageCount: number,
) {
  const currentImageIds = new Set(currentImages.map((image) => image.id));
  const keptImageIds = new Set(imageUpdate.keptImageIds);

  for (const imageId of imageUpdate.keptImageIds) {
    if (!currentImageIds.has(imageId)) {
      throw new PropertyInputError("Imaginea selectata nu apartine proprietatii.");
    }
  }

  for (const imageId of imageUpdate.imageOrder) {
    if (!keptImageIds.has(imageId)) {
      throw new PropertyInputError("Ordinea imaginilor este invalida.");
    }
  }

  if (imageUpdate.keptImageIds.length + newImageCount === 0) {
    throw new PropertyInputError("Proprietatea trebuie sa aiba cel putin o poza.");
  }
}

export async function deactivateProperty(agentId: string, propertyId: string) {
  const result = await getPool().query<PropertyRow>(
    `
      UPDATE properties
      SET is_active = false,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND agent_id = $2
      RETURNING *
    `,
    [propertyId, agentId],
  );

  return result.rows[0] ? getAgentPropertyById(agentId, propertyId) : null;
}

export async function activateProperty(agentId: string, propertyId: string) {
  const result = await getPool().query<PropertyRow>(
    `
      UPDATE properties
      SET is_active = true,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND agent_id = $2
      RETURNING *
    `,
    [propertyId, agentId],
  );

  return result.rows[0] ? getAgentPropertyById(agentId, propertyId) : null;
}

async function mapPropertyRows(rows: PropertyRow[]) {
  const properties: Property[] = [];

  for (const row of rows) {
    const images = await listImagesForProperty(row.id);
    properties.push(mapPropertyRow(row, images));
  }

  return properties;
}

async function mapOptionalProperty(row: PropertyRow | undefined) {
  if (!row) {
    return null;
  }

  const images = await listImagesForProperty(row.id);
  return mapPropertyRow(row, images);
}

async function listImagesForProperty(propertyId: string) {
  const result = await getPool().query<PropertyImageRow>(
    `
      SELECT id, image_url, file_name, sort_order
      FROM property_images
      WHERE property_id = $1
      ORDER BY sort_order ASC
    `,
    [propertyId],
  );

  return result.rows.map(mapImageRow);
}

async function insertPropertyImages(
  client: PoolClient,
  propertyId: string,
  images: SavedPropertyImage[],
  startIndex: number,
) {
  let index = startIndex;

  for (const image of images) {
    await client.query(
      `
        INSERT INTO property_images (
          id,
          property_id,
          image_url,
          file_name,
          sort_order
        )
        VALUES ($1, $2, $3, $4, $5)
      `,
      [randomUUID(), propertyId, image.imageUrl, image.fileName, index],
    );
    index += 1;
  }
}

async function resolveCityId(
  client: PoolClient,
  cityId: string,
) {
  const result = await client.query<{ id: string }>(
    `
      SELECT id
      FROM cities
      WHERE id = $1 AND is_active = true
      LIMIT 1
    `,
    [cityId],
  );

  if (!result.rows[0]) {
    throw new PropertyInputError("Orasul selectat nu exista.");
  }

  return result.rows[0].id;
}

function mapPropertyRow(row: PropertyRow, images: PropertyImage[]): Property {
  return {
    id: row.id,
    agentId: row.agent_id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    cityId: row.city_id,
    city: row.city,
    address: row.address,
    propertyType: row.property_type,
    status: row.status,
    offerType: row.offer_type,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    area: Number(row.area),
    isActive: row.is_active,
    images,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function mapImageRow(row: PropertyImageRow): PropertyImage {
  return {
    id: row.id,
    imageUrl: row.image_url,
    fileName: row.file_name,
    sortOrder: row.sort_order,
  };
}
