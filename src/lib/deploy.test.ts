import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  CLONE_ENV_DESCRIPTION,
  cloudflareDeployUrl,
  marketingDeployHrefs,
  REQUIRED_CLONE_ENV,
  templateOpenUrl,
  vercelCloneUrl,
} from './deploy.ts';
import { CLONEABLE_GENERATE, CLONEABLE_REPO } from './origin.ts';
import { playDestinationForCode, REFERRAL_CODE_HINT } from './referral.ts';
import { FACTORY_HOSTNAME } from './utms.ts';

describe('marketing deploy deeplinks', () => {
  it('points Cloudflare at the cloneable GitHub repo', () => {
    const url = new URL(cloudflareDeployUrl());
    assert.equal(url.origin, 'https://deploy.workers.cloudflare.com');
    assert.equal(url.searchParams.get('url'), CLONEABLE_REPO);
  });

  it('lists private env names on Vercel and injects the play destination when present', () => {
    const dest = playDestinationForCode(REFERRAL_CODE_HINT);
    assert.ok(dest);
    const url = new URL(vercelCloneUrl(dest));
    assert.equal(url.origin + url.pathname, 'https://vercel.com/new/clone');
    assert.equal(url.searchParams.get('repository-url'), CLONEABLE_REPO);
    assert.equal(url.searchParams.get('env'), REQUIRED_CLONE_ENV.join(','));
    assert.equal(url.searchParams.get('MEGAPOT_PLAY_DESTINATION'), dest);
    assert.equal(url.searchParams.get('envDescription'), CLONE_ENV_DESCRIPTION);
    assert.equal(url.searchParams.get('envLink'), `https://${FACTORY_HOSTNAME}/#notes`);
    assert.equal(url.searchParams.has('SITE_HOSTNAME'), false);
  });

  it('omits the destination from Vercel until a valid code exists', () => {
    const url = new URL(vercelCloneUrl());
    assert.equal(url.searchParams.get('env'), 'MEGAPOT_PLAY_DESTINATION,SITE_HOSTNAME');
    assert.equal(url.searchParams.get('MEGAPOT_PLAY_DESTINATION'), null);
  });

  it('opens the GitHub template flow and withholds hrefs until the code is valid', () => {
    assert.equal(templateOpenUrl(), CLONEABLE_GENERATE);
    assert.equal(marketingDeployHrefs('short'), null);
    const hrefs = marketingDeployHrefs(REFERRAL_CODE_HINT);
    assert.ok(hrefs);
    assert.equal(hrefs.cloudflare, cloudflareDeployUrl());
    assert.equal(hrefs.template, CLONEABLE_GENERATE);
    assert.equal(
      new URL(hrefs.vercel).searchParams.get('MEGAPOT_PLAY_DESTINATION'),
      hrefs.playDestination,
    );
  });
});
