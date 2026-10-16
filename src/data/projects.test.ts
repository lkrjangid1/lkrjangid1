import { describe, expect, it } from 'vitest';
import { normalize, parseProjectsFile, pickPrimaryLink, slugify, splitTitle, SCREENSHOT_BASE } from './projects';

const scalper = {
  title: 'Scalper — In-House Charting & Trading Terminal',
  role: 'Univest · Built from scratch in under a month',
  metrics: '+12% derivative trade share',
  tech: ['Flutter', 'Custom Rendering', 'WebSockets'],
  links: [],
  points: ['TradingView-style chart engine built from scratch.'],
  screenshots: ['scalper.jpeg'],
};

const libgen = {
  title: 'Libgen — Book Search & Reading Platform',
  role: 'Personal project · Solo-built',
  metrics: '600K+ downloads',
  tech: ['Flutter'],
  links: [{ label: 'Play Store', url: 'https://play.google.com/store/apps/details?id=com.yaaratech.libgen' }],
  points: [],
  screenshots: [],
};

describe('splitTitle / slugify', () => {
  it('splits on an em dash and keeps hyphenated words intact', () => {
    expect(splitTitle('MBM E-Learning')).toEqual({ name: 'MBM E-Learning', subtitle: '' });
    expect(splitTitle('Scalper — In-House Charting')).toEqual({ name: 'Scalper', subtitle: 'In-House Charting' });
  });
  it('slugifies ampersands and punctuation', () => {
    expect(slugify('Greenhouse Monitoring & Control')).toBe('greenhouse-monitoring-control');
    expect(slugify('MBM E-Learning')).toBe('mbm-e-learning');
  });
});

describe('normalize', () => {
  it('derives slug, category, featured flag and absolute screenshot URLs', () => {
    const p = normalize(scalper);
    expect(p.slug).toBe('scalper');
    expect(p.name).toBe('Scalper');
    expect(p.category).toBe('production');
    expect(p.featured).toBe(true);
    expect(p.screenshots).toEqual([SCREENSHOT_BASE + 'scalper.jpeg']);
  });

  it('applies slug aliases for long titles', () => {
    const p = normalize({ ...libgen, title: 'AI-Based Research Paper Search, Summarization and Chat Application' });
    expect(p.slug).toBe('research-assistant');
  });

  it('links to the case study when one exists, else the best external link', () => {
    expect(normalize(scalper, new Set(['scalper'])).primaryLink).toEqual({ label: 'Case study', url: '/work/scalper' });
    expect(normalize(scalper).primaryLink).toBeUndefined();
    expect(normalize(libgen).primaryLink?.label).toBe('Play Store');
  });

  it('defaults missing optional fields', () => {
    const p = normalize({ title: 'Weblm — Website AI Chatbot', tech: ['LangChain', 'Python'] });
    expect(p.links).toEqual([]);
    expect(p.points).toEqual([]);
    expect(p.category).toBe('ai-iot');
  });
});

describe('pickPrimaryLink', () => {
  it('prefers store and live links over others', () => {
    expect(
      pickPrimaryLink([
        { label: 'GitHub', url: 'https://github.com/x' },
        { label: 'Chrome Web Store', url: 'https://chromewebstore.google.com/x' },
      ])?.label,
    ).toBe('Chrome Web Store');
  });
});

describe('parseProjectsFile', () => {
  it('sorts featured projects first in the configured order', () => {
    const { projects } = parseProjectsFile({ projects: [libgen, scalper] });
    expect(projects.map((p) => p.slug)).toEqual(['scalper', 'libgen']);
  });

  it('throws on malformed input so the build fails', () => {
    expect(() => parseProjectsFile({})).toThrow();
    expect(() => parseProjectsFile({ projects: [] })).toThrow();
    expect(() => parseProjectsFile({ projects: [{ role: 'no title' }] })).toThrow();
    expect(() => parseProjectsFile({ projects: [{ ...libgen, links: [{ label: 'x', url: 'not a url' }] }] })).toThrow();
  });

  it('throws on duplicate slugs', () => {
    expect(() => parseProjectsFile({ projects: [libgen, libgen] })).toThrow(/duplicate slug/);
  });
});
