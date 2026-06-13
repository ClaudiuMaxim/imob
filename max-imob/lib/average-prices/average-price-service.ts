import { getPool } from "@/lib/db/pool";
import type { PropertyOffer, PropertyType } from "@/lib/properties/validation";

export type AveragePrice = {
  id: string;
  cityId: string;
  city: string;
  propertyType: PropertyType;
  offerType: PropertyOffer;
  price: number;
};

type AveragePriceRow = {
  id: string;
  city_id: string;
  city: string;
  property_type: PropertyType;
  offer_type: PropertyOffer;
  price: string;
};

export async function listAveragePrices() {
  const result = await getPool().query<AveragePriceRow>(
    `
      SELECT
        average_prices.id,
        average_prices.city_id,
        cities.name AS city,
        average_prices."type" AS property_type,
        average_prices.offer_type,
        average_prices.price
      FROM average_prices
      JOIN cities ON cities.id = average_prices.city_id
      ORDER BY cities.name ASC, average_prices."type" ASC, average_prices.offer_type ASC
    `,
  );

  return result.rows.map(mapAveragePriceRow);
}

function mapAveragePriceRow(row: AveragePriceRow): AveragePrice {
  return {
    id: row.id,
    cityId: row.city_id,
    city: row.city,
    propertyType: row.property_type,
    offerType: row.offer_type,
    price: Number(row.price),
  };
}
