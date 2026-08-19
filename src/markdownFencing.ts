/**
 * Builds a fenced code block with a safe number of backticks to avoid ending the block prematurely.
 * @param code - The code to fence.
 * @param languageId - The language identifier for syntax highlighting.
 * @returns The fenced code block.
 */
export function buildFencedCodeBlock(code: string, languageId: string): string {
    // Find the longest sequence of backticks in the code
    const backtickMatches = code.match(/`+/g);
    // 巨大なマークダウン文字列での Maximum call stack size exceeded エラーと不要な配列生成を防ぐため、スプレッド構文とmapではなくfor...ofループを使用する
    let longestBacktickSequence = 0;
    if (backtickMatches) {
        for (const m of backtickMatches) {
            if (m.length > longestBacktickSequence) {
                longestBacktickSequence = m.length;
            }
        }
    }
    
    // Use at least 3 backticks, or one more than the longest sequence found
    const fenceLength = Math.max(3, longestBacktickSequence + 1);
    const fence = '`'.repeat(fenceLength);
    
    return `${fence}${languageId}\n${code}\n${fence}`;
}
