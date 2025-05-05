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

const OpenWeatherForecastWeatherSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

// Only including the fields we care about for the point of this "demo" application, for brevity reasons
const OpenWeatherMapCurrentWeatherApiResponseSchema = z.object({
  dt: z.number(),
  weather: OpenWeatherForecastWeatherSchema.array(),
  main: z.object({
    temp: z.number(),
    humidity: z.number(),
  }),
  wind: z.object({ speed: z.number(), deg: z.number() }),
});

export const CurrentWeatherResponseSchema =
  OpenWeatherMapCurrentWeatherApiResponseSchema.extend({
    weather: OpenWeatherForecastWeatherSchema,
  });

export async function getCurrentWeather(input: { lat: number; lon: number }) {
  if (input.lat < -90 || input.lat > 90) {
    throw new Error(
      'Invalid "lat" value, lat must be between -90 and 90 inclusive'
    );
  }

  if (input.lon < -180 || input.lon > 180) {
    throw new Error(
      'Invalid "lon" value, lon must be between -180 and 180 inclusive'
    );
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${input.lat}&lon=${input.lon}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`
  );
  const responseJson = await response.json();
  const data =
    OpenWeatherMapCurrentWeatherApiResponseSchema.parse(responseJson);

  // The "weather" response is an array here, but we only expect a singular element for this
  // as it's the current weather forecast. Let's take that array and only return the single
  // element so the consumer of this function has an easier time

  const currentWeather = data.weather[0];
  if (!currentWeather) {
    throw new Error('Could not find the current weather information');
  }

  const finalData: z.infer<typeof CurrentWeatherResponseSchema> = {
    ...data,
    weather: currentWeather,
  };

  return finalData;
}
