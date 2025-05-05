import { z } from 'zod';

// Only including the fields we care about for the point of this "demo" application, for brevity reasons
const GeocodingLocationSchema = z.object({
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  country: z.string(),
  state: z.string(),
});

const OpenWeatherMapGeocodingApiResponseSchema = z.array(
  GeocodingLocationSchema
);

export async function getGeocoding(input: { location: string }) {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${input.location}&limit=1&appid=${process.env.OPENWEATHERMAP_API_KEY}`
  );
  const responseJson = await response.json();
  const data = OpenWeatherMapGeocodingApiResponseSchema.parse(responseJson);

  // The "data" returned here is an array of locations, but we only care about the first one
  // because it should be the most relevant to the "q" parameter. Let's take that out
  // so the consumer of this data doesn't have to check for the existence of this every time
  const location = data[0];
  if (!location) {
    return null;
  }

  return location;
}
