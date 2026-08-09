/**
 * Process an array of items with a concurrency limit.
 *
 * @param items The array of items to process.
 * @param limit The maximum number of concurrent executions.
 * @param iterator The async function to execute for each item.
 * @returns A promise that resolves to an array of results in the same order as items.
 */
export class Semaphore {
  private tasks: (() => void)[] = [];
  private count: number;

  constructor(count: number) {
    this.count = count;
  }

  async acquire(): Promise<void> {
    if (this.count > 0) {
      this.count -= 1;
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      this.tasks.push(resolve);
    });
  }

  release(): void {
    if (this.tasks.length > 0) {
      const next = this.tasks.shift();
      if (next) {
        next();
      }
    } else {
      this.count += 1;
    }
  }

  async run<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

export async function mapLimit<T, R>(
  items: T[],
  limit: number,
  iterator: (item: T) => Promise<R>
): Promise<R[]> {
  if (limit < 1) {
    throw new Error('Limit must be at least 1');
  }

  const results: R[] = new Array(items.length);
  let nextIndex = 0;
  const executing: Promise<void>[] = [];

  let hasError = false;

  const worker = async () => {
    while (nextIndex < items.length && !hasError) {
      const index = nextIndex;
      nextIndex += 1;
      try {
        results[index] = await iterator(items[index]);
      } catch (err) {
        hasError = true;
        throw err;
      }
    }
  };

  const workerCount = Math.min(items.length, limit);
  for (let i = 0; i < workerCount; i += 1) {
    executing.push(worker());
  }

  await Promise.all(executing);

  return results;
}
