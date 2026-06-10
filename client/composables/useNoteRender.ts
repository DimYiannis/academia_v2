// Minimal, safe markdown-lite for personal notes.
// HTML is escaped first, then a small whitelist of patterns is transformed:
//   **bold**  *italic*  `code`  "- " bullet lines  \n line breaks
export function renderNote(text: string): string {
  if (!text) return ''

  const esc = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

  const lines = esc.split('\n').map(line => {
    let l = line
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-gray-800 text-teal-300 text-[0.85em]">$1</code>')
    if (/^\s*-\s+/.test(l)) {
      l = '<span class="flex gap-2"><span class="text-teal-500">•</span><span>' + l.replace(/^\s*-\s+/, '') + '</span></span>'
    }
    return l
  })

  return lines.join('<br>').replace(/<\/span><br>/g, '</span>')
}
