import { LucideArrowUpFromDot } from 'lucide-react';
import Image from 'next/image';
import type { z } from 'zod';
import type { CurrentWeatherResponseSchema } from '~/server/open-weather-map-api';

interface ForecastProps {
  forecast: z.infer<typeof CurrentWeatherResponseSchema>;
}

export default function ForecastDetails(props: ForecastProps) {
  return (
    <div className='flex flex-col items-center p-3 border border-neutral-300 rounded-lg'>
      <p className='capitalize font-semibold text-lg'>
        {props.forecast.weather.description}
      </p>
      <div className='flex items-center gap-x-4'>
        <div className='relative w-20 aspect-square'>
          <Image
            src={`https://openweathermap.org/img/wn/${props.forecast.weather.icon}@2x.png`}
            alt={props.forecast.weather.description}
            fill
          />
        </div>

        <div className='flex flex-col items-center gap-y-2'>
          <LucideArrowUpFromDot
            style={{ rotate: `${props.forecast.wind.deg}deg` }}
          />

          <p>
            <span className='font-medium'>Wind</span>:{' '}
            {props.forecast.wind.speed.toFixed()} m/s
          </p>
        </div>
      </div>

      <div className='flex items-center gap-x-4'>
        <span>
          <span className='font-medium'>Temp</span>:{' '}
          {props.forecast.main.temp.toFixed()}c
        </span>
        <span>
          <span className='font-medium'>Humidity</span>:{' '}
          {props.forecast.main.humidity}%
        </span>
      </div>
    </div>
  );
}
