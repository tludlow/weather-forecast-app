import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import {
  getGeocoding,
  getWeatherForecast,
} from '~/server/open-weather-map-api';

const WeatherForecastRouteSearchParamsSchema = z.object({
  location: z.string({ required_error: 'You must provided a location' }),
  days: z.coerce
    .number({
      invalid_type_error:
        'The value for days you have provided is not a number',
    })
    .min(1, { message: 'The number of days must be at least 1' })
    .max(5, { message: 'The number of days must be at most 5' })
    .optional()
    .default(3),
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const searchParamsParseResult =
    WeatherForecastRouteSearchParamsSchema.safeParse(
      Object.fromEntries(searchParams)
    );
  if (!searchParamsParseResult.success) {
    console.log(searchParamsParseResult.error);
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
        `Your provided location of: "${searchParamsData.location}" cannot be found. Please try again with more accuracy, e.g: "London, UK"`,
        {
          status: 400,
        }
      );
    }

    const forecast = await getWeatherForecast({
      lat: geocodedLocation.lat,
      lon: geocodedLocation.lon,
      days: searchParamsData.days,
    });

    return Response.json(forecast);
  } catch (error) {
    // You'd probably have some automatic observability set up to handle this but I'll console log
    // the error here to act as a proxy for that sort of set up
    console.error(error);

    // We don't want to bubble up the error to the client here because it might have sensitive
    // backend information in it. Hence, we will just give a generic response
    return new Response(
      `An erorr has ocurred when getting the weather forecast data`,
      {
        status: 500,
      }
    );
  }
}
