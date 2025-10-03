# NinAI

AI chat system that allows users to ask questions and receive document-based answers with citations from sources.

## Features

- 📄 **PDF Upload & Processing**: Upload PDF documents with automatic text extraction and chunking
- 🤖 **AI-Powered Chat**: Ask questions and get intelligent responses based on your documents
- 🔍 **Source Citations**: Every answer includes citations showing which parts of the documents were used
- ⚡ **Streaming Responses**: Real-time streaming of AI responses for a smooth user experience
- 🎨 **Modern UI**: Clean, ChatGPT-style interface built with Next.js and Tailwind CSS

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React** - UI components

### Backend
- **LangChain** - Framework for building LLM applications
- **Ollama** - Local LLM inference and embeddings
- **ChromaDB** - Vector database for document storage and retrieval
- **PDF-Parse** - PDF text extraction

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (v18 or later)
2. **Ollama** - [Install Ollama](https://ollama.ai/)
3. **ChromaDB** - Install via pip or Docker

### Install Ollama Models

After installing Ollama, pull the required models:

```bash
# Pull the chat model (choose one)
ollama pull llama3.2

# Pull the embedding model
ollama pull nomic-embed-text
```

### Install ChromaDB

```bash
# Using pip
pip install chromadb

# Or using Docker
docker pull chromadb/chroma
docker run -p 8000:8000 chromadb/chroma
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AleNin13/NinAI.git
   cd NinAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:
   ```env
   OLLAMA_URL=http://localhost:11434
   OLLAMA_MODEL=llama3.2
   OLLAMA_EMBEDDING_MODEL=nomic-embed-text
   CHROMADB_URL=http://localhost:8000
   ```

4. **Start ChromaDB** (if not using Docker)
   ```bash
   chroma run --path ./chroma_data
   ```

5. **Start Ollama** (usually runs as a service after installation)
   ```bash
   ollama serve
   ```

## Usage

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Upload a PDF**
   - Click the "📄 Upload PDF Document" button
   - Select a PDF file from your computer
   - Wait for the file to be processed and indexed

4. **Ask questions**
   - Type your question in the chat input
   - Press Enter or click "Send"
   - The AI will respond with answers based on your uploaded documents
   - View source citations below each answer

## Project Structure

```
NinAI/
├── app/
│   ├── api/
│   │   ├── chat/          # Chat API endpoint with streaming
│   │   └── upload/        # PDF upload and processing endpoint
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main chat page
├── components/
│   ├── ChatInput.tsx      # Message input component
│   ├── ChatMessage.tsx    # Message display component
│   └── FileUpload.tsx     # PDF upload component
├── lib/
│   ├── chromadb.ts        # ChromaDB client and operations
│   ├── ollama.ts          # Ollama integration
│   └── pdfProcessor.ts    # PDF parsing and chunking
├── public/                # Static assets
├── .env.example           # Environment variables template
├── next.config.mjs        # Next.js configuration
├── package.json           # Dependencies
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## How It Works

1. **PDF Upload**
   - User uploads a PDF file
   - Server extracts text using pdf-parse
   - Text is split into overlapping chunks (1000 chars, 200 overlap)
   - Each chunk is embedded using Ollama's embedding model
   - Chunks and embeddings are stored in ChromaDB

2. **Question Answering**
   - User asks a question
   - Question is embedded using Ollama
   - ChromaDB finds the most relevant document chunks (similarity search)
   - Relevant chunks are used as context for the LLM
   - Ollama generates a streaming response
   - Sources are extracted and displayed with the answer

## Configuration Options

### Ollama Models

You can use different models by changing the environment variables:

- **Chat Models**: `llama3.2`, `llama3.1`, `mistral`, `phi3`, etc.
- **Embedding Models**: `nomic-embed-text`, `mxbai-embed-large`, etc.

### Chunk Settings

Modify chunk size and overlap in `lib/pdfProcessor.ts`:

```typescript
export function chunkText(
  text: string,
  chunkSize: number = 1000,    // Characters per chunk
  overlap: number = 200         // Overlap between chunks
)
```

### Retrieval Settings

Adjust the number of documents retrieved in `app/api/chat/route.ts`:

```typescript
const results = await queryDocuments(queryEmbedding, 4); // Number of chunks
```

## Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Troubleshooting

### Ollama Connection Issues
- Make sure Ollama is running: `ollama serve`
- Check if models are downloaded: `ollama list`
- Verify the OLLAMA_URL in your .env file

### ChromaDB Connection Issues
- Ensure ChromaDB is running on the correct port
- Check the CHROMADB_URL in your .env file
- Try restarting ChromaDB

### PDF Upload Fails
- Make sure the file is a valid PDF
- Check file size (large PDFs may take longer)
- Look at server logs for specific errors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Ollama](https://ollama.ai/)
- [LangChain](https://www.langchain.com/)
- [ChromaDB](https://www.trychroma.com/)
- [Tailwind CSS](https://tailwindcss.com/)

