import { twMerge } from 'tailwind-merge';

// Simple clsx alternative since clsx is not in your dependencies
function clsx(...inputs) {
  return inputs
    .flat()
    .filter((x) => typeof x === 'string')
    .join(' ')
    .trim();
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}