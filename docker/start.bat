@echo off
echo Starting NinAI Docker services...
echo.

cd ..
echo Building and starting services...
docker-compose up -d --build
echo.

echo Waiting for services to initialize...
timeout /t 5 /nobreak > nul

echo.
echo Checking Ollama service status...
docker-compose logs --tail=10 ollama

echo.
echo Services should be ready! Check logs with: docker-compose logs -f ollama
echo Access the app at: http://localhost:3000
echo.

pause