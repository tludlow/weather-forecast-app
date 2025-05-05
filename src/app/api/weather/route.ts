import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import {
  CurrentWeatherResponseSchema,
  GeocodingLocationSchema,
  getCurrentWeather,
  getGeocoding,
} from '~/server/open-weather-map-api';

const CurrentWeatherRouteSearchParamsSchema = z.object({
  location: z.string({ required_error: 'You must provide a location' }),
});

export const CurrentWeatherRouteResponseSchema = z.object({
  geocodedLocation: GeocodingLocationSchema,
  weather: CurrentWeatherResponseSchema,
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const searchParamsParseResult =
    CurrentWeatherRouteSearchParamsSchema.safeParse(
      Object.fromEntries(searchParams)
    );
  if (!searchParamsParseResult.success) {
    return new Response(
      `Invalid search params. ${fromError(searchParamsParseResult.error)}`,
      {
        status: 400,
      }
    );
  }

  const searchParamsData = searchParamsParseResult.data;

  try {
    const geocodedLocation = await getGeocoding({
      location: searchParamsData.location,
    });
    if (!geocodedLocation) {
      return new Response(
        `Your provided location of: "${searchParamsData.location}" cannot be found in the world. Please try again with more accuracy, e.g: "London, UK"`,
        {
          status: 400,
        }
      );
    }

    const weather = await getCurrentWeather({
      lat: geocodedLocation.lat,
      lon: geocodedLocation.lon,
    });

    const finalData: z.infer<typeof CurrentWeatherRouteResponseSchema> = {
      geocodedLocation,
      weather,
    };
    return Response.json(finalData);
  } catch (error) {
    // You'd probably have some automatic observability set up to handle this but I'll console log
    // the error here to act as a proxy for that sort of set up
    console.error(error);

    return new Response(
      `An erorr has ocurred when getting the current weather data`,
      {
        status: 500,
      }
    );
  }
}
