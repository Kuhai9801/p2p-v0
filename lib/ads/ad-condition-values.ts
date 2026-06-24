/** Supported chip values for optional ad conditions on create/edit step 3. */
export const AD_JOINED_DAYS_OPTIONS = [15, 30, 60] as const

export const AD_COMPLETION_RATE_OPTIONS = [50, 70, 90] as const

/** API field for minimum account age (create/update payload and responses). */
export const MINIMUM_JOIN_DAYS_API_KEY = "minimum_join_days"

/** Legacy response key kept for backwards-compatible reads. */
export const MINIMUM_JOINED_DAYS_LEGACY_API_KEY = "minimum_joined_days"

const RESTRICTED_TRADE_BANDS = new Set(["silver", "gold", "diamond"])

/** Reads joined-days from BE responses that may use either key name. */
export function readMinimumJoinDaysFromApi(
  data: Record<string, unknown>,
): number | null | undefined {
  const value = data[MINIMUM_JOIN_DAYS_API_KEY] ?? data[MINIMUM_JOINED_DAYS_LEGACY_API_KEY]
  if (value == null) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

/** Maps BE "no restriction" values to `null` so the **Any** chip is selected. */
export function normalizeMinimumJoinedDaysFromApi(value: number | null | undefined): number | null {
  if (value == null || value <= 0) return null
  return value
}

/** Maps BE "no restriction" values to `null` so the **Any** chip is selected. */
export function normalizeMinimumCompletionRateFromApi(
  value: number | null | undefined,
): number | null {
  if (value == null || value <= 0) return null
  return value
}

export function isJoinedDaysAny(days: number | null | undefined): boolean {
  return days == null
}

export function isCompletionRateAny(rate: number | null | undefined): boolean {
  return rate == null
}

/** Whether the API band is a legacy restricted tier (silver/gold/diamond). */
export function isRestrictedTradeBand(band: string | null | undefined): boolean {
  return band != null && RESTRICTED_TRADE_BANDS.has(band)
}
