import { redirect } from 'next/navigation';
import ForecastDetails from '~/components/forecast-details';

interface ForecastPageProps {
  searchParams: Promise<{ location?: string }>;
}

export async function generateMetadata(props: ForecastPageProps) {
  const { location } = await props.searchParams;

  return {
    title: `Weather forecast in ${location}`,
  };
}

export default async function ForecastPage(props: ForecastPageProps) {
  const searchParams = await props.searchParams;

  const { location } = searchParams;
  if (!location) {
    redirect('/');
  }

  const currentWeatherResponse = await fetch(
    `http://localhost:3000/api/weather?location=${location}`
  );

  if (!currentWeatherResponse.ok) {
    throw new Error('An error ocurred getting the weather data');
  }
  const currentWeatherJson = await currentWeatherResponse.json();

  return (
    <div className='mt-12 flex flex-col items-center'>
      <h1 className='text-4xl font-medium text-center'>
        Weather in: <br />
        <span className='capitalize font-bold'>
          {searchParams.location}, {currentWeatherJson.geocodedLocation.state}
        </span>
      </h1>

      <div className='mt-6 flex flex-col items-center gap-y-3'>
        <p className='text-xl font-semibold'>Current forecast:</p>
        <ForecastDetails forecast={currentWeatherJson.weather} />
      </div>
    </div>
  );
}
