/**
 * ---
 * @customize  Phrases that must never render on public factory pages.
 *             Internal scanners and README may still document the policy.
 * ---
 */

/** Internal ops lecture — keep out of rendered HTML. */
export const PUBLIC_LECTURE_COPY = [
  /codes, wallets, and tokens never appear/i,
  /no codes or wallets on public pages/i,
  /empty of codes and wallets/i,
  /no referral codes, wallet addresses/i,
  /players never see your referral string/i,
  /attribution belongs in private host env/i,
  /your referral lives in private env/i,
  /never a referral code or wallet/i,
] as const;

export function lectureHits(text: string): string[] {
  return PUBLIC_LECTURE_COPY.filter((re) => re.test(text)).map((re) => re.source);
}
