import { NextRequest, NextResponse } from 'next/server'
import { createRelationship, getAllRelationships } from '@/lib/neo4j'
import { createRelationshipSchema } from '@/lib/validations'

export async function GET() {
  try {
    const relationships = await getAllRelationships()
    return NextResponse.json(relationships)
  } catch (error) {
    console.error('Failed to fetch relationships:', error)
    return NextResponse.json(
      { error: 'Failed to fetch relationships' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createRelationshipSchema.parse(body)
    const success = await createRelationship(validatedData)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to create relationship' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Failed to create relationship:', error)
    if (error instanceof Error && 'issues' in error) {
      // Zod validation error
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create relationship' },
      { status: 500 }
    )
  }
} 