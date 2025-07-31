import neo4j, { Driver, Session } from 'neo4j-driver'
import { User, CreateUserInput, CreateRelationshipInput, UserWithRelationships } from './types'

class Neo4jService {
  private driver: Driver
  private static instance: Neo4jService

  private constructor() {
    this.driver = neo4j.driver(
      process.env.NEO4J_URI || 'bolt://localhost:7687',
      neo4j.auth.basic(
        process.env.NEO4J_USERNAME || 'neo4j',
        process.env.NEO4J_PASSWORD || 'password'
      )
    )
  }

  static getInstance(): Neo4jService {
    if (!Neo4jService.instance) {
      Neo4jService.instance = new Neo4jService()
    }
    return Neo4jService.instance
  }

  async getSession(): Promise<Session> {
    return this.driver.session()
  }

  async close(): Promise<void> {
    await this.driver.close()
  }

  async verifyConnection(): Promise<boolean> {
    const session = await this.getSession()
    try {
      await session.run('RETURN 1 as test')
      return true
    } catch (error) {
      console.error('Neo4j connection failed:', error)
      return false
    } finally {
      await session.close()
    }
  }
}

export const neo4jService = Neo4jService.getInstance()

// ユーザー関連のクエリ関数
export async function getAllUsers(): Promise<User[]> {
  const session = await neo4jService.getSession()
  try {
    const result = await session.run(
      'MATCH (u:User) RETURN u ORDER BY u.createdAt DESC'
    )
    return result.records.map(record => {
      const user = record.get('u').properties
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    })
  } finally {
    await session.close()
  }
}

export async function createUser(userData: CreateUserInput): Promise<User> {
  const session = await neo4jService.getSession()
  try {
    const result = await session.run(
      `CREATE (u:User {
         id: randomUUID(),
         name: $name,
         email: $email,
         createdAt: datetime().epochSeconds
       })
       RETURN u`,
      userData
    )
    const user = result.records[0].get('u').properties
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toString()
    }
  } finally {
    await session.close()
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  const session = await neo4jService.getSession()
  try {
    const result = await session.run(
      'MATCH (u:User {id: $userId}) RETURN u',
      { userId }
    )
    if (result.records.length === 0) return null
    
    const user = result.records[0].get('u').properties
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toString()
    }
  } finally {
    await session.close()
  }
}

export async function getUserWithRelationships(userId: string): Promise<UserWithRelationships | null> {
  const session = await neo4jService.getSession()
  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})
       OPTIONAL MATCH (u)-[:FRIEND]-(friend:User)
       RETURN u, collect(friend) as friends`,
      { userId }
    )
    
    if (result.records.length === 0) return null
    
    const record = result.records[0]
    const user = record.get('u').properties
    const friends = record.get('friends').map((friend: any) => ({
      id: friend.properties.id,
      name: friend.properties.name,
      email: friend.properties.email,
      createdAt: friend.properties.createdAt.toString()
    }))
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toString(),
      friends,
      relationshipCount: friends.length
    }
  } finally {
    await session.close()
  }
}

// 関係性関連のクエリ関数
export async function createRelationship(relationshipData: CreateRelationshipInput): Promise<boolean> {
  const session = await neo4jService.getSession()
  try {
    await session.run(
      `MATCH (from:User {id: $fromUserId}), (to:User {id: $toUserId})
       CREATE (from)-[:${relationshipData.type}]->(to)`,
      relationshipData
    )
    return true
  } catch (error) {
    console.error('Failed to create relationship:', error)
    return false
  } finally {
    await session.close()
  }
}

export async function getAllRelationships() {
  const session = await neo4jService.getSession()
  try {
    const result = await session.run(
      `MATCH (from:User)-[r]-(to:User)
       RETURN from, to, type(r) as relationshipType`
    )
    
    return result.records.map(record => ({
      from: {
        id: record.get('from').properties.id,
        name: record.get('from').properties.name,
        email: record.get('from').properties.email
      },
      to: {
        id: record.get('to').properties.id,
        name: record.get('to').properties.name,
        email: record.get('to').properties.email
      },
      type: record.get('relationshipType')
    }))
  } finally {
    await session.close()
  }
} 