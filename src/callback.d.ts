export default function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: Number,
  deps: ReadonlyArray<any>,
  options?: { maxWait?: number }
): [T, () => void, () => void];
