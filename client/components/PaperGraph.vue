<template>
  <div class="relative w-full rounded-2xl overflow-hidden bg-[#111113] border border-gray-800" :style="{ height: height + 'px' }">

    <!-- Empty state -->
    <div v-if="!nodes.length" class="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <circle cx="12" cy="12" r="3"/><circle cx="3" cy="6" r="2"/><circle cx="21" cy="6" r="2"/><circle cx="3" cy="18" r="2"/><circle cx="21" cy="18" r="2"/>
        <path d="M5 6.5h4.5M14.5 6.5H19M5 17.5h4.5M14.5 17.5H19M12 9v6"/>
      </svg>
      <p class="text-xs text-gray-600">Like papers to build your graph</p>
    </div>

    <svg v-else ref="svgEl" class="w-full h-full" @mousemove="onMouseMove" @mouseleave="hovered = null">
      <defs>
        <radialGradient v-for="c in colorList" :key="c.id" :id="'glow-' + c.id" cx="50%" cy="50%" r="50%">
          <stop offset="0%" :stop-color="c.color" stop-opacity="0.6"/>
          <stop offset="100%" :stop-color="c.color" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Edges -->
      <line
        v-for="(edge, i) in edges"
        :key="'e' + i"
        :x1="simNodes[edge.source]?.x"
        :y1="simNodes[edge.source]?.y"
        :x2="simNodes[edge.target]?.x"
        :y2="simNodes[edge.target]?.y"
        stroke="#ffffff"
        stroke-opacity="0.06"
        stroke-width="1"
      />

      <!-- Glow halos -->
      <circle
        v-for="(node, i) in simNodes"
        :key="'halo' + i"
        :cx="node.x"
        :cy="node.y"
        :r="hovered === i ? 28 : 18"
        :fill="`url(#glow-${node.colorId})`"
        style="transition: r 0.2s"
      />

      <!-- Nodes -->
      <circle
        v-for="(node, i) in simNodes"
        :key="'n' + i"
        :cx="node.x"
        :cy="node.y"
        :r="hovered === i ? 9 : 6"
        :fill="node.color"
        :fill-opacity="hovered === i ? 1 : 0.85"
        class="cursor-pointer"
        style="transition: r 0.15s"
        @click="$emit('select', node.paper)"
      />

      <!-- Labels on hover -->
      <g v-if="hovered !== null && simNodes[hovered]">
        <rect
          :x="simNodes[hovered].x + 12"
          :y="simNodes[hovered].y - 14"
          :width="Math.min(labelWidth, 200)"
          height="22"
          rx="4"
          fill="#242426"
          fill-opacity="0.95"
          stroke="#374151"
          stroke-width="0.5"
        />
        <text
          :x="simNodes[hovered].x + 18"
          :y="simNodes[hovered].y + 2"
          font-size="10"
          fill="#e5e7eb"
          font-family="system-ui, sans-serif"
        >{{ truncate(simNodes[hovered].label, 28) }}</text>
      </g>
    </svg>

    <!-- Legend -->
    <div v-if="nodes.length" class="absolute bottom-3 left-3 flex flex-wrap gap-2">
      <div v-for="area in areas" :key="area.label" class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full shrink-0" :style="{ background: area.color }"></span>
        <span class="text-xs text-gray-500">{{ area.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  papers: any[]
  height?: number
}>()
defineEmits(['select'])

const height = props.height || 380
const svgEl = ref<SVGElement | null>(null)
const hovered = ref<number | null>(null)
const labelWidth = ref(160)

const TOPIC_COLORS: Record<string, { color: string; label: string; id: string }> = {
  'cs.AI': { color: '#14b8a6', label: 'AI', id: 'ai' },
  'cs.LG': { color: '#14b8a6', label: 'ML', id: 'ml' },
  'cs.CV': { color: '#8b5cf6', label: 'Vision', id: 'cv' },
  'cs.CL': { color: '#3b82f6', label: 'NLP', id: 'cl' },
  'cs.RO': { color: '#f59e0b', label: 'Robotics', id: 'ro' },
  'math':  { color: '#a855f7', label: 'Math', id: 'math' },
  'eess':  { color: '#f97316', label: 'Engineering', id: 'eess' },
  'default': { color: '#6b7280', label: 'Other', id: 'other' },
}

function getColor(paper: any) {
  const cat = paper.category || paper.postDetails?.category || ''
  for (const [key, val] of Object.entries(TOPIC_COLORS)) {
    if (key !== 'default' && cat.startsWith(key.split('.')[0])) return val
  }
  return TOPIC_COLORS.default
}

const nodes = computed(() =>
  props.papers
    .map(p => p.postDetails || p)
    .filter(p => p?.title)
    .map((p, i) => ({ id: i, label: p.title, authors: p.authors || '', paper: p, ...getColor(p) }))
)

const edges = computed(() => {
  const result: { source: number; target: number }[] = []
  for (let i = 0; i < nodes.value.length; i++) {
    for (let j = i + 1; j < nodes.value.length; j++) {
      const aAuthors = String(nodes.value[i].authors).toLowerCase()
      const bAuthors = String(nodes.value[j].authors).toLowerCase()
      // Connect if same topic color OR share author name fragment
      if (nodes.value[i].id === nodes.value[j].id) continue
      if (nodes.value[i].color === nodes.value[j].color) {
        result.push({ source: i, target: j })
      } else if (aAuthors && bAuthors) {
        const aNames = aAuthors.split(/[,\s]+/).filter(s => s.length > 3)
        if (aNames.some(n => bAuthors.includes(n))) result.push({ source: i, target: j })
      }
    }
  }
  return result
})

const areas = computed(() => {
  const seen = new Map<string, { color: string; label: string }>()
  for (const n of nodes.value) {
    if (!seen.has(n.id)) seen.set(n.id, { color: n.color, label: n.label as string })
  }
  return [...seen.values()]
})

const colorList = computed(() => Object.values(TOPIC_COLORS))

// Force simulation
interface SimNode { x: number; y: number; vx: number; vy: number; label: string; color: string; colorId: string; paper: any }
const simNodes = ref<SimNode[]>([])
let animFrame: number | null = null

watch(() => nodes.value, (newNodes) => {
  const w = svgEl.value?.clientWidth || 700
  const h = height
  simNodes.value = newNodes.map((n, i) => ({
    x: w / 2 + (Math.random() - 0.5) * w * 0.6,
    y: h / 2 + (Math.random() - 0.5) * h * 0.6,
    vx: 0, vy: 0,
    label: n.label,
    color: n.color,
    colorId: n.id,
    paper: n.paper,
  }))
  if (animFrame) cancelAnimationFrame(animFrame)
  runSim()
}, { immediate: true })

function runSim() {
  const w = svgEl.value?.clientWidth || 700
  const h = height
  const ns = simNodes.value
  const es = edges.value
  let alpha = 1

  function tick() {
    alpha *= 0.97
    const repulsion = 2200
    const spring = 0.012
    const rest = 100

    for (let i = 0; i < ns.length; i++) {
      for (let j = i + 1; j < ns.length; j++) {
        const dx = ns[j].x - ns[i].x || 0.1
        const dy = ns[j].y - ns[i].y || 0.1
        const d2 = dx * dx + dy * dy
        const d = Math.sqrt(d2)
        const f = repulsion / d2
        ns[i].vx -= f * dx / d
        ns[i].vy -= f * dy / d
        ns[j].vx += f * dx / d
        ns[j].vy += f * dy / d
      }
    }

    for (const e of es) {
      const a = ns[e.source], b = ns[e.target]
      if (!a || !b) continue
      const dx = b.x - a.x, dy = b.y - a.y
      const d = Math.sqrt(dx * dx + dy * dy) || 1
      const f = spring * (d - rest)
      a.vx += f * dx / d; a.vy += f * dy / d
      b.vx -= f * dx / d; b.vy -= f * dy / d
    }

    // Center gravity
    for (const n of ns) {
      n.vx += (w / 2 - n.x) * 0.002
      n.vy += (h / 2 - n.y) * 0.002
      n.vx *= 0.85; n.vy *= 0.85
      n.x = Math.max(20, Math.min(w - 20, n.x + n.vx))
      n.y = Math.max(20, Math.min(h - 20, n.y + n.vy))
    }

    if (alpha > 0.005) animFrame = requestAnimationFrame(tick)
  }
  animFrame = requestAnimationFrame(tick)
}

function onMouseMove(e: MouseEvent) {
  const rect = (e.currentTarget as SVGElement).getBoundingClientRect()
  const mx = e.clientX - rect.left
  const my = e.clientY - rect.top
  let closest: number | null = null
  let minD = 20
  simNodes.value.forEach((n, i) => {
    const d = Math.sqrt((n.x - mx) ** 2 + (n.y - my) ** 2)
    if (d < minD) { minD = d; closest = i }
  })
  hovered.value = closest
}

function truncate(s: string, len: number) {
  return s.length > len ? s.slice(0, len) + '…' : s
}

onUnmounted(() => { if (animFrame) cancelAnimationFrame(animFrame) })
</script>
