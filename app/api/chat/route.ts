import { NextRequest } from 'next/server';
import { generateEmbedding, streamChat } from '@/lib/ollama';
import { queryDocuments } from '@/lib/chromadb';

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return new Response(
        encoder.encode('data: ' + JSON.stringify({ error: 'Invalid message' }) + '\n\n'),
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        }
      );
    }

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(message);

    // Query ChromaDB for relevant documents
    const results = await queryDocuments(queryEmbedding, 4);

    // Prepare context from retrieved documents
    let context = '';
    const sources: Array<{ page: number; content: string }> = [];

    if (results.documents && results.documents[0]) {
      const docs = results.documents[0];
      const metadatas = results.metadatas?.[0] || [];

      docs.forEach((doc, idx) => {
        if (doc) {
          context += `\n---\nDocument ${idx + 1}:\n${doc}\n`;
          const metadata = metadatas[idx];
          const chunkIndex = typeof metadata?.chunk_index === 'number' ? metadata.chunk_index : 0;
          sources.push({
            page: Math.floor(chunkIndex / 3) + 1,
            content: doc.substring(0, 200) + (doc.length > 200 ? '...' : ''),
          });
        }
      });
    }

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = '';

          // Stream the chat response
          for await (const chunk of streamChat(message, context)) {
            fullResponse += chunk;
            const data = JSON.stringify({ content: chunk });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          // Send sources at the end
          if (sources.length > 0) {
            const sourcesData = JSON.stringify({ sources });
            controller.enqueue(encoder.encode(`data: ${sourcesData}\n\n`));
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          const errorData = JSON.stringify({ 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    const errorData = JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to process request' 
    });
    return new Response(
      encoder.encode(`data: ${errorData}\n\n`),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    );
  }
}
