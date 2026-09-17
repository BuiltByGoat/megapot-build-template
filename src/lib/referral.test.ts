import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PLAY_REFERRAL_PATH, PUBLIC_MEGAPOT_ORIGIN } from './origin.ts';
import {
  isValidReferralCode,
  normalizeReferralCode,
  playDestinationForCode,
  REFERRAL_CODE_HINT,
  REFERRAL_CODE_LENGTH,
  referralGateReason,
} from './referral.ts';

describe('referral code gate', () => {
  it('normalizes to uppercase alphanumeric and accepts exactly 8 characters', () => {
    assert.equal(normalizeReferralCode(' abcd1234 '), REFERRAL_CODE_HINT);
    assert.equal(isValidReferralCode(REFERRAL_CODE_HINT), true);
    assert.equal(isValidReferralCode('abcd1234'), true);
    assert.equal(REFERRAL_CODE_HINT.length, REFERRAL_CODE_LENGTH);
  });

  it('rejects empty, short, long, and punctuation values', () => {
    assert.equal(isValidReferralCode(''), false);
    assert.equal(isValidReferralCode('ABCD123'), false);
    assert.equal(isValidReferralCode('ABCD12345'), false);
    assert.equal(isValidReferralCode('ABCD-234'), false);
    assert.equal(isValidReferralCode('ABCD_234'), false);
  });

  it('builds MEGAPOT_PLAY_DESTINATION from the hosted /r/{CODE} path', () => {
    const dest = playDestinationForCode('abcd1234');
    assert.equal(dest, `${PUBLIC_MEGAPOT_ORIGIN}${PLAY_REFERRAL_PATH}/${REFERRAL_CODE_HINT}`);
    assert.equal(playDestinationForCode('nope'), undefined);
    assert.equal(playDestinationForCode(''), undefined);
  });

  it('explains the gate without printing a play destination', () => {
    assert.match(referralGateReason(''), /8-character/i);
    assert.match(referralGateReason('abc'), /Format hint: ABCD1234/);
    assert.match(referralGateReason(REFERRAL_CODE_HINT), /Cloudflare Pages/);
    assert.equal(referralGateReason(REFERRAL_CODE_HINT).includes('/r/'), false);
  });
});
