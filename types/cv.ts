export type CvStatus = 'PENDING' | 'IN_REVIEW' | 'REVIEWED'

export interface CvFeedback {
  id: string
  question: string
  answer: string | null
  sort_order: number
  answered_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface CvReview {
  id: string
  user_id: string
  file_url: string
  file_name: string
  file_size: number
  mime_type: string
  status: CvStatus
  notes: string | null
  max_feedback: number
  feedback_count: number
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string | null
  updated_at: string | null
  feedback: CvFeedback[]
  is_unlocked: boolean
}
