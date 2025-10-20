# Features & Technical Specifications

## Core Features

### 📄 PDF Document Management
- **Upload**: Drag-and-drop or click to upload PDF files
- **Parsing**: Automatic text extraction from PDF documents
- **Chunking**: Intelligent text splitting with overlap for context preservation
  - Default: 1000 characters per chunk
  - Overlap: 200 characters between chunks
- **Metadata**: Tracks source file, chunk index, page numbers, and timestamps

### 🤖 AI-Powered Chat
- **Conversational Interface**: ChatGPT-style UI for natural interactions
- **Streaming Responses**: Real-time token-by-token response rendering
- **Context-Aware**: Uses RAG (Retrieval Augmented Generation) for accurate answers
- **Source Citations**: Every answer includes references to source documents

### 🔍 Semantic Search
- **Vector Embeddings**: Documents converted to embeddings using Ollama
- **Similarity Search**: ChromaDB finds relevant content based on semantic meaning
- **Top-K Retrieval**: Configurable number of relevant chunks (default: 4)
- **Cosine Similarity**: Measures relevance between query and documents

### 💬 User Interface
- **Modern Design**: Clean, professional ChatGPT-inspired interface
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatic theme detection
- **Message History**: Conversation preserved during session
- **Upload Feedback**: Visual confirmation of successful document processing

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **UI Library**: Custom React components
- **State Management**: React Hooks (useState, useEffect)

### Backend Stack
- **Runtime**: Node.js
- **API Routes**: Next.js API Routes (serverless functions)
- **LLM Framework**: LangChain
- **Language Model**: Ollama (llama3.2 by default)
- **Embeddings**: Ollama (nomic-embed-text)
- **Vector Database**: ChromaDB
- **PDF Processing**: pdf-parse

### API Endpoints

#### POST /api/upload
Handles PDF file uploads and processing
- Accepts: multipart/form-data with PDF file
- Returns: Processing status and metadata
- Process:
  1. Validates PDF file
  2. Extracts text content
  3. Chunks text with overlap
  4. Generates embeddings
  5. Stores in ChromaDB

#### POST /api/chat
Handles chat queries with streaming responses
- Accepts: JSON with message string
- Returns: Server-Sent Events (SSE) stream
- Process:
  1. Generates query embedding
  2. Retrieves relevant documents from ChromaDB
  3. Constructs prompt with context
  4. Streams LLM response
  5. Returns source citations

### Data Flow

```
User Upload PDF
    ↓
Extract Text (pdf-parse)
    ↓
Chunk Text (1000 chars, 200 overlap)
    ↓
Generate Embeddings (Ollama)
    ↓
Store in Vector DB (ChromaDB)
    ↓
Ready for Queries

User Asks Question
    ↓
Generate Query Embedding (Ollama)
    ↓
Search Similar Chunks (ChromaDB)
    ↓
Build Context from Top Results
    ↓
Generate Response (Ollama + LangChain)
    ↓
Stream to User with Sources
```

## Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `llama3.2` | Chat model name |
| `OLLAMA_EMBEDDING_MODEL` | `nomic-embed-text` | Embedding model name |
| `CHROMADB_URL` | `http://localhost:8000` | ChromaDB server URL |

### Customization Points

#### Chunk Size
Modify in `lib/pdfProcessor.ts`:
```typescript
chunkText(text, 1000, 200) // size, overlap
```

#### Retrieval Count
Modify in `app/api/chat/route.ts`:
```typescript
queryDocuments(queryEmbedding, 4) // number of chunks
```

#### Ollama Models
Any model available in Ollama can be used:
- Chat: llama3.2, llama3.1, mistral, phi3, gemma, etc.
- Embeddings: nomic-embed-text, mxbai-embed-large, etc.

## Performance Characteristics

### Upload Processing
- Small PDF (<10 pages): 5-10 seconds
- Medium PDF (10-50 pages): 10-30 seconds
- Large PDF (50+ pages): 30-60+ seconds

Factors:
- PDF size and complexity
- Text extraction time
- Embedding generation (depends on chunk count)
- Network latency to ChromaDB/Ollama

### Query Response
- First query: 5-15 seconds (model loading)
- Subsequent queries: 2-5 seconds
- Streaming starts: < 1 second

Factors:
- Model size (larger = slower but more accurate)
- Context size (more chunks = slower)
- Hardware (GPU significantly faster)

### Resource Usage
- RAM: ~2-4GB for llama3.2 model
- Storage: ~3GB for models + ChromaDB data
- CPU: Moderate (high during embedding generation)
- GPU: Optional but highly recommended

## Security Considerations

### Current Implementation
- Files processed in memory (not saved to disk)
- No user authentication
- Local execution only
- No data encryption at rest

### Production Recommendations
1. Add user authentication (NextAuth.js)
2. Implement file size limits
3. Add rate limiting
4. Use HTTPS in production
5. Encrypt ChromaDB data
6. Add input sanitization
7. Implement access control per document
8. Use secure environment variables

## Scalability

### Current Limitations
- Single-user session storage
- In-memory file processing
- Single ChromaDB instance
- No load balancing

### Scaling Recommendations
1. Add persistent user sessions (Redis)
2. Use object storage for PDFs (S3)
3. Deploy ChromaDB cluster
4. Use Ollama server pool
5. Add caching layer
6. Implement document versioning
7. Add background job processing
8. Use CDN for static assets

## Browser Compatibility

- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support
- **Mobile**: ✅ Responsive design

Minimum versions:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

### Planned Features
- [ ] Multi-document conversations
- [ ] Document management dashboard
- [ ] Search within documents
- [ ] Export chat history
- [ ] Custom prompt templates
- [ ] Multiple LLM support
- [ ] Collaborative features
- [ ] Analytics dashboard

### Possible Integrations
- Authentication providers (OAuth, SAML)
- Cloud storage (Google Drive, Dropbox)
- Document formats (Word, Excel, PowerPoint)
- Image processing (OCR)
- Speech-to-text
- Text-to-speech
- Email notifications
- Slack/Teams integration

## License

ISC - See LICENSE file for details
