import { NextRequest, NextResponse } from 'next/server'
import { getUserWithRelationships } from '@/lib/neo4j'

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params
    const user = await getUserWithRelationships(id)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(user)
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
} 