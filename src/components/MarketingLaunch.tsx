/**
 * ---
 * @customize  Step 2A — player marketing site. Referral-gated Cloudflare
 *             Pages (recommended) and Vercel deeplinks inject
 *             MEGAPOT_PLAY_DESTINATION privately. No codes in public HTML.
 * ---
 */
'use client';

import { type ReactNode, useId, useState } from 'react';
import { marketingDeployHrefs } from '@/lib/deploy';
import { LINKS } from '@/lib/links';
import {
  isValidReferralCode,
  REFERRAL_CODE_HINT,
  REFERRAL_CODE_LENGTH,
  referralGateReason,
} from '@/lib/referral';

async function copyPlayDestination(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function MarketingLaunch() {
  const inputId = useId();
  const reasonId = useId();
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const valid = isValidReferralCode(code);
  const reason = referralGateReason(code);
  const hrefs = marketingDeployHrefs(code);

  async function onLaunch() {
    if (!hrefs?.playDestination) {
      return;
    }
    const ok = await copyPlayDestination(hrefs.playDestination);
    setCopied(ok);
  }

  return (
    <article className="path-card path-card-primary" id="marketing">
      <span className="chip chip-green">Primary · Marketing site</span>
      <h3>Player-facing marketing shell</h3>
      <p>
        You get a public site that sells play, cloned from{' '}
        <a href={LINKS.cloneable} rel="noreferrer">
          BuiltByGoat/network-site-template
        </a>
        . Play buttons go to <code>/go</code>. The host keeps <code>MEGAPOT_PLAY_DESTINATION</code>{' '}
        private — your referral is not printed on the pages visitors see.
      </p>

      <div className="field">
        <label htmlFor={inputId}>Your 8-character referral code</label>
        <input
          id={inputId}
          name="referral-code"
          className="field-input"
          value={code}
          onChange={(event) => {
            setCopied(false);
            setCode(event.target.value.slice(0, REFERRAL_CODE_LENGTH));
          }}
          placeholder={REFERRAL_CODE_HINT}
          autoComplete="off"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          inputMode="text"
          maxLength={REFERRAL_CODE_LENGTH}
          aria-describedby={reasonId}
          aria-invalid={code.length > 0 && !valid}
        />
        <p id={reasonId} className={valid ? 'field-reason ok' : 'field-reason'}>
          {reason}
        </p>
      </div>

      <div className="cta-row">
        <LaunchControl
          enabled={Boolean(hrefs)}
          href={hrefs?.cloudflare}
          className="btn btn-green"
          onLaunch={onLaunch}
        >
          Launch on Cloudflare Pages
        </LaunchControl>
        <LaunchControl
          enabled={Boolean(hrefs)}
          href={hrefs?.vercel}
          className="btn btn-ghost"
          onLaunch={onLaunch}
        >
          Launch on Vercel
        </LaunchControl>
        <LaunchControl
          enabled={Boolean(hrefs)}
          href={hrefs?.template}
          className="btn btn-ghost"
          onLaunch={onLaunch}
        >
          Open template
        </LaunchControl>
      </div>
      {copied ? (
        <p className="field-reason ok" role="status">
          Private play destination copied. Paste it into <code>MEGAPOT_PLAY_DESTINATION</code> if
          the host asks.
        </p>
      ) : null}

      <ol className="checklist">
        <li>
          <b>Connect GitHub</b>
          Use the template repo. Cloudflare Pages is recommended; Vercel is the secondary host.
        </li>
        <li>
          <b>Set private env</b>
          Names only: <code>MEGAPOT_PLAY_DESTINATION</code> (your Play URL with referral) and{' '}
          <code>SITE_HOSTNAME</code> (the hostname of the site you are launching).
        </li>
        <li>
          <b>Deploy</b>
          Build output is <code>out/</code>. Play must stay a Function hop, not a static page.
        </li>
        <li>
          <b>Smoke /go</b>
          <code>curl -sI /go</code> (and <code>/go/</code>) must be HTTP 302.
        </li>
      </ol>
    </article>
  );
}

function LaunchControl({
  enabled,
  href,
  className,
  onLaunch,
  children,
}: {
  enabled: boolean;
  href?: string;
  className: string;
  onLaunch: () => void;
  children: ReactNode;
}) {
  if (!enabled || !href) {
    return (
      <span className={`${className} btn-disabled`} aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <a className={className} href={href} rel="noreferrer" target="_blank" onClick={onLaunch}>
      {children}
    </a>
  );
}
