export async function withTimeout<T>(promise: Promise<T>, ms: number, onTimeout?: () => void): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => { onTimeout?.(); reject(new Error('timeout')); }, ms))
  ]) as T;
}


