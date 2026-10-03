// Small builders that keep the content files readable. Passage ids are written
// out explicitly so citations in answers can be checked by eye.
import type { Passage, Source } from './types'

/** "23:14" -> 1394 */
export function locToSeconds(loc: string): number {
  const [m, s] = loc.split(':').map(Number)
  return m * 60 + s
}

/** A lecture-transcript passage; seconds are derived from the m:ss locator. */
export function lp(id: string, loc: string, text: string): Passage {
  return { id, loc, seconds: locToSeconds(loc), text }
}

export function lecture(
  n: number,
  title: string,
  date: string,
  minutes: number,
  passages: Passage[],
): Source {
  return {
    id: `L${n}`,
    kind: 'lecture',
    title: `Lecture ${n} · ${title}`,
    date,
    meta: `${minutes} min · Canvas recording`,
    origin: 'Canvas › Media Gallery › Lecture recordings',
    proposed: 'approved',
    mode: 'answer',
    passages,
  }
}

/** A slide deck. Each entry is [slide number, "Title · bullet · bullet"]. */
export function slides(n: number, date: string, slideCount: number, entries: [number, string][]): Source {
  return {
    id: `S${n}`,
    kind: 'slides',
    title: `Slides · Lecture ${n}`,
    date,
    meta: `${slideCount} slides · PDF`,
    origin: 'Canvas › Files › Lecture slides',
    proposed: 'approved',
    mode: 'answer',
    passages: entries.map(([num, text]) => ({
      id: `S${n}-${String(num).padStart(2, '0')}`,
      loc: `Slide ${num}`,
      text,
    })),
  }
}
