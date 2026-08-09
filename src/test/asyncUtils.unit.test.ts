import * as assert from "assert";
import { mapLimit, Semaphore } from "../asyncUtils";

suite("AsyncUtils Test Suite", () => {
  suite("mapLimit", () => {
    test("processes all items and maintains order", async () => {
      const items = [1, 2, 3, 4, 5];
      const results = await mapLimit(items, 2, async (item) => item * 2);
      assert.deepStrictEqual(results, [2, 4, 6, 8, 10]);
    });

    test("respects concurrency limit", async () => {
      let active = 0;
      let maxActive = 0;

      const items = Array.from({ length: 10 }, (_, i) => i);
      await mapLimit(items, 3, async () => {
        active += 1;
        maxActive = Math.max(maxActive, active);
        await new Promise((resolve) => setTimeout(resolve, 10));
        active -= 1;
      });

      assert.strictEqual(maxActive, 3);
    });

    test("propagates errors", async () => {
      const items = [1, 2, 3];
      try {
        await mapLimit(items, 2, async (item) => {
          if (item === 2) {
            throw new Error("Test error");
          }
          return item;
        });
        assert.fail("Should have thrown an error");
      } catch (err: any) {
        assert.strictEqual(err.message, "Test error");
      }
    });

    test("handles empty array", async () => {
      const results = await mapLimit([], 2, async (item) => item);
      assert.deepStrictEqual(results, []);
    });

    test("throws if limit is less than 1", async () => {
      try {
        await mapLimit([1], 0, async (item) => item);
        assert.fail("Should have thrown an error");
      } catch (err: any) {
        assert.strictEqual(err.message, "Limit must be at least 1");
      }
    });
  });

  suite("Semaphore", () => {
    test("limits concurrency to max count", async () => {
      const semaphore = new Semaphore(2);
      let active = 0;
      let maxActive = 0;

      const tasks = Array.from({ length: 5 }, () => {
        return semaphore.run(async () => {
          active += 1;
          maxActive = Math.max(maxActive, active);
          await new Promise((resolve) => setTimeout(resolve, 10));
          active -= 1;
        });
      });

      await Promise.all(tasks);
      assert.strictEqual(maxActive, 2);
    });

    test("propagates errors correctly and releases permit", async () => {
      const semaphore = new Semaphore(1);
      let errorThrown = false;

      try {
        await semaphore.run(async () => {
          throw new Error("task failed");
        });
      } catch (e) {
        errorThrown = true;
      }

      assert.strictEqual(errorThrown, true);

      // Permit should be released, so this shouldn't deadlock
      let success = false;
      await semaphore.run(async () => {
        success = true;
      });

      assert.strictEqual(success, true);
    });
  });
});
