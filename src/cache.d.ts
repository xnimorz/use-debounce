export default function useDebounce<T>(value: T, delay: number, options?: { maxWait?: number }): [T, () => void];
