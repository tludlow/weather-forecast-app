import dayjs from 'dayjs';
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

// Only including the fields we care about for the point of this "demo" application, for brevity reasons
const OpenWeatherMapWeatherForecastApiResponseSchema = z.object({
  list: OpenWeatherMapCurrentWeatherApiResponseSchema.array(),
});

export async function getWeatherForecast(input: {
  lat: number;
  lon: number;
  days: number;
}) {
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

  if (input.days < 1 || input.days > 10) {
    throw new Error(
      'Invalid "days" value, days must be between 1 and 10 inclusive'
    );
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${input.lat}&lon=${input.lon}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`
  );
  const responseJson = await response.json();
  const data =
    OpenWeatherMapWeatherForecastApiResponseSchema.parse(responseJson);

  const dailyForecasts = generateDailyForecastFromHourForecasts({
    data,
    days: input.days,
  });

  return dailyForecasts;
}

function generateDailyForecastFromHourForecasts(input: {
  data: z.infer<typeof OpenWeatherMapWeatherForecastApiResponseSchema>;
  days: number;
}) {
  const now = dayjs();

  const daysForecastsData = new Map<
    string,
    Array<z.infer<typeof OpenWeatherMapCurrentWeatherApiResponseSchema>>
  >();

  // First, let's generate a map of 'YYYY-MM-DD' => [weather objects] map
  // for the "input.days" amount of days we care about
  for (let i = 1; i <= input.days; i++) {
    const iDay = now.add(i, 'days').format('YYYY-MM-DD');
    daysForecastsData.set(iDay, []);
  }

  // Now, let's go through our "data.list" elements, which are the 3-hourly weather forecasts.
  // If we have data for the days we care about (determined above) then lets store this data
  // so we can use it in a minute to determine an overall view of the weather for the day
  for (const hourlyForecast of input.data.list) {
    const hourlyDateTime = dayjs.unix(hourlyForecast.dt);
    const forecastDay = hourlyDateTime.format('YYYY-MM-DD');

    if (!daysForecastsData.has(forecastDay)) {
      continue;
    }

    const currentDayForecasts = daysForecastsData.get(forecastDay) ?? [];
    daysForecastsData.set(forecastDay, [
      ...currentDayForecasts,
      hourlyForecast,
    ]);
  }

  // Here is a place you could go to a lot of effort to refine an "algorithm" to give you a
  // representative forecast of the entire day given the many 3-hourly interval forecasts
  // I have set up the data in a nice way to do this previously in this function, but for the
  // purpose of brevity I will just take the "1 pm" forecast as the one to use to represent the "day"
  const forecasts = [];
  for (const [day, hourlyForecasts] of daysForecastsData.entries()) {
    const midDayForecast = hourlyForecasts.find(
      (forecast) => dayjs.unix(forecast.dt).hour() === 13
    );
    if (!midDayForecast) {
      throw new Error(
        `Could not find the mid-day hourly forecast for day: "${day}"`
      );
    }

    // Let's also shape the data a bit nicer for consumption here, we will take the weather[]
    // and just return the 1st element so the consumer has an easier time and it conveys our intetions
    // better for them
    const firstWeatherElement = midDayForecast.weather[0];
    if (!firstWeatherElement) {
      throw new Error(
        `Failed to get weather information for the mid-day hourly forecast for day: "${day}"`
      );
    }

    const shapedForecast = { ...midDayForecast, weather: firstWeatherElement };

    forecasts.push({
      date: day,
      forecast: shapedForecast,
    });
  }

  return forecasts;
}
