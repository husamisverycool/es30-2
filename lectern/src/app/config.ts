/** The published artifact's link. Students open it with #student; the console's "Open in a new tab" uses it too,
 *  so both tabs live under the same viewer and share saved state. Filled in after the first publish. */
export const ARTIFACT_URL = 'https://claude.ai/artifact/Dsn1kNKUcrwKrWMKboUerX'
export const STUDENT_URL = ARTIFACT_URL ? `${ARTIFACT_URL}#student` : ''
