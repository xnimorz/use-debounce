export default function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: Number,
  options?: { maxWait?: number }
): [T, () => void, () => void];
