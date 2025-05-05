'use client';

import { LucideSearch } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LocationSearchForm() {
  const router = useRouter();

  const [locationValue, setLocationValue] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    router.push(`/forecast?location=${locationValue}`);
  };

  return (
    <form className='flex flex-col w-full' onSubmit={handleSubmit}>
      <label className='font-medium' htmlFor='location'>
        <span>Location</span>
        <span className='text-red-500'>*</span>
      </label>

      <div className='flex relative items-center'>
        <LucideSearch
          className='absolute left-3 size-4 text-gray-500'
          aria-hidden
        />

        <input
          className='rounded-md border w-full border-neutral-500 pl-10 px-3 py-1 shadow-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-600 disabled:cursor-not-allowed disabled:opacity-50'
          type='text'
          name='location'
          id='location'
          placeholder='Manchester'
          onChange={(e) => setLocationValue(e.target.value)}
          value={locationValue}
          required
        />
      </div>

      <div className='mt-3'>
        <button
          className='bg-neutral-300 px-4 py-2 rounded-md hover:bg-neutral-400 disabled:cursor-not-allowed disabled:opacity-60'
          type='submit'
          disabled={locationValue.length === 0}
        >
          Find forecast
        </button>
      </div>
    </form>
  );
}
