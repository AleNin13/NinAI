import { Ollama } from 'ollama';

const ollama = new Ollama({
  host: process.env.OLLAMA_URL || 'http://localhost:11434',
});

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await ollama.embeddings({
      model: process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text',
      prompt: text,
    });
    return response.embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings = await Promise.all(
    texts.map(text => generateEmbedding(text))
  );
  return embeddings;
}

export async function* streamChat(
  prompt: string,
  context: string = ''
): AsyncGenerator<string, void, unknown> {
  const fullPrompt = context
    ? `Context information is below:\n${context}\n\nQuestion: ${prompt}\n\nAnswer based on the context provided. Include relevant citations.`
    : prompt;

  try {
    const stream = await ollama.chat({
      model: process.env.OLLAMA_MODEL || 'llama3.2',
      messages: [{ role: 'user', content: fullPrompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      if (chunk.message?.content) {
        yield chunk.message.content;
      }
    }
  } catch (error) {
    console.error('Error streaming chat:', error);
    throw error;
  }
}
