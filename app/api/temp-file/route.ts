import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for temporary files (will be lost on server restart)
// For production, consider using Redis or a proper temp file storage
const tempFiles = new Map<string, { file: Buffer; metadata: any; expiresAt: number }>()

// Clean up expired files every 5 minutes
setInterval(() => {
    const now = Date.now()
    for (const [key, value] of tempFiles.entries()) {
        if (value.expiresAt < now) {
            tempFiles.delete(key)
        }
    }
}, 5 * 60 * 1000)

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const metadata = formData.get('metadata') as string
        const userId = formData.get('userId') as string

        if (!file || !userId) {
            return NextResponse.json({ error: 'File and userId required' }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())

        // Store file with 1 hour expiration
        tempFiles.set(userId, {
            file: buffer,
            metadata: metadata ? JSON.parse(metadata) : {},
            expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
        })

        return NextResponse.json({ success: true, userId })
    } catch (error) {
        console.error('Error storing temp file:', error)
        return NextResponse.json({ error: 'Failed to store file' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get('userId')

        if (!userId) {
            return NextResponse.json({ error: 'userId required' }, { status: 400 })
        }

        const tempFile = tempFiles.get(userId)

        if (!tempFile) {
            return NextResponse.json({ error: 'File not found or expired' }, { status: 404 })
        }

        // Check if expired
        if (tempFile.expiresAt < Date.now()) {
            tempFiles.delete(userId)
            return NextResponse.json({ error: 'File expired' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            file: tempFile.file.toString('base64'),
            metadata: tempFile.metadata
        })
    } catch (error) {
        console.error('Error retrieving temp file:', error)
        return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get('userId')

        if (!userId) {
            return NextResponse.json({ error: 'userId required' }, { status: 400 })
        }

        tempFiles.delete(userId)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting temp file:', error)
        return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
    }
}
