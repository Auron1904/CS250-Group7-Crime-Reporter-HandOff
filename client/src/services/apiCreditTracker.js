// Mock API Credit Tracker for testing
// Tracks API usage and alerts when credit usage exceeds threshold

let creditUsage = 0;
const CREDIT_THRESHOLD = 900; // Alert when usage exceeds this (out of 1000)

/**
 * Gets the current credit usage
 * @returns {number} Current credit usage
 */
export function getCreditUsage() {
    return creditUsage;
}

/**
 * Records API usage and updates credit count
 * @param {number} credits - Number of credits used
 * @returns {number} Updated credit usage
 */
export function recordApiUsage(credits = 1) {
    creditUsage += credits;
    if (creditUsage > 1000) {
        creditUsage = 1000; // Cap at 1000
    }
    return creditUsage;
}

/**
 * Checks credit usage against threshold and alerts if exceeded
 * @param {number} usage - Current credit usage
 */
export function checkAndAlertThreshold(usage) {
    if (usage >= CREDIT_THRESHOLD) {
        console.warn(`⚠️ API Credit Warning: You have used ${usage}/1000 credits`);
        // In production, this could trigger an actual alert or notification
    }
    if (usage >= 1000) {
        console.error(`❌ API Credit Limit Reached: ${usage}/1000 credits used`);
    }
}

/**
 * Resets credit usage (for testing purposes)
 */
export function resetCreditUsage() {
    creditUsage = 0;
}
