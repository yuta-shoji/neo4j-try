'use client'

import { useState } from 'react'
import { CreateUserInput } from '@/lib/types'

interface UserFormProps {
  onSubmit: (userData: CreateUserInput) => void
  isLoading?: boolean
}

export function UserForm({ onSubmit, isLoading = false }: UserFormProps) {
  const [formData, setFormData] = useState<CreateUserInput>({
    name: '',
    email: ''
  })

  const [errors, setErrors] = useState<Partial<CreateUserInput>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 簡単なバリデーション
    const newErrors: Partial<CreateUserInput> = {}
    if (!formData.name.trim()) {
      newErrors.name = '名前は必須です'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    onSubmit(formData)
    
    // フォームをリセット
    setFormData({ name: '', email: '' })
  }

  const handleChange = (field: keyof CreateUserInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          名前
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="山田太郎"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          メールアドレス
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="yamada@example.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        } transition-colors`}
      >
        {isLoading ? '作成中...' : 'ユーザーを作成'}
      </button>
    </form>
  )
} 