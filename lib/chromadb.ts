// ...existing code...

import { ChromaClient } from 'chromadb';

// Assuming these are imported or defined elsewhere (e.g., from environment variables)
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text';

// Custom embedding function using Ollama
const embeddingFunction = {
  generate: async (texts: string[]): Promise<number[][]> => {
    const embeddings: number[][] = [];
    for (const text of texts) {
      try {
        const response = await fetch(`${OLLAMA_URL}/api/embeddings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: OLLAMA_EMBEDDING_MODEL,
            prompt: text,
          }),
        });
        if (!response.ok) {
          throw new Error(`Ollama API error: ${response.statusText}`);
        }
        const data = await response.json();
        embeddings.push(data.embedding); // Assuming data.embedding is an array of numbers
      } catch (error) {
        console.error(`Error generating embedding for text: ${text}`, error);
        throw error;
      }
    }
    return embeddings;
  },
};

// Initialize ChromaDB client
const chromaUrl = new URL(process.env.CHROMADB_URL || 'http://localhost:8000');
const chromaClient = new ChromaClient({
  host: chromaUrl.hostname,
  port: parseInt(chromaUrl.port) || 8000,
  ssl: chromaUrl.protocol === 'https:',
});

export async function getOrCreateCollection(name: string) {
  try {
    return await chromaClient.getOrCreateCollection({
      name,
      metadata: { 'hnsw:space': 'cosine' },
      embeddingFunction, // Add this to use the custom Ollama-based embedding function
    });
  } catch (error) {
    console.error('Error getting/creating collection:', error);
    throw error;
  }
}

// ...existing code...

// ...existing code...

export async function addDocuments(
  documents: string[],
  embeddings: number[][],
  metadatas: any[],
  ids: string[]
) {
  const collection = await getOrCreateCollection('documents');
  
  await collection.add({
    documents,
    embeddings,
    metadatas,
    ids,
  });
}

export async function queryDocuments(
  queryEmbedding: number[],
  nResults: number = 4
) {
  const collection = await getOrCreateCollection('documents');
  
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults,
  });
  
  return results;
}
