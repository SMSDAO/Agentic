/**
 * Fallback handlers for AI service failures.
 *
 * Use withFallback to wrap any async AI call with graceful degradation,
 * or FallbackChain to try multiple providers in order.
 */

export type AsyncFn<T> = () => Promise<T>;

/**
 * Executes `primary`, falling back to `fallback` on any thrown error.
 */
export async function withFallback<T>(
  primary: AsyncFn<T>,
  fallback: AsyncFn<T>
): Promise<T> {
  try {
    return await primary();
  } catch {
    return fallback();
  }
}

/**
 * Tries each provider in sequence, returning the first successful result.
 * Throws the last error if all providers fail.
 */
export class FallbackChain<T> {
  private providers: AsyncFn<T>[] = [];

  add(provider: AsyncFn<T>): this {
    this.providers.push(provider);
    return this;
  }

  async execute(): Promise<T> {
    if (this.providers.length === 0) {
      throw new Error('FallbackChain has no providers. Add at least one with .add()');
    }
    let lastError: unknown;
    for (const provider of this.providers) {
      try {
        return await provider();
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError instanceof Error ? lastError : new Error(String(lastError), { cause: lastError });
  }
}
