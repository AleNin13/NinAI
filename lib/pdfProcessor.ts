import pdf from 'pdf-parse';

export async function parsePDF(buffer: Buffer): Promise<{ text: string; numPages: number }> {
  try {
    const data = await pdf(buffer);
    return {
      text: data.text,
      numPages: data.numpages,
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
}

export function chunkText(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
): string[] {
  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    const chunk = text.slice(startIndex, endIndex);
    chunks.push(chunk);
    
    // Move forward by (chunkSize - overlap) to create overlapping chunks
    startIndex += chunkSize - overlap;
    
    // Avoid creating tiny chunks at the end
    if (text.length - startIndex < overlap) {
      break;
    }
  }

  return chunks;
}

export function extractPageNumber(text: string, fullText: string): number {
  // Simple heuristic: estimate page based on position in document
  const position = fullText.indexOf(text);
  const charsPerPage = fullText.length / 10; // Rough estimate
  return Math.max(1, Math.floor(position / charsPerPage) + 1);
}
