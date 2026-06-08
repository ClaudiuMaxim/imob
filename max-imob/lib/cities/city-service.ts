import { getPool } from "@/lib/db/pool";

export type City = {
  id: string;
  name: string;
  countyCode: string;
};

type CityRow = {
  id: string;
  name: string;
  county_code: string;
};

export async function listActiveCities() {
  const result = await getPool().query<CityRow>(
    `
      SELECT id, name, county_code
      FROM cities
      WHERE is_active = true
      ORDER BY name ASC, county_code ASC
    `,
  );

  return result.rows.map(mapCityRow);
}

function mapCityRow(row: CityRow): City {
  return {
    id: row.id,
    name: row.name,
    countyCode: row.county_code,
  };
}
