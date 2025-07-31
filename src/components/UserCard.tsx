'use client'

import { User } from '@/lib/types'

interface UserCardProps {
  user: User
  friendsCount?: number
  onViewDetails?: (userId: string) => void
}

export function UserCard({ user, friendsCount = 0, onViewDetails }: UserCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
        <span className="text-sm text-gray-500">
          {friendsCount} 人の友達
        </span>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600">{user.email}</p>
        <p className="text-sm text-gray-400 mt-2">
          作成日: {new Date(parseInt(user.createdAt) * 1000).toLocaleDateString('ja-JP')}
        </p>
      </div>
      
      {onViewDetails && (
        <button
          onClick={() => onViewDetails(user.id)}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          詳細を見る
        </button>
      )}
    </div>
  )
} 