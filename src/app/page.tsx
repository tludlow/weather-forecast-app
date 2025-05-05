export default function Home() {
  return (
    <div className='flex flex-col items-center'>
      <div className='mt-12 flex flex-col items-center'>
        <h1 className='text-4xl/snug font-bold'>Forecast Finder</h1>

        <p className='text-lg text-neutral-600 mt-2'>
          Find the weather forecast for a location by entering it below.
        </p>
      </div>
    </div>
  );
}
