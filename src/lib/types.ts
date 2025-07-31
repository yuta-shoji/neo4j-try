export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface CreateUserInput {
  name: string
  email: string
}

export interface Relationship {
  fromUserId: string
  toUserId: string
  type: 'FRIEND' | 'COLLEAGUE' | 'FAMILY'
}

export interface CreateRelationshipInput {
  fromUserId: string
  toUserId: string
  type: 'FRIEND' | 'COLLEAGUE' | 'FAMILY'
}

export interface UserWithRelationships extends User {
  friends: User[]
  relationshipCount: number
}

// 関係性表示用の型を追加
export interface RelationshipDisplay {
  from: {
    id: string
    name: string
    email: string
  }
  to: {
    id: string
    name: string
    email: string
  }
  type: string
} 