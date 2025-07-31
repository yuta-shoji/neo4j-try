'use client'

import { useState } from 'react'
import { CreateRelationshipInput, User } from '@/lib/types'

interface RelationshipFormProps {
  users: User[]
  onSubmit: (relationshipData: CreateRelationshipInput) => void
  isLoading?: boolean
}

export function RelationshipForm({ users, onSubmit, isLoading = false }: RelationshipFormProps) {
  const [formData, setFormData] = useState<CreateRelationshipInput>({
    fromUserId: '',
    toUserId: '',
    type: 'FRIEND'
  })

  const [errors, setErrors] = useState<Partial<CreateRelationshipInput>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // バリデーション
    const newErrors: Partial<CreateRelationshipInput> = {}
    if (!formData.fromUserId) {
      newErrors.fromUserId = 'ユーザーを選択してください'
    }
    if (!formData.toUserId) {
      newErrors.toUserId = 'ユーザーを選択してください'
    }
    if (formData.fromUserId === formData.toUserId) {
      newErrors.toUserId = '異なるユーザーを選択してください'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    onSubmit(formData)
    
    // フォームをリセット
    setFormData({ fromUserId: '', toUserId: '', type: 'FRIEND' })
  }

  const handleChange = (field: keyof CreateRelationshipInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fromUser" className="block text-sm font-medium text-gray-700 mb-1">
          ユーザー1
        </label>
        <select
          id="fromUser"
          value={formData.fromUserId}
          onChange={(e) => handleChange('fromUserId', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.fromUserId ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        >
          <option value="">ユーザーを選択...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
        {errors.fromUserId && (
          <p className="mt-1 text-sm text-red-600">{errors.fromUserId}</p>
        )}
      </div>

      <div>
        <label htmlFor="toUser" className="block text-sm font-medium text-gray-700 mb-1">
          ユーザー2
        </label>
        <select
          id="toUser"
          value={formData.toUserId}
          onChange={(e) => handleChange('toUserId', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.toUserId ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        >
          <option value="">ユーザーを選択...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
        {errors.toUserId && (
          <p className="mt-1 text-sm text-red-600">{errors.toUserId}</p>
        )}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          関係性の種類
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value as CreateRelationshipInput['type'])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="FRIEND">友達</option>
          <option value="COLLEAGUE">同僚</option>
          <option value="FAMILY">家族</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading || users.length < 2}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          isLoading || users.length < 2
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600'
        } transition-colors`}
      >
        {isLoading ? '作成中...' : '関係性を作成'}
      </button>
      
      {users.length < 2 && (
        <p className="text-sm text-gray-500 text-center">
          関係性を作成するには最低2人のユーザーが必要です
        </p>
      )}
    </form>
  )
} 