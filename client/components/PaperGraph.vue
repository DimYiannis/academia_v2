<template>
  <div
    class="relative w-full rounded-2xl overflow-hidden bg-[#111113] border border-gray-800 select-none"
    :style="{ height: height + 'px' }"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseLeave"
  >
    <!-- Empty state -->
    <div v-if="!nodes.length" class="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <circle cx="12" cy="12" r="3"/><circle cx="3" cy="6" r="2"/><circle cx="21" cy="6" r="2"/>
        <circle cx="3" cy="18" r="2"/><circle cx="21" cy="18" r="2"/>
        <path d="M5 6.5h4.5M14.5 6.5H19M5 17.5h4.5M14.5 17.5H19M12 9v6"/>
      </svg>
      <p class="text-xs text-gray-600">Like papers to build your graph</p>
    </div>

    <svg v-else ref="svgEl" class="w-full h-full" style="cursor: grab">
      <defs>
        <radialGradient v-for="c in colorList" :key="c.id" :id="'glow-' + c.id" cx="50%" cy="50%" r="50%">
          <stop offset="0%" :stop-color="c.color" stop-opacity="0.7"/>
          <stop offset="100%" :stop-color="c.color" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Edges -->
      <line
        v-for="(edge, i) in edges" :key="'e'+i"
        :x1="simNodes[edge.source]?.x" :y1="simNodes[edge.source]?.y"
        :x2="simNodes[edge.target]?.x" :y2="simNodes[edge.target]?.y"
        :stroke="selectedIdx === edge.source || selectedIdx === edge.target ? '#ffffff' : '#ffffff'"
        :stroke-opacity="selectedIdx === edge.source || selectedIdx === edge.target ? 0.2 : 0.06"
        stroke-width="1"
      />

      <!-- Glow halos -->
      <circle
        v-for="(node, i) in simNodes" :key="'halo'+i"
        :cx="node.x" :cy="node.y"
        :r="selectedIdx === i ? 32 : hoveredIdx === i ? 26 : 18"
        :fill="`url(#glow-${node.colorId})`"
        style="pointer-events:none; transition: r 0.15s"
      />

      <!-- Nodes -->
      <circle
        v-for="(node, i) in simNodes" :key="'n'+i"
        :cx="node.x" :cy="node.y"
        :r="selectedIdx === i ? 10 : hoveredIdx === i ? 8 : 6"
        :fill="node.color"
        :fill-opacity="selectedIdx === i || hoveredIdx === i ? 1 : 0.8"
        :stroke="selectedIdx === i ? '#ffffff' : 'none'"
        stroke-width="1.5"
        style="cursor: grab; transition: r 0.12s"
        @mousedown.stop="startDrag(i, $event)"
      />

      <!-- Hover label (only when not selected) -->
      <g v-if="hoveredIdx !== null && selectedIdx === null && simNodes[hoveredIdx]" style="pointer-events:none">
        <rect
          :x="simNodes[hoveredIdx].x + 12" :y="simNodes[hoveredIdx].y - 14"
          :width="220" height="22" rx="4"
          fill="#1c1c1e" fill-opacity="0.95" stroke="#374151" stroke-width="0.5"
        />
        <text :x="simNodes[hoveredIdx].x + 18" :y="simNodes[hoveredIdx].y + 2"
          font-size="10" fill="#e5e7eb" font-family="system-ui,sans-serif">
          {{ truncate(simNodes[hoveredIdx].label, 30) }}
        </text>
      </g>
    </svg>

    <!-- Info panel — shown when node is clicked -->
    <Transition name="slide">
      <div
        v-if="selectedIdx !== null && simNodes[selectedIdx]"
        class="absolute right-0 top-0 h-full w-72 bg-[#18181b]/95 border-l border-gray-700/60 backdrop-blur-sm flex flex-col p-5 overflow-y-auto"
      >
        <!-- Close -->
        <button
          class="absolute top-3 right-3 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-700/50 transition-colors"
          @click="selectedIdx = null"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>

        <!-- Color indicator -->
        <div class="flex items-center gap-2 mb-3">
          <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ background: simNodes[selectedIdx].color }"></span>
          <span class="text-xs text-gray-500">{{ simNodes[selectedIdx].categoryLabel }}</span>
        </div>

        <!-- Title -->
        <h3 class="text-sm font-semibold text-white leading-snug mb-3">
          {{ simNodes[selectedIdx].label }}
        </h3>

        <!-- Authors -->
        <p v-if="simNodes[selectedIdx].authors" class="text-xs text-gray-500 mb-3 leading-relaxed">
          {{ simNodes[selectedIdx].authors }}
        </p>

        <!-- Paper / Note toggle -->
        <div class="flex gap-1 p-0.5 bg-gray-800/60 rounded-lg mb-3 w-fit">
          <button @click="panelTab = 'paper'" class="px-3 py-1 rounded-md text-xs font-medium transition-colors"
            :class="panelTab === 'paper' ? 'bg-[#242426] text-white' : 'text-gray-400'">Paper</button>
          <button @click="panelTab = 'note'" class="px-3 py-1 rounded-md text-xs font-medium transition-colors"
            :class="panelTab === 'note' ? 'bg-[#242426] text-white' : 'text-gray-400'">Note</button>
        </div>

        <!-- Paper view: abstract -->
        <p v-if="panelTab === 'paper'" class="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-[10]">
          {{ simNodes[selectedIdx].abstract || 'No abstract available.' }}
        </p>

        <!-- Note view -->
        <div v-else class="mb-4">
          <p v-if="noteLoading" class="text-xs text-gray-600">Loading note…</p>
          <p v-else-if="note" class="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap border-l-2 border-teal-700/60 pl-3">{{ note }}</p>
          <p v-else class="text-xs text-gray-600 italic">No note for this paper yet. Add one from the feed.</p>
        </div>

        <!-- Actions -->
        <div class="mt-auto flex flex-col gap-2">
          <NuxtLink
            :to="'/article/' + (simNodes[selectedIdx].paper?.arxivId || simNodes[selectedIdx].paper?.doi || simNodes[selectedIdx].paper?._id)"
            class="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium transition-colors"
            @click="selectedIdx = null"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
            </svg>
            Read paper
          </NuxtLink>
          <p class="text-xs text-gray-600 text-center">Drag nodes to rearrange</p>
        </div>
      </div>
    </Transition>

    <!-- Legend -->
    <div v-if="nodes.length" class="absolute bottom-3 left-3 flex flex-wrap gap-2">
      <div v-for="area in areas" :key="area.label" class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full shrink-0" :style="{ background: area.color }"></span>
        <span class="text-xs text-gray-600">{{ area.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
const props = defineProps<{ papers: any[]; height?: number }>()
const height = props.height || 420
const API_BASE = import.meta.dev ? 'http://localhost:5000' : 'https://academiav2-backend.onrender.com'
const svgEl = ref<SVGElement | null>(null)
const hoveredIdx = ref<number | null>(null)
const selectedIdx = ref<number | null>(null)
const panelTab = ref<'paper' | 'note'>('paper')
const note = ref('')
const noteLoading = ref(false)

// Fetch the user's note when a node is selected
watch(selectedIdx, async (idx) => {
  panelTab.value = 'paper'
  note.value = ''
  if (idx === null) return
  const p = simNodes.value[idx]?.paper
  const id = p?.arxivId || p?.doi || p?._id
  if (!id) return
  noteLoading.value = true
  try {
    const { data } = await axios.get(`${API_BASE}/api/v1/notes/${id}`, { withCredentials: true })
    note.value = data.note?.content || ''
  } catch (e) {
    note.value = ''
  } finally {
    noteLoading.value = false
  }
})

// Drag state
const dragState = ref<{ idx: number; startX: number; startY: number; moved: boolean } | null>(null)

const TOPIC_COLORS: Record<string, { color: string; label: string; id: string }> = {
  'cs.AI': { color: '#14b8a6', label: 'AI', id: 'teal' },
  'cs.LG': { color: '#06b6d4', label: 'ML', id: 'cyan' },
  'cs.CV': { color: '#8b5cf6', label: 'Vision', id: 'purple' },
  'cs.CL': { color: '#3b82f6', label: 'NLP', id: 'blue' },
  'cs.RO': { color: '#f59e0b', label: 'Robotics', id: 'amber' },
  'cs.':   { color: '#10b981', label: 'CS', id: 'emerald' },
  'math':  { color: '#a855f7', label: 'Math', id: 'violet' },
  'eess':  { color: '#f97316', label: 'Engineering', id: 'orange' },
  'stat':  { color: '#ec4899', label: 'Statistics', id: 'pink' },
  'default': { color: '#6b7280', label: 'Other', id: 'gray' },
}

function getTopicMeta(paper: any) {
  const cat = paper.category || paper.postDetails?.category || ''
  for (const [key, val] of Object.entries(TOPIC_COLORS)) {
    if (key !== 'default' && cat.startsWith(key)) return val
  }
  return TOPIC_COLORS.default
}

const colorList = computed(() => Object.values(TOPIC_COLORS))

const nodes = computed(() =>
  props.papers
    .map(p => p.postDetails || p)
    .filter(p => p?.title)
    .map((p, i) => {
      const meta = getTopicMeta(p)
      return {
        id: i, label: p.title,
        authors: Array.isArray(p.authors) ? p.authors.join(', ') : (p.authors || ''),
        abstract: p.abstract || '',
        categoryLabel: meta.label,
        color: meta.color, colorId: meta.id,
        paper: p,
      }
    })
)

const edges = computed(() => {
  const result: { source: number; target: number }[] = []
  const ns = nodes.value
  for (let i = 0; i < ns.length; i++) {
    for (let j = i + 1; j < ns.length; j++) {
      const sameColor = ns[i].colorId === ns[j].colorId
      let sharedAuthor = false
      if (ns[i].authors && ns[j].authors) {
        const aNames = ns[i].authors.toLowerCase().split(/[,\s]+/).filter((s: string) => s.length > 3)
        const bStr = ns[j].authors.toLowerCase()
        sharedAuthor = aNames.some((n: string) => bStr.includes(n))
      }
      if (sameColor || sharedAuthor) result.push({ source: i, target: j })
    }
  }
  return result
})

const areas = computed(() => {
  const seen = new Map<string, { color: string; label: string }>()
  for (const n of nodes.value) if (!seen.has(n.colorId)) seen.set(n.colorId, { color: n.color, label: n.categoryLabel })
  return [...seen.values()]
})

// Simulation
interface SimNode { x: number; y: number; vx: number; vy: number; pinned: boolean; label: string; color: string; colorId: string; authors: string; abstract: string; categoryLabel: string; paper: any }
const simNodes = ref<SimNode[]>([])
let animFrame: number | null = null
let alpha = 1

watch(() => nodes.value, (newNodes) => {
  const w = svgEl.value?.clientWidth || 700
  const h = height
  alpha = 1
  simNodes.value = newNodes.map(n => ({
    x: w / 2 + (Math.random() - 0.5) * w * 0.5,
    y: h / 2 + (Math.random() - 0.5) * h * 0.5,
    vx: 0, vy: 0, pinned: false,
    label: n.label, color: n.color, colorId: n.colorId,
    authors: n.authors, abstract: n.abstract,
    categoryLabel: n.categoryLabel, paper: n.paper,
  }))
  if (animFrame) cancelAnimationFrame(animFrame)
  tick()
}, { immediate: true })

function tick() {
  const w = svgEl.value?.clientWidth || 700
  const h = height
  const ns = simNodes.value
  const es = edges.value
  alpha *= 0.975

  for (let i = 0; i < ns.length; i++) {
    if (ns[i].pinned) continue
    for (let j = i + 1; j < ns.length; j++) {
      if (ns[j].pinned) continue
      const dx = ns[j].x - ns[i].x || 0.1
      const dy = ns[j].y - ns[i].y || 0.1
      const d2 = Math.max(dx*dx + dy*dy, 1)
      const d = Math.sqrt(d2)
      const f = (2400 / d2) * alpha
      ns[i].vx -= f * dx / d; ns[i].vy -= f * dy / d
      ns[j].vx += f * dx / d; ns[j].vy += f * dy / d
    }
  }

  for (const e of es) {
    const a = ns[e.source], b = ns[e.target]
    if (!a || !b || (a.pinned && b.pinned)) continue
    const dx = b.x - a.x, dy = b.y - a.y
    const d = Math.sqrt(dx*dx + dy*dy) || 1
    const f = 0.015 * (d - 110) * alpha
    if (!a.pinned) { a.vx += f*dx/d; a.vy += f*dy/d }
    if (!b.pinned) { b.vx -= f*dx/d; b.vy -= f*dy/d }
  }

  for (const n of ns) {
    if (n.pinned) continue
    n.vx += (w/2 - n.x) * 0.003 * alpha
    n.vy += (h/2 - n.y) * 0.003 * alpha
    n.vx *= 0.82; n.vy *= 0.82
    n.x = Math.max(16, Math.min(w - 16, n.x + n.vx))
    n.y = Math.max(16, Math.min(h - 16, n.y + n.vy))
  }

  if (alpha > 0.003) animFrame = requestAnimationFrame(tick)
}

function getSVGCoords(e: MouseEvent) {
  const rect = svgEl.value!.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function startDrag(idx: number, e: MouseEvent) {
  dragState.value = { idx, startX: e.clientX, startY: e.clientY, moved: false }
  simNodes.value[idx].pinned = true
  simNodes.value[idx].vx = 0
  simNodes.value[idx].vy = 0
  // Restart sim for neighbours
  alpha = Math.max(alpha, 0.3)
  if (!animFrame || alpha < 0.01) tick()
}

function onMouseMove(e: MouseEvent) {
  const { x, y } = getSVGCoords(e)

  if (dragState.value) {
    const dx = e.clientX - dragState.value.startX
    const dy = e.clientY - dragState.value.startY
    if (Math.sqrt(dx*dx + dy*dy) > 4) dragState.value.moved = true
    const n = simNodes.value[dragState.value.idx]
    n.x = Math.max(16, Math.min((svgEl.value?.clientWidth || 700) - 16, x))
    n.y = Math.max(16, Math.min(height - 16, y))
    return
  }

  // Hover detection
  let closest: number | null = null
  let minD = 18
  simNodes.value.forEach((n, i) => {
    const d = Math.sqrt((n.x - x)**2 + (n.y - y)**2)
    if (d < minD) { minD = d; closest = i }
  })
  hoveredIdx.value = closest
}

function onMouseUp(e: MouseEvent) {
  if (!dragState.value) return
  const { idx, moved } = dragState.value
  simNodes.value[idx].pinned = false
  if (!moved) {
    selectedIdx.value = selectedIdx.value === idx ? null : idx
  }
  dragState.value = null
  alpha = Math.max(alpha, 0.4)
  tick()
}

function onMouseLeave() {
  hoveredIdx.value = null
  if (dragState.value) {
    simNodes.value[dragState.value.idx].pinned = false
    dragState.value = null
  }
}

function truncate(s: string, len: number) {
  return s.length > len ? s.slice(0, len) + '…' : s
}

onUnmounted(() => { if (animFrame) cancelAnimationFrame(animFrame) })
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: transform 0.2s ease, opacity 0.2s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); opacity: 0; }
</style>
