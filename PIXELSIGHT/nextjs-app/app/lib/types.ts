export interface AnalysisResult {
  id: string
  imageUrl: string
  analysis: string
  analysisType: string
  confidence: number
  processingTime: number
  timestamp: Date
  metadata: {
    imageSize: number
    dimensions: { width: number; height: number }
    format: string
  }
  tags: string[]
}

export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

export interface AnalysisOption {
  id: string
  name: string
  icon: any
  color: string
  description?: string
}

export interface UploadState {
  file: File | null
  preview: string | null
  uploading: boolean
  error: string | null
}

export interface AnalysisStats {
  confidence: number
  processingTime: number
  imageSize: number
  format: string
  dimensions: { width: number; height: number }
}
export interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl: string
  plan: 'free' | 'pro' | 'enterprise'
  usageStats: {
    totalImagesAnalyzed: number
    totalAnalysisTime: number
    lastLogin: Date
  }
}