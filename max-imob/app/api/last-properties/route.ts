import { getLastProperties } from "@/lib/properties/property-service";
import { NextRequest, NextResponse } from "next/server";

const routes = {
  GET: handleLastProperties
};

export const GET = routes.GET;

async function handleLastProperties(request: NextRequest) {
  try {
     const data =  await getLastProperties();
     return jsonOk({
        properties:data
     });
  }catch{
     return jsonOk({ });
  }

}
function jsonOk(data: unknown, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      error: null,
    },
    { status },
  );
}

