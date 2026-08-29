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

    if (backtickMatches) {
        // パフォーマンス最適化: spread演算子や.map()による配列アロケーションと "Maximum call stack size exceeded" エラーを防ぐため、for...of ループを使用
        for (const match of backtickMatches) {
            if (match.length > longestBacktickSequence) {
                longestBacktickSequence = match.length;
            }
        }
    }
    
    // Use at least 3 backticks, or one more than the longest sequence found
    const fenceLength = Math.max(3, longestBacktickSequence + 1);
    const fence = '`'.repeat(fenceLength);
    
    return `${fence}${languageId}\n${code}\n${fence}`;
}
