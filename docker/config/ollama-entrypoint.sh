#!/bin/bash
set -e

echo "Starting Ollama initialization..."

# Start Ollama service in the background
/bin/ollama serve &
OLLAMA_PID=$!

# Wait for Ollama to be ready
echo "Waiting for Ollama service to start..."
sleep 5

# Function to check if a model exists
model_exists() {
    ollama list | grep -q "$1"
}

# Function to extract model names from JSON
get_models_from_config() {
    # Use jq if available, otherwise fallback to grep/sed
    if command -v jq &> /dev/null; then
        jq -r '.models[].name' /config/models.json
    else
        # Fallback: extract model names using grep and sed
        grep -o '"name": "[^"]*"' /config/models.json | sed 's/"name": "\(.*\)"/\1/'
    fi
}

# Function to get model info
get_model_info() {
    local model_name="$1"
    if command -v jq &> /dev/null; then
        local desc=$(jq -r ".models[] | select(.name == \"$model_name\") | .description" /config/models.json)
        local size=$(jq -r ".models[] | select(.name == \"$model_name\") | .size" /config/models.json)
        echo "$desc ($size)"
    else
        echo "model"
    fi
}

# Read models from configuration file
echo "Reading model configuration..."
MODELS=$(get_models_from_config)

if [ -z "$MODELS" ]; then
    echo "❌ No models found in configuration file"
    exit 1
fi

echo "Found models to check/install:"
echo "$MODELS" | while read -r model; do
    if [ -n "$model" ]; then
        info=$(get_model_info "$model")
        echo "  - $model: $info"
    fi
done

# Download models if not present
echo ""
echo "Checking and downloading models..."

echo "$MODELS" | while read -r model; do
    if [ -n "$model" ]; then
        if model_exists "$model"; then
            echo "✓ $model model already exists"
        else
            info=$(get_model_info "$model")
            echo "⬇️ Downloading $model model ($info)..."
            if ollama pull "$model"; then
                echo "✓ $model downloaded successfully"
            else
                echo "❌ Failed to download $model"
                exit 1
            fi
        fi
    fi
done

echo ""
echo "======================================"
echo "✅ All models ready!"
echo "✅ Ollama is running on port 11434"
echo "======================================"

# Keep Ollama running in foreground
wait $OLLAMA_PID
