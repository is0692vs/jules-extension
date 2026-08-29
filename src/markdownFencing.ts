/**
 * Builds a fenced code block with a safe number of backticks to avoid ending the block prematurely.
 * @param code - The code to fence.
 * @param languageId - The language identifier for syntax highlighting.
 * @returns The fenced code block.
 */
export function buildFencedCodeBlock(code: string, languageId: string): string {
    // Find the longest sequence of backticks in the code
    const backtickMatches = code.match(/`+/g);
    let longestBacktickSequence = 0;

    // パフォーマンスと安定性のための最適化: 巨大なマークダウンドキュメントをパースする際、
    // backtickMatches の結果が非常に大きくなる可能性があります。
    // Math.max(...array.map()) でスプレッド構文を使用すると「Maximum call stack size exceeded」
    // エラーが発生し、中間配列も確保されるため、for...ofループを使用して最大値を計算します。
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
