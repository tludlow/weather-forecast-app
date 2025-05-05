'use client';

import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error(props: ErrorPageProps) {
  return (
    <div className='flex flex-col items-center'>
      <div className='mt-12 flex flex-col items-center'>
        <h2 className='text-xl md:text-2xl font-bold text-center'>
          Something went wrong when getting your forecast data
        </h2>

        <p className='mt-4 text-red-400 text-center'>
          &quot;{props.error.message}&quot;
        </p>

        <div className='mt-6'>
          <Link href='/' className='rounded-lg px-3 py-2 bg-neutral-200'>
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
