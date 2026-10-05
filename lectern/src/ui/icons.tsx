// A small custom icon set drawn on a 20px grid with a 1.5px stroke.
// Kept deliberately plain; each glyph names an object from the course world.
import type { JSX } from 'preact'

type P = { size?: number; class?: string; title?: string }

const S = ({ size = 18, class: c, title, children }: P & { children: JSX.Element | JSX.Element[] }) => (
  <svg
    class={`ic ${c ?? ''}`}
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden={title ? undefined : 'true'}
    role={title ? 'img' : undefined}
  >
    {title ? <title>{title}</title> : <g />}
    {children}
  </svg>
)

export const IconLecture = (p: P) => (
  <S {...p}>
    <rect x="2.75" y="4.25" width="14.5" height="10.5" rx="2" />
    <path d="M8.5 7.6v4.3l3.6-2.15z" fill="currentColor" stroke="none" />
    <path d="M7 17.25h6" />
  </S>
)
export const IconSlides = (p: P) => (
  <S {...p}>
    <rect x="2.75" y="3.75" width="14.5" height="10" rx="1.5" />
    <path d="M6 7.5h5M6 10h8" />
    <path d="M10 13.75v3M7.5 16.75h5" />
  </S>
)
export const IconSyllabus = (p: P) => (
  <S {...p}>
    <path d="M5.25 2.75h6.5l3.5 3.5v11h-10z" />
    <path d="M11.5 2.9v3.6h3.6M7.75 10h4.5M7.75 13h4.5" />
  </S>
)
export const IconPset = (p: P) => (
  <S {...p}>
    <rect x="4.25" y="3.75" width="11.5" height="13.5" rx="1.5" />
    <path d="M7.5 3.75v-1h5v1M7.25 8.5l1.25 1.25 2.25-2.25M7.25 13h5.5" />
  </S>
)
export const IconExam = (p: P) => (
  <S {...p}>
    <rect x="3.75" y="2.75" width="12.5" height="14.5" rx="1.5" />
    <path d="M6.75 6.5h6.5M6.75 9.5h6.5M6.75 12.5h3.5" />
    <circle cx="13.5" cy="13.75" r="1.1" fill="currentColor" stroke="none" />
  </S>
)
export const IconEd = (p: P) => (
  <S {...p}>
    <path d="M3.25 5.25a2 2 0 0 1 2-2h9.5a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2H9l-3.75 3v-3h0a2 2 0 0 1-2-2z" />
    <path d="M7 7.25h6M7 10h4" />
  </S>
)
export const IconUpload = (p: P) => (
  <S {...p}>
    <path d="M10 13V3.5M6.5 7 10 3.5 13.5 7" />
    <path d="M3.5 12.5v2.75a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5V12.5" />
  </S>
)
export const IconDownload = (p: P) => (
  <S {...p}>
    <path d="M10 3.5V13M6.5 9.5 10 13l3.5-3.5" />
    <path d="M3.5 12.5v2.75a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5V12.5" />
  </S>
)
export const IconCheck = (p: P) => (
  <S {...p}>
    <path d="m4.5 10.5 3.5 3.5 7.5-8" />
  </S>
)
export const IconX = (p: P) => (
  <S {...p}>
    <path d="m5.5 5.5 9 9M14.5 5.5l-9 9" />
  </S>
)
export const IconMinus = (p: P) => (
  <S {...p}>
    <path d="M5 10h10" />
  </S>
)
export const IconChevron = (p: P & { dir?: 'down' | 'up' | 'left' | 'right' }) => {
  const r = { down: 0, up: 180, left: 90, right: -90 }[p.dir ?? 'down']
  return (
    <S {...p}>
      <path d="m6 8 4 4 4-4" transform={`rotate(${r} 10 10)`} />
    </S>
  )
}
export const IconCopy = (p: P) => (
  <S {...p}>
    <rect x="6.75" y="6.75" width="10" height="10" rx="1.75" />
    <path d="M13.25 6.75V4.5a1.25 1.25 0 0 0-1.25-1.25H4.5A1.25 1.25 0 0 0 3.25 4.5V12a1.25 1.25 0 0 0 1.25 1.25h2.25" />
  </S>
)
export const IconThumb = (p: P & { down?: boolean }) => (
  <S {...p}>
    <g transform={p.down ? 'rotate(180 10 10)' : undefined}>
      <path d="M6.25 8.75v8h-2.5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1z" />
      <path d="M6.25 8.75 9.5 3.25a1.6 1.6 0 0 1 2.9 1.2l-.65 3.3h4a1.5 1.5 0 0 1 1.47 1.8l-1.1 5.6a2 2 0 0 1-1.96 1.6H6.25" />
    </g>
  </S>
)
export const IconSend = (p: P) => (
  <S {...p}>
    <path d="M10 16V4.5M5 9.25 10 4.25l5 5" />
  </S>
)
export const IconStop = (p: P) => (
  <S {...p}>
    <rect x="5.5" y="5.5" width="9" height="9" rx="1.5" fill="currentColor" stroke="none" />
  </S>
)
export const IconInfo = (p: P) => (
  <S {...p}>
    <circle cx="10" cy="10" r="7.25" />
    <path d="M10 9v4.5" />
    <circle cx="10" cy="6.6" r=".9" fill="currentColor" stroke="none" />
  </S>
)
export const IconSearch = (p: P) => (
  <S {...p}>
    <circle cx="8.75" cy="8.75" r="5.25" />
    <path d="m12.75 12.75 4 4" />
  </S>
)
export const IconPower = (p: P) => (
  <S {...p}>
    <path d="M10 2.75V9.5" />
    <path d="M6 5.25a6.25 6.25 0 1 0 8 0" />
  </S>
)
export const IconPause = (p: P) => (
  <S {...p}>
    <path d="M7.5 5v10M12.5 5v10" />
  </S>
)
export const IconFlag = (p: P) => (
  <S {...p}>
    <path d="M4.75 17.25V3.5" />
    <path d="M4.75 3.75h9.5l-2 3.5 2 3.5h-9.5" />
  </S>
)
export const IconMore = (p: P) => (
  <S {...p}>
    <circle cx="5" cy="10" r=".9" fill="currentColor" />
    <circle cx="10" cy="10" r=".9" fill="currentColor" />
    <circle cx="15" cy="10" r=".9" fill="currentColor" />
  </S>
)
export const IconPlus = (p: P) => (
  <S {...p}>
    <path d="M10 4.5v11M4.5 10h11" />
  </S>
)
export const IconEye = (p: P) => (
  <S {...p}>
    <path d="M2.5 10s2.75-5.25 7.5-5.25S17.5 10 17.5 10s-2.75 5.25-7.5 5.25S2.5 10 2.5 10z" />
    <circle cx="10" cy="10" r="2.25" />
  </S>
)
export const IconPlay = (p: P) => (
  <S {...p}>
    <path d="M7 5.25v9.5l7.25-4.75z" fill="currentColor" stroke="none" />
  </S>
)
export const IconPencil = (p: P) => (
  <S {...p}>
    <path d="m12.75 4.25 3 3L7.5 15.5l-3.75.75.75-3.75z" />
    <path d="m11.25 5.75 3 3" />
  </S>
)
export const IconTrash = (p: P) => (
  <S {...p}>
    <path d="M3.75 5.75h12.5M8 5.75V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.75M5.5 5.75l.75 10.5a1 1 0 0 0 1 .95h5.5a1 1 0 0 0 1-.95l.75-10.5" />
  </S>
)
export const IconLock = (p: P) => (
  <S {...p}>
    <rect x="4.25" y="8.75" width="11.5" height="8.5" rx="1.75" />
    <path d="M6.75 8.75V6.5a3.25 3.25 0 0 1 6.5 0v2.25" />
  </S>
)
export const IconRefresh = (p: P) => (
  <S {...p}>
    <path d="M15.75 9.25a5.75 5.75 0 1 0-1.7 4.6" />
    <path d="M16 4.5v4.75h-4.75" />
  </S>
)
export const IconMegaphone = (p: P) => (
  <S {...p}>
    <path d="M3.25 8v4h2.5l6.5 3.75V4.25L5.75 8z" />
    <path d="M14.75 7.5a3.25 3.25 0 0 1 0 5M6.25 12.25l1 4.5h2l-.75-3.6" />
  </S>
)
export const IconClock = (p: P) => (
  <S {...p}>
    <circle cx="10" cy="10" r="7.25" />
    <path d="M10 6v4.25l2.75 1.75" />
  </S>
)
export const IconArrowOut = (p: P) => (
  <S {...p}>
    <path d="M8.5 4.75H5a1.25 1.25 0 0 0-1.25 1.25v9A1.25 1.25 0 0 0 5 16.25h9A1.25 1.25 0 0 0 15.25 15v-3.5" />
    <path d="M11.5 3.75h4.75V8.5M16 4l-6.5 6.5" />
  </S>
)
export const IconBook = (p: P) => (
  <S {...p}>
    <path d="M10 5.25C8.5 3.9 6.25 3.5 3.25 3.75v11.5c3-.25 5.25.15 6.75 1.5 1.5-1.35 3.75-1.75 6.75-1.5V3.75c-3-.25-5.25.15-6.75 1.5z" />
    <path d="M10 5.25v11.5" />
  </S>
)

export const IconLectern = (p: P) => (
  <S {...p}>
    <path d="M3.75 8.25 16.25 5.5v2.25L3.75 10.5z" />
    <path d="M10 9.4v6.85M6.25 16.75h7.5" />
  </S>
)

export const kindIcon: Record<string, (p: P) => JSX.Element> = {
  lecture: IconLecture,
  slides: IconSlides,
  syllabus: IconSyllabus,
  pset: IconPset,
  exam: IconExam,
  ed: IconEd,
  upload: IconUpload,
}
