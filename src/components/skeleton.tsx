import { cn } from '~/utils/cn';

export default function Skeleton(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn('animate-pulse rounded-md bg-neutral-200', props.className)}
    />
  );
}
