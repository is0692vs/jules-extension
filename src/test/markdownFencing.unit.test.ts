import * as assert from 'assert';
import { buildFencedCodeBlock } from '../markdownFencing';

suite('markdownFencing Unit Tests', () => {
    test('buildFencedCodeBlock should build a basic code block', () => {
        const code = 'console.log("hello");';
        const result = buildFencedCodeBlock(code, 'javascript');
        assert.strictEqual(result, '```javascript\nconsole.log("hello");\n```');
    });

    test('buildFencedCodeBlock should adjust backticks if code contains 3 backticks', () => {
        const code = 'const str = ````hello````;';
        const result = buildFencedCodeBlock(code, 'typescript');
        assert.strictEqual(result, '`````typescript\nconst str = ````hello````;\n`````');
    });

    test('buildFencedCodeBlock should handle empty code', () => {
        const code = '';
        const result = buildFencedCodeBlock(code, 'json');
        assert.strictEqual(result, '```json\n\n```');
    });

    test('buildFencedCodeBlock should work with no backticks in code', () => {
        const code = 'plain text';
        const result = buildFencedCodeBlock(code, '');
        assert.strictEqual(result, '```\nplain text\n```');
    });

    test('buildFencedCodeBlock should handle massive amount of backticks without stack overflow', () => {
        const backtickSegment = '`code` ';
        const massiveCode = backtickSegment.repeat(100000);

        // This should not throw "Maximum call stack size exceeded"
        const result = buildFencedCodeBlock(massiveCode, 'text');

        // Output should be fenced with 3 backticks since the longest sequence is 1
        assert.ok(result.startsWith('```text\n'));
        assert.ok(result.endsWith('\n```'));
    });
});
