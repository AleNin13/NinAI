# Docker Configuration

This folder contains all Docker-related configuration files for the NinAI project.

## Folder Structure

```
docker/
├── Dockerfile.ollama       # Custom Ollama image with pre-installed models
├── .dockerignore          # Files to exclude from Docker build context
├── README.md              # This documentation file
├── start.bat              # Quick start script for Windows
└── config/
    ├── ollama-entrypoint.sh # Initialization script for Ollama models
    └── models.json          # Configuration file for models to download
```

**Note:** The main `docker-compose.yml` file is located in the project root directory.

## Files

### `docker-compose.yml`
Main Docker Compose configuration that defines two services:
- **chromadb**: Vector database service using ChromaDB
- **ollama**: AI model service with pre-installed models (llama3.2 and nomic-embed-text)

### `Dockerfile.ollama`
Custom Dockerfile for Ollama that:
- Extends the official Ollama image
- Includes an entrypoint script that automatically downloads required models
- Exposes port 11434 for API access

### `config/models.json`
JSON configuration file that defines which Ollama models to download and install automatically:
- **name**: The model name as recognized by Ollama
- **description**: Human-readable description of the model's purpose
- **size**: Approximate download size for user reference

## Model Configuration

You can customize which models are downloaded by editing `config/models.json`:

```json
{
  "models": [
    {
      "name": "llama3.2",
      "description": "Main chat model for conversations",
      "size": "~2GB"
    },
    {
      "name": "nomic-embed-text",
      "description": "Text embedding model for document processing",
      "size": "~274MB"
    }
  ]
}
```

### Adding New Models

To add a new model, simply add it to the `models` array:

```json
{
  "name": "codellama",
  "description": "Code generation model",
  "size": "~7GB"
}
```

### Available Models

Popular models you can add:
- `llama3.1:8b` - Balanced performance model
- `mistral` - Fast and efficient model
- `codellama` - Code generation specialist
- `llava` - Vision-language model

After modifying `models.json`, rebuild the Ollama container:

```bash
docker-compose up -d --build ollama
```

### `.dockerignore`
Docker ignore file that excludes unnecessary files from the build context to optimize build times.

## Quick Start

### Windows
Double-click `start.bat` or run:
```cmd
start.bat
```

### Linux/Mac
```bash
# Build and start all services
docker-compose up -d --build

# Monitor logs
docker-compose logs -f ollama
```

## Files

### ChromaDB
- **Port**: 8000
- **Volume**: `../chroma_data` (persistent storage for vectors)
- **Purpose**: Vector database for document embeddings

### Ollama
- **Port**: 11434
- **Volume**: `ollama_data` (persistent storage for models)
- **Models**: llama3.2 (chat), nomic-embed-text (embeddings)
- **Purpose**: Local AI inference for chat and embeddings

## GPU Support

To enable GPU acceleration for Ollama, uncomment the deploy section in `docker-compose.yml`:

```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: all
          capabilities: [gpu]
```

## Troubleshooting

### Models not downloading
```bash
# Check Ollama logs
docker-compose logs ollama

# Restart Ollama service
docker-compose restart ollama
```

### Port conflicts
If ports 8000 or 11434 are already in use, modify the port mappings in `docker-compose.yml`.

### Storage issues
Ensure the host has sufficient disk space (~4GB for models + document storage).