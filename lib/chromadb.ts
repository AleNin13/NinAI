import { ChromaClient } from 'chromadb';

let client: ChromaClient | null = null;

export async function getChromaClient() {
  if (!client) {
    client = new ChromaClient({
      path: process.env.CHROMADB_URL || 'http://localhost:8000',
    });
  }
  return client;
}

export async function getOrCreateCollection(name: string = 'documents') {
  const client = await getChromaClient();
  
  try {
    return await client.getOrCreateCollection({
      name,
      metadata: { 'hnsw:space': 'cosine' },
    });
  } catch (error) {
    console.error('Error getting/creating collection:', error);
    throw error;
  }
}

export async function addDocuments(
  documents: string[],
  embeddings: number[][],
  metadatas: any[],
  ids: string[]
) {
  const collection = await getOrCreateCollection();
  
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
  const collection = await getOrCreateCollection();
  
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults,
  });
  
  return results;
}
