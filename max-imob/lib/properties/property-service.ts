import { randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import { getPool } from "@/lib/db/pool";
import type { SavedPropertyImage } from "@/lib/properties/image-storage";
import type {
  CreatePropertyInput,
  PublicPropertyFilters,
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
  city: string;
  address: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  area: number;
  isActive: boolean;
  images: PropertyImage[];
  createdAt: string;
  updatedAt: string;
};

type PropertyRow = {
  id: string;
  agent_id: string;
  title: string;
  description: string;
  price: string;
  city: string;
  address: string;
  property_type: PropertyType;
  status: PropertyStatus;
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

export async function listAgentProperties(agentId: string) {
  const result = await getPool().query<PropertyRow>(
    `
      SELECT *
      FROM properties
      WHERE agent_id = $1
      ORDER BY created_at DESC
    `,
    [agentId],
  );

  return mapPropertyRows(result.rows);
}

export async function listPublicProperties(filters: PublicPropertyFilters = {}) {
  const queryParts = [
    "status = 'publicata'",
    "is_active = true",
  ];
  const queryValues: Array<string | number> = [];

  if (filters.city) {
    queryValues.push(`%${filters.city}%`);
    queryParts.push(`city ILIKE $${queryValues.length}`);
  }

  if (filters.propertyType) {
    queryValues.push(filters.propertyType);
    queryParts.push(`property_type = $${queryValues.length}`);
  }

  if (filters.bedrooms !== undefined) {
    queryValues.push(filters.bedrooms);
    queryParts.push(`bedrooms = $${queryValues.length}`);
  }
  // console.log(`SELECT *
  //     FROM properties
  //     WHERE ${queryParts.join(" AND ")}
  //     ORDER BY created_at DESC`);

  const result = await getPool().query<PropertyRow>(
    `
      SELECT *
      FROM properties
      WHERE ${queryParts.join(" AND ")}
      ORDER BY created_at DESC
    `,
    queryValues,
  );

  return mapPropertyRows(result.rows);
}

export async function createProperty(
  agentId: string,
  input: CreatePropertyInput,
  images: SavedPropertyImage[],
) {
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");

    const propertyId = randomUUID();
    const result = await client.query<PropertyRow>(
      `
        INSERT INTO properties (
          id,
          agent_id,
          title,
          description,
          price,
          city,
          address,
          property_type,
          status,
          bedrooms,
          bathrooms,
          area,
          is_active,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      [
        propertyId,
        agentId,
        input.title,
        input.description,
        input.price,
        input.city,
        input.address,
        input.propertyType,
        input.status,
        input.bedrooms,
        input.bathrooms,
        input.area,
      ],
    );

    await insertPropertyImages(client, propertyId, images, 0);
    await client.query("COMMIT");

    return mapPropertyRow(result.rows[0], await listImagesForProperty(propertyId));
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getAgentPropertyById(agentId: string, propertyId: string) {
  const result = await getPool().query<PropertyRow>(
    `
      SELECT *
      FROM properties
      WHERE id = $1 AND agent_id = $2
      LIMIT 1
    `,
    [propertyId, agentId],
  );

  return mapOptionalProperty(result.rows[0]);
}

export async function getPublicPropertyById(propertyId: string) {
  const result = await getPool().query<PropertyRow>(
    `
      SELECT *
      FROM properties
      WHERE id = $1 AND status = 'publicata' AND is_active = true
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
) {
  const currentProperty = await getAgentPropertyById(agentId, propertyId);

  if (!currentProperty) {
    return null;
  }

  const nextProperty = {
    title: input.title ?? currentProperty.title,
    description: input.description ?? currentProperty.description,
    price: input.price ?? currentProperty.price,
    city: input.city ?? currentProperty.city,
    address: input.address ?? currentProperty.address,
    propertyType: input.propertyType ?? currentProperty.propertyType,
    status: input.status ?? currentProperty.status,
    bedrooms: input.bedrooms ?? currentProperty.bedrooms,
    bathrooms: input.bathrooms ?? currentProperty.bathrooms,
    area: input.area ?? currentProperty.area,
  };

  const client = await getPool().connect();

  try {
    await client.query("BEGIN");

    const result = await client.query<PropertyRow>(
      `
        UPDATE properties
        SET title = $3,
            description = $4,
            price = $5,
            city = $6,
            address = $7,
            property_type = $8,
            status = $9,
            bedrooms = $10,
            bathrooms = $11,
            area = $12,
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
        nextProperty.city,
        nextProperty.address,
        nextProperty.propertyType,
        nextProperty.status,
        nextProperty.bedrooms,
        nextProperty.bathrooms,
        nextProperty.area,
      ],
    );

    const currentImageCount = currentProperty.images.length;
    await insertPropertyImages(client, propertyId, images, currentImageCount);
    await client.query("COMMIT");

    return mapPropertyRow(result.rows[0], await listImagesForProperty(propertyId));
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
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

  return mapOptionalProperty(result.rows[0]);
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

  return mapOptionalProperty(result.rows[0]);
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

function mapPropertyRow(row: PropertyRow, images: PropertyImage[]): Property {
  return {
    id: row.id,
    agentId: row.agent_id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    city: row.city,
    address: row.address,
    propertyType: row.property_type,
    status: row.status,
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
