'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { useToast } from '../providers/ToastProvider'

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void
  selectedImage?: string | null
}

export default function ImageUpload({ onImageSelect, selectedImage }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToast } = useToast()

  const handleFileSelect = (file: File) => {
    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
      addToast('error', 'Invalid file format. Please use PNG, JPG, JPEG, or WebP.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast('error', 'File too large. Maximum size is 10MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const preview = e.target?.result as string
      onImageSelect(file, preview)
      addToast('success', 'Image uploaded successfully!')
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  if (selectedImage) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Selected Image
          </h3>
          <div className="relative">
            <img
              src={selectedImage}
              alt="Selected for analysis"
              className="w-full h-64 object-contain rounded-lg bg-gray-100 dark:bg-gray-700"
            />
            <button
              onClick={() => onImageSelect(null as any, null as any)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Upload Image
        </h3>
        <motion.div
          className={`border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <motion.div
              animate={{ y: isDragging ? -10 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
            </motion.div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              PNG, JPG, JPEG, WebP (max 10MB)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileInput}
          />
        </motion.div>
      </div>
    </div>
  )
}
import { cn } from '../../lib/utils'