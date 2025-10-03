# Quick Start Guide

Get NinAI up and running in 5 minutes!

## Prerequisites Installation

### 1. Install Ollama

**macOS/Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:**
Download from [https://ollama.com/download](https://ollama.com/download)

### 2. Download Required Models

```bash
# Download the chat model (3.2GB)
ollama pull llama3.2

# Download the embedding model (274MB)
ollama pull nomic-embed-text
```

### 3. Install ChromaDB

**Using pip (recommended):**
```bash
pip install chromadb
```

**Using Docker:**
```bash
docker pull chromadb/chroma
```

## Project Setup

### 1. Clone and Install

```bash
git clone https://github.com/AleNin13/NinAI.git
cd NinAI
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

The default configuration works out of the box:
```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
CHROMADB_URL=http://localhost:8000
```

### 3. Start Services

**Terminal 1 - Ollama:**
```bash
# Usually starts automatically after installation
# If not, run:
ollama serve
```

**Terminal 2 - ChromaDB:**
```bash
# Using pip installation:
chroma run --path ./chroma_data

# OR using Docker:
docker run -p 8000:8000 chromadb/chroma
```

**Terminal 3 - Next.js App:**
```bash
npm run dev
```

### 4. Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## First Steps

1. **Upload a PDF**: Click "📄 Upload PDF Document" and select a PDF file
2. **Wait for Processing**: The system will extract, chunk, and index your document
3. **Ask Questions**: Type your question and press Enter
4. **View Sources**: See which parts of the document were used to generate the answer

## Example Questions

After uploading a document, try questions like:
- "Summarize this document"
- "What are the main topics covered?"
- "Tell me about [specific topic]"
- "What does it say about [specific term]?"

## Troubleshooting

### "Failed to upload file"
- Ensure ChromaDB is running on port 8000
- Check that Ollama is running with the embedding model

### "Error processing request"
- Verify Ollama is running with the chat model
- Check browser console for detailed error messages

### Slow Responses
- First response is slower (loading model into memory)
- Subsequent responses will be faster
- Consider using a smaller model like `phi3` for faster responses

## Alternative Models

### Faster but Less Accurate
```env
OLLAMA_MODEL=phi3
```

### More Accurate but Slower
```env
OLLAMA_MODEL=llama3.1:70b
```

### Better Embeddings (larger)
```env
OLLAMA_EMBEDDING_MODEL=mxbai-embed-large
```

## Production Deployment

For production use:

1. Build the application:
   ```bash
   npm run build
   npm start
   ```

2. Use production-ready ChromaDB deployment

3. Consider hosting Ollama on a dedicated GPU server

4. Set up proper environment variables for your hosting platform

## Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review the [GitHub Issues](https://github.com/AleNin13/NinAI/issues)
- Look at the code in `app/api/` for API implementation details
