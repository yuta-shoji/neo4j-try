'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User, CreateUserInput, UserWithRelationships } from '@/lib/types'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error('ユーザーの取得に失敗しました')
      }
      return response.json()
    }
  })
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: async (): Promise<UserWithRelationships> => {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) {
        throw new Error('ユーザーの取得に失敗しました')
      }
      return response.json()
    },
    enabled: !!userId
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (userData: CreateUserInput): Promise<User> => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(userData)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'ユーザーの作成に失敗しました')
      }
      
      return response.json()
    },
    onSuccess: () => {
      // ユーザーリストを再取得
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
} 