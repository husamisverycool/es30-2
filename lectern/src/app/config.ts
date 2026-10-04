/** Where the student view lives. Inside the Claude artifact viewer it's the published artifact link;
 *  anywhere else (Netlify, a local server) it's this same page with #student. */
export const ARTIFACT_URL = 'https://claude.ai/artifact/Dsn1kNKUcrwKrWMKboUerX'

const inArtifact = typeof window !== 'undefined' && !!(window as unknown as { claude?: unknown }).claude
const hosted = typeof location !== 'undefined' && location.protocol.startsWith('http')

export const STUDENT_URL = inArtifact ? `${ARTIFACT_URL}#student` : hosted ? `${location.origin}${location.pathname}#student` : ''
