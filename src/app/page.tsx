'use client'

import { useState } from 'react'
import { UserCard } from '@/components/UserCard'
import { UserForm } from '@/components/UserForm'
import { RelationshipForm } from '@/components/RelationshipForm'
import { useUsers, useCreateUser } from '@/hooks/useUsers'
import { useRelationships, useCreateRelationship } from '@/hooks/useRelationships'
import { RelationshipDisplay } from '@/lib/types'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'users' | 'relationships'>('users')
  
  // データフェッチング
  const { data: users = [], isLoading: usersLoading, error: usersError } = useUsers()
  const { data: relationships = [], isLoading: relationshipsLoading } = useRelationships()
  
  // ミューテーション
  const createUserMutation = useCreateUser()
  const createRelationshipMutation = useCreateRelationship()

  const handleCreateUser = async (userData: { name: string; email: string }) => {
    try {
      await createUserMutation.mutateAsync(userData)
      alert('ユーザーが正常に作成されました！')
    } catch (error) {
      alert(`エラー: ${error instanceof Error ? error.message : 'ユーザーの作成に失敗しました'}`)
    }
  }

  const handleCreateRelationship = async (relationshipData: { fromUserId: string; toUserId: string; type: 'FRIEND' | 'COLLEAGUE' | 'FAMILY' }) => {
    try {
      await createRelationshipMutation.mutateAsync(relationshipData)
      alert('関係性が正常に作成されました！')
    } catch (error) {
      alert(`エラー: ${error instanceof Error ? error.message : '関係性の作成に失敗しました'}`)
    }
  }

  const getUserFriendsCount = (userId: string) => {
    return relationships.filter((rel: RelationshipDisplay) => 
      rel.to.id === userId
    ).length
  }

  const tabs = [
    { id: 'users' as const, label: 'ユーザー管理', count: users.length },
    { id: 'relationships' as const, label: '関係性管理', count: relationships.length }
  ]

  if (usersError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <h2 className="text-xl font-semibold">エラーが発生しました</h2>
          <p className="mt-2">Neo4jデータベースに接続できません。</p>
          <p className="text-sm mt-1">接続情報を確認してください。</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-md text-left max-w-md mx-auto">
          <p className="text-sm text-gray-600">必要な設定:</p>
          <ul className="text-sm text-gray-700 mt-2 space-y-1">
            <li>• Neo4jが localhost:7687 で起動している</li>
            <li>• .env.local ファイルが正しく設定されている</li>
            <li>• 認証情報が正しい</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 rounded-full px-2.5 py-0.5 text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* ユーザー管理タブ */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ユーザー作成フォーム */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                新しいユーザーを作成
              </h2>
              <UserForm
                onSubmit={handleCreateUser}
                isLoading={createUserMutation.isPending}
              />
            </div>
          </div>

          {/* ユーザー一覧 */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              ユーザー一覧 ({users.length}人)
            </h2>
            
            {usersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">読み込み中...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-gray-500">まだユーザーが登録されていません。</p>
                <p className="text-sm text-gray-400 mt-1">左のフォームから最初のユーザーを作成してください。</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    friendsCount={getUserFriendsCount(user.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 関係性管理タブ */}
      {activeTab === 'relationships' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 関係性作成フォーム */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                新しい関係性を作成
              </h2>
              <RelationshipForm
                users={users}
                onSubmit={handleCreateRelationship}
                isLoading={createRelationshipMutation.isPending}
              />
            </div>
          </div>

          {/* 関係性一覧 */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              関係性一覧 ({relationships.length}件)
            </h2>
            
            {relationshipsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">読み込み中...</p>
              </div>
            ) : relationships.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-gray-500">まだ関係性が登録されていません。</p>
                <p className="text-sm text-gray-400 mt-1">左のフォームから関係性を作成してください。</p>
              </div>
            ) : (
              <div className="space-y-3">
                {relationships.map((relationship: RelationshipDisplay, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">
                            {relationship.from.name}
                          </span>
                          <span className="text-gray-500 mx-2">←→</span>
                          <span className="font-medium text-gray-900">
                            {relationship.to.name}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        relationship.type === 'FRIEND' 
                          ? 'bg-blue-100 text-blue-800'
                          : relationship.type === 'COLLEAGUE'
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {relationship.type === 'FRIEND' ? '友達' : 
                         relationship.type === 'COLLEAGUE' ? '同僚' : '家族'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 