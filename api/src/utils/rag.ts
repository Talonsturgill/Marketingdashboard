export type RAGStatus =
    | { status: 'green'; emoji: '🟢'; color: '#10b981' }
    | { status: 'yellow'; emoji: '🟡'; color: '#f59e0b' }
    | { status: 'red'; emoji: '🔴'; color: '#ef4444' }
    | { status: 'na'; emoji: '⚪'; color: 'gray' };

export function getRAGStatus(actual: number, goal: number, timeElapsedPercent: number): RAGStatus {
    if (goal === 0) return { status: 'na', emoji: '⚪', color: 'gray' };

    const completionPercent = (actual / goal) * 100;
    // If time hasn't started, and we have 0 progress, pacing is 0. If we have progress, pacing is infinite/high.
    // Prevent divide by zero.
    const pacingIndex = timeElapsedPercent > 0
        ? completionPercent / timeElapsedPercent
        : (actual > 0 ? 999 : 0);

    // Green: ≥90% complete OR pacing index ≥1.0 (ahead of schedule)
    if (completionPercent >= 90 || pacingIndex >= 1.0) {
        return { status: 'green', emoji: '🟢', color: '#10b981' };
    }
    // Yellow: 70-89% complete OR pacing index 0.85-0.99
    if (completionPercent >= 70 || pacingIndex >= 0.85) {
        return { status: 'yellow', emoji: '🟡', color: '#f59e0b' };
    }
    // Red: <70% complete AND pacing index <0.85
    return { status: 'red', emoji: '🔴', color: '#ef4444' };
}

export function createProgressBar(percent: number, length = 10): string {
    const filled = Math.round((percent / 100) * length);
    // Use block characters for Slack
    return '█'.repeat(Math.min(filled, length)) +
        '░'.repeat(Math.max(0, length - filled));
}
