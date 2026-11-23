export interface BreadcrumbItem {
  title: string
  href?: string
}

const STATE_KEY = 'app-layout-breadcrumbs'

/** State breadcrumb untuk layout sidebar (`layouts/app-sidebar.vue`). */
export function useAppLayout() {
  const breadcrumbs = useState<BreadcrumbItem[]>(STATE_KEY, () => [])

  function setBreadcrumbs(items: BreadcrumbItem[]) {
    breadcrumbs.value = items.length > 0 ? [...items] : []
  }

  function clearBreadcrumbs() {
    breadcrumbs.value = []
  }

  return {
    breadcrumbs,
    setBreadcrumbs,
    clearBreadcrumbs
  }
}
