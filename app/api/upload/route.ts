import { NextRequest, NextResponse } from 'next/server';
import { parsePDF, chunkText } from '@/lib/pdfProcessor';
import { generateEmbeddings } from '@/lib/ollama';
import { addDocuments } from '@/lib/chromadb';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const { text, numPages } = await parsePDF(buffer);

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF' },
        { status: 400 }
      );
    }

    // Chunk the text
    const chunks = chunkText(text);

    if (chunks.length === 0) {
      return NextResponse.json(
        { error: 'No content to process' },
        { status: 400 }
      );
    }

    // Generate embeddings for each chunk
    const embeddings = await generateEmbeddings(chunks);

    // Prepare metadata and IDs
    const timestamp = Date.now();
    const metadatas = chunks.map((chunk, idx) => ({
      source: file.name,
      chunk_index: idx,
      total_chunks: chunks.length,
      num_pages: numPages,
      timestamp,
    }));

    const ids = chunks.map((_, idx) => `${file.name}-${timestamp}-${idx}`);

    // Store in ChromaDB
    await addDocuments(chunks, embeddings, metadatas, ids);

    return NextResponse.json({
      success: true,
      message: 'PDF processed successfully',
      chunks: chunks.length,
      pages: numPages,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process PDF' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
