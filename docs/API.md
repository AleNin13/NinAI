# API Documentation

## Overview

NinAI provides two main API endpoints for document processing and chat functionality.

Base URL (development): `http://localhost:3000`

## Endpoints

### Upload PDF Document

Upload and process a PDF document for querying.

**Endpoint:** `POST /api/upload`

**Content-Type:** `multipart/form-data`

**Request Body:**
```
file: <PDF file>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "PDF processed successfully",
  "chunks": 45,
  "pages": 12
}
```

**Error Response (400):**
```json
{
  "error": "No file provided"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to process PDF"
}
```

**Example (cURL):**
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@document.pdf"
```

**Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append('file', pdfFile);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
console.log(data);
```

---

### Chat Query

Send a chat message and receive a streaming response with sources.

**Endpoint:** `POST /api/chat`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "message": "What is this document about?"
}
```

**Response Type:** `text/event-stream` (Server-Sent Events)

**Response Format:**

The response is streamed in chunks using Server-Sent Events (SSE). Each chunk has the format:
```
data: <JSON>\n\n
```

**Content Chunk:**
```
data: {"content":"This is "}
data: {"content":"a response "}
data: {"content":"chunk"}
```

**Source Chunk (sent at end):**
```
data: {"sources":[{"page":1,"content":"Relevant text..."}]}
```

**End Signal:**
```
data: [DONE]
```

**Error Response:**
```
data: {"error":"Failed to process request"}
```

**Example (cURL):**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Summarize this document"}' \
  --no-buffer
```

**Example (JavaScript - Fetch API):**
```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    message: 'What are the main points?' 
  }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      if (data === '[DONE]') {
        console.log('Stream complete');
        continue;
      }
      
      const parsed = JSON.parse(data);
      if (parsed.content) {
        console.log('Content:', parsed.content);
      }
      if (parsed.sources) {
        console.log('Sources:', parsed.sources);
      }
    }
  }
}
```

**Example (JavaScript - EventSource - Not Working for POST):**
Note: EventSource only supports GET requests. For POST with SSE, use fetch with ReadableStream as shown above.

---

## Response Objects

### Upload Response

```typescript
interface UploadResponse {
  success: boolean;
  message: string;
  chunks: number;    // Number of text chunks created
  pages: number;     // Number of pages in PDF
}
```

### Chat Response (Streaming)

**Content Chunk:**
```typescript
interface ContentChunk {
  content: string;   // Partial text content
}
```

**Sources Chunk:**
```typescript
interface SourcesChunk {
  sources: Source[];
}

interface Source {
  page: number;      // Page number in document
  content: string;   // Excerpt from source
}
```

**Error Chunk:**
```typescript
interface ErrorChunk {
  error: string;     // Error message
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request (invalid input) |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider adding rate limiting middleware.

---

## Authentication

Currently, no authentication is required. For production use, implement authentication using NextAuth.js or similar.

---

## Usage Examples

### Complete Upload and Query Flow

```javascript
async function processDocumentAndQuery(pdfFile, question) {
  // Step 1: Upload PDF
  const formData = new FormData();
  formData.append('file', pdfFile);
  
  const uploadResponse = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  const uploadData = await uploadResponse.json();
  console.log(`Processed ${uploadData.chunks} chunks from ${uploadData.pages} pages`);
  
  // Step 2: Wait a moment for indexing to complete
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Step 3: Query the document
  const chatResponse = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: question }),
  });
  
  // Step 4: Process streaming response
  const reader = chatResponse.body.getReader();
  const decoder = new TextDecoder();
  let fullResponse = '';
  let sources = [];
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        
        try {
          const parsed = JSON.parse(data);
          if (parsed.content) {
            fullResponse += parsed.content;
          }
          if (parsed.sources) {
            sources = parsed.sources;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }
  
  return { response: fullResponse, sources };
}

// Usage
const result = await processDocumentAndQuery(
  myPdfFile, 
  'What are the main topics?'
);
console.log('Answer:', result.response);
console.log('Sources:', result.sources);
```

---

## WebSocket Alternative

This implementation uses Server-Sent Events (SSE) for streaming. If you prefer WebSockets, you would need to modify the implementation to use `socket.io` or native WebSockets.

---

## Testing

### Test Upload Endpoint
```bash
# With a sample PDF
curl -X POST http://localhost:3000/api/upload \
  -F "file=@sample.pdf" \
  | jq .
```

### Test Chat Endpoint
```bash
# Simple query
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}' \
  --no-buffer
```

---

## Performance Tips

1. **Chunk Size**: Larger chunks mean fewer requests but potentially less relevant results
2. **Retrieval Count**: More chunks provide better context but slower responses
3. **Model Selection**: Smaller models (phi3) are faster, larger models (llama3.1:70b) are more accurate
4. **Caching**: Consider caching embeddings for frequently asked questions

---

## Troubleshooting

### Upload Fails
- Check file is valid PDF
- Verify file size is reasonable (< 100MB recommended)
- Ensure ChromaDB is running
- Check Ollama embedding model is available

### Chat Returns Empty Response
- Verify at least one document has been uploaded
- Check Ollama chat model is running
- Ensure ChromaDB contains indexed documents

### Streaming Stops Midway
- Check Ollama service is stable
- Verify network connection
- Look for errors in server logs

---

## Related Documentation

- [README.md](./README.md) - Main documentation
- [QUICKSTART.md](./QUICKSTART.md) - Getting started guide
- [FEATURES.md](./FEATURES.md) - Technical specifications
