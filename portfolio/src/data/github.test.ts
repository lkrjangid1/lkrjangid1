import { describe, expect, it } from 'vitest';
import { parseCalendar, summarize } from './github';

const cell = (date: string, i: number, level: number) =>
  `<td tabindex="0" data-ix="0" style="width: 10px" data-date="${date}" id="contribution-day-component-${i}" data-level="${level}" role="gridcell" class="ContributionCalendar-day"></td>`;
const tip = (i: number, text: string) => `<tool-tip id="tooltip-${i}" for="contribution-day-component-${i}" popover="manual">${text}</tool-tip>`;

describe('parseCalendar', () => {
  it('reads counts from tooltips and levels from cells', () => {
    const html = cell('2026-01-04', 0, 0) + cell('2026-01-05', 1, 2) + cell('2026-01-06', 2, 4) +
      tip(0, 'No contributions on January 4th.') + tip(1, '3 contributions on January 5th.') + tip(2, '1,204 contributions on January 6th.');
    expect(parseCalendar(html)).toEqual([
      { date: '2026-01-04', count: 0, level: 0 },
      { date: '2026-01-05', count: 3, level: 2 },
      { date: '2026-01-06', count: 1204, level: 4 },
    ]);
  });
});

describe('summarize', () => {
  const days = [
    { date: '2026-01-04', count: 0, level: 0 }, // Sunday
    { date: '2026-01-05', count: 2, level: 1 },
    { date: '2026-01-06', count: 5, level: 2 },
    { date: '2026-01-07', count: 1, level: 1 },
    { date: '2026-01-08', count: 0, level: 0 },
    { date: '2026-01-09', count: 4, level: 2 },
    { date: '2026-01-10', count: 0, level: 0 },
    { date: '2026-01-11', count: 3, level: 1 }, // Sunday starts week 2
  ];

  it('builds Sunday-first weeks, totals and the busiest day', () => {
    const s = summarize(days);
    expect(s.weeks.map((w) => w.length)).toEqual([7, 1]);
    expect(s.total).toBe(15);
    expect(s.busiest.date).toBe('2026-01-06');
    expect(s.months).toEqual([{ label: 'Jan', count: 15 }]);
  });

  it('computes longest and current streaks', () => {
    const s = summarize(days);
    expect(s.longestStreak).toBe(3);
    expect(s.currentStreak).toBe(1);
  });
});
