import Skeleton from '~/components/skeleton';

export default function ForecastPageLoading() {
  return (
    <div className='flex flex-col items-center'>
      <div className='mt-12 flex flex-col items-center'>
        <Skeleton className='h-10 w-32 md:w-48' />

        <div className='mt-6'>
          <Skeleton className='h-16 md:h-28 w-28 md:w-40' />
        </div>

        <div className='mt-12 grid grid-cols-3 gap-x-4'>
          <Skeleton className='h-16 md:h-28 w-28 md:w-40' />
          <Skeleton className='h-16 md:h-28 w-28 md:w-40' />
          <Skeleton className='h-16 md:h-28 w-28 md:w-40' />
        </div>
      </div>
    </div>
  );
}
