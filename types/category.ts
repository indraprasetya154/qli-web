export interface CategoryRow {
  code: string
  name: string
  description?: string | null
  is_active: boolean
}

export interface CategoryDetailRow extends CategoryRow {
  created_at?: string | null
  updated_at?: string | null
}
