// Module-level singleton — shared across layout and page without Nuxt composable context requirement
const _searchQuery = ref('')
export const useSearchQuery = () => _searchQuery
