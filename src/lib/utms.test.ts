import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  DEFAULT_UTMS,
  FACTORY_HOSTNAME,
  hostnameToUtmSource,
  locationHasCampaignUtms,
  resolveUtms,
  withUtms,
} from './utms.ts';

describe('hostnameToUtmSource', () => {
  it('strips scheme and www', () => {
    assert.equal(hostnameToUtmSource('https://www.clone-host.example'), 'clone-host.example');
    assert.equal(hostnameToUtmSource('clone-host.example'), 'clone-host.example');
  });

  it('accepts the factory hostname', () => {
    assert.equal(hostnameToUtmSource('https://www.megapot.build'), FACTORY_HOSTNAME);
    assert.equal(hostnameToUtmSource(FACTORY_HOSTNAME), FACTORY_HOSTNAME);
  });

  it('rejects empty, repo names, wallets, and invite tokens', () => {
    assert.equal(hostnameToUtmSource(undefined), undefined);
    assert.equal(hostnameToUtmSource(''), undefined);
    assert.equal(hostnameToUtmSource('network-site-template'), undefined);
    assert.equal(hostnameToUtmSource('megapot-build-template'), undefined);
    assert.equal(hostnameToUtmSource('megapot-templates'), undefined);
    assert.equal(hostnameToUtmSource('0x1111111111111111111111111111111111111111'), undefined);
    assert.equal(hostnameToUtmSource('invite.example'), undefined);
  });
});

describe('resolveUtms', () => {
  it('omits utm_source when SITE_HOSTNAME is unset (required for HTML UTMs)', () => {
    assert.deepEqual(resolveUtms({}), DEFAULT_UTMS);
    assert.equal(resolveUtms({}).utm_source, undefined);
  });

  it('derives hostname-style source from SITE_HOSTNAME', () => {
    assert.equal(
      resolveUtms({ SITE_HOSTNAME: 'https://www.clone-host.example' }).utm_source,
      'clone-host.example',
    );
    assert.equal(resolveUtms({ SITE_HOSTNAME: FACTORY_HOSTNAME }).utm_source, FACTORY_HOSTNAME);
  });

  it('prefers SITE_HOSTNAME over aliases and explicit source', () => {
    assert.equal(
      resolveUtms({
        SITE_HOSTNAME: 'https://www.deploy-host.example',
        MEGAPOT_SITE_HOSTNAME: 'https://www.other-host.example',
        MEGAPOT_UTM_SOURCE: 'override-host.example',
      }).utm_source,
      'deploy-host.example',
    );
  });

  it('falls back to MEGAPOT_SITE_HOSTNAME then MEGAPOT_UTM_SOURCE', () => {
    assert.equal(
      resolveUtms({ MEGAPOT_SITE_HOSTNAME: 'https://www.clone-host.example' }).utm_source,
      'clone-host.example',
    );
    assert.equal(
      resolveUtms({ MEGAPOT_UTM_SOURCE: 'deploy-host.example' }).utm_source,
      'deploy-host.example',
    );
  });

  it('reads medium and campaign from env with factory defaults', () => {
    assert.deepEqual(
      resolveUtms({
        SITE_HOSTNAME: 'deploy-host.example',
        MEGAPOT_UTM_MEDIUM: 'Clone',
        MEGAPOT_UTM_CAMPAIGN: 'Network-Clone',
      }),
      {
        utm_source: 'deploy-host.example',
        utm_medium: 'clone',
        utm_campaign: 'network-clone',
      },
    );
  });

  it('ignores invalid tokens and keeps medium/campaign defaults', () => {
    assert.deepEqual(
      resolveUtms({
        SITE_HOSTNAME: 'not a host',
        MEGAPOT_UTM_MEDIUM: '??',
        MEGAPOT_UTM_CAMPAIGN: 'invite-drop',
      }),
      DEFAULT_UTMS,
    );
  });
});

describe('withUtms', () => {
  it('does not invent a source when hostname env is empty', () => {
    const url = withUtms('https://megapot.io/dashboard', resolveUtms({}));
    const parsed = new URL(url);
    assert.equal(parsed.searchParams.get('utm_source'), null);
    assert.equal(parsed.searchParams.get('utm_medium'), DEFAULT_UTMS.utm_medium);
    assert.equal(parsed.searchParams.get('utm_campaign'), DEFAULT_UTMS.utm_campaign);
  });

  it('stamps SITE_HOSTNAME as utm_source when set', () => {
    const url = withUtms(
      'https://megapot.io/dashboard',
      resolveUtms({ SITE_HOSTNAME: FACTORY_HOSTNAME }),
    );
    const parsed = new URL(url);
    assert.equal(parsed.searchParams.get('utm_source'), FACTORY_HOSTNAME);
  });

  it('does not overwrite existing utm params', () => {
    const url = withUtms(
      'https://megapot.io/results?utm_source=already&utm_medium=set',
      resolveUtms({}),
    );
    const parsed = new URL(url);
    assert.equal(parsed.searchParams.get('utm_source'), 'already');
    assert.equal(parsed.searchParams.get('utm_medium'), 'set');
    assert.equal(parsed.searchParams.get('utm_campaign'), DEFAULT_UTMS.utm_campaign);
  });
});

describe('locationHasCampaignUtms', () => {
  it('accepts hostname-style campaign params and rejects referral queries', () => {
    assert.equal(
      locationHasCampaignUtms(
        'https://megapot.io/?utm_source=clone-host.example&utm_medium=clone&utm_campaign=network-clone',
      ),
      true,
    );
    assert.equal(
      locationHasCampaignUtms(
        'https://megapot.io/?utm_source=network-site-template&utm_medium=template&utm_campaign=network-v1',
      ),
      false,
    );
    assert.equal(
      locationHasCampaignUtms(
        'https://megapot.io/?utm_source=clone-host.example&utm_medium=clone&utm_campaign=network-clone&ref=secret',
      ),
      false,
    );
  });
});
