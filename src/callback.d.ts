export default function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: ReadonlyArray<any>,
  delay: Number
): T;
