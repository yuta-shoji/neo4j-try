'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateRelationshipInput } from '@/lib/types'

export function useRelationships() {
  return useQuery({
    queryKey: ['relationships'],
    queryFn: async () => {
      const response = await fetch('/api/relationships')
      if (!response.ok) {
        throw new Error('関係性の取得に失敗しました')
      }
      return response.json()
    }
  })
}

export function useCreateRelationship() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (relationshipData: CreateRelationshipInput) => {
      const response = await fetch('/api/relationships', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(relationshipData)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '関係性の作成に失敗しました')
      }
      
      return response.json()
    },
    onSuccess: () => {
      // 関係性とユーザーリストを再取得
      queryClient.invalidateQueries({ queryKey: ['relationships'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
} 