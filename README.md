# NinAI

AI chat system that allows users to ask questions and receive document-based answers with citations from sources.

## 📚 Documentation

All documentation has been moved to the [`docs/`](./docs/) folder for better organization:

- **[📖 Main Documentation](./docs/README.md)** - Complete setup and usage guide
- **[🚀 Quick Start](./docs/QUICKSTART.md)** - 5-minute getting started guide
- **[⚙️ Features](./docs/FEATURES.md)** - Technical specifications
- **[🔌 API Reference](./docs/API.md)** - API documentation

## 🏃‍♂️ Quick Start

The fastest way to get started:

```bash
# Install dependencies
npm install

# Start all services (Docker required)
docker-compose up -d --build

# Start the application
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
NinAI/
├── app/                    # Next.js application
├── components/             # React components
├── lib/                    # Utility libraries
├── docs/                   # 📚 Documentation
├── docker/                 # Docker configuration
├── docker-compose.yml      # Services configuration
└── package.json            # Dependencies
```

## 🤝 Contributing

1. Check the [documentation](./docs/) for setup instructions
2. Follow the existing code style
3. Add tests for new features
4. Update documentation as needed

## 📄 License

See [LICENSE](./LICENSE) file for details.