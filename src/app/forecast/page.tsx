import dayjs from 'dayjs';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { WeatherForecastRouteResponseSchema } from '~/app/api/forecast/route';
import { CurrentWeatherRouteResponseSchema } from '~/app/api/weather/route';
import ForecastDetails from '~/components/forecast-details';

interface ForecastPageProps {
  searchParams: Promise<{ location?: string; days?: string }>;
}

export async function generateMetadata(props: ForecastPageProps) {
  const { location } = await props.searchParams;

  return {
    title: `Weather forecast in ${location}`,
  };
}

export default async function ForecastPage(props: ForecastPageProps) {
  const searchParams = await props.searchParams;

  const { location, days } = searchParams;
  if (!location) {
    redirect('/');
  }

  const forecastDays = Number(days ?? 3);

  // Parallelise the data fetching of this page so that we don't have a asynchronous waterfall
  const [currentWeatherResponse, forecastResponse] = await Promise.all([
    fetch(`http://localhost:3000/api/weather?location=${location}`),
    fetch(
      `http://localhost:3000/api/forecast?location=${location}&days=${forecastDays}`
    ),
  ]);

  if (!currentWeatherResponse.ok) {
    throw new Error('An error ocurred getting the weather data');
  }
  const currentWeatherJson = await currentWeatherResponse.json();
  const currentWeatherData =
    CurrentWeatherRouteResponseSchema.parse(currentWeatherJson);

  if (!forecastResponse.ok) {
    throw new Error('An error ocurred getting the forecast data');
  }
  const forecastJson = await forecastResponse.json();
  const forecastData = WeatherForecastRouteResponseSchema.parse(forecastJson);

  return (
    <div className='mt-12 flex flex-col items-center'>
      <h1 className='text-4xl font-medium text-center'>
        Weather in: <br />
        <span className='capitalize font-bold'>
          {currentWeatherData.geocodedLocation.name},{' '}
          {currentWeatherData.geocodedLocation.state}
        </span>
      </h1>

      <section className='mt-6 flex flex-col items-center gap-y-3'>
        <p className='text-xl font-semibold'>Current forecast:</p>
        <ForecastDetails forecast={currentWeatherData.weather} />
      </section>

      <section className='mt-12 border-t border-neutral-300 pt-4'>
        <div className='flex items-center gap-x-4'>
          <h2 className='text-xl font-bold'>{forecastDays} Day Forecast</h2>

          {forecastDays !== 5 && (
            <Link
              href={`/forecast?location=${location}&days=5`}
              className='text-blue-500 hover:underline'
            >
              See 5-day forecast?
            </Link>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4'>
          {forecastData.map((dailyForecast) => (
            <div
              key={dailyForecast.date}
              className='flex flex-col items-center gap-y-2'
            >
              <p className='font-semibold'>
                {dayjs(dailyForecast.date).format('dddd, D MMMM')}
              </p>
              <ForecastDetails forecast={dailyForecast.forecast} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
