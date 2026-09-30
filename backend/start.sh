#!/bin/bash
# Edu-Mentee Backend Startup Script

echo "=== Edu-Mentee Backend ==="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "[!] No .env file found. Copying from .env.example..."
    cp .env.example .env
    echo "[!] Please update .env with your database credentials."
fi

# Install dependencies
echo "[*] Installing dependencies..."
pip install -r requirements.txt

# Run migrations
echo "[*] Running database migrations..."
alembic upgrade head 2>/dev/null || echo "[!] Migrations skipped (may need initial setup)"

# Seed data
echo "[*] Seeding demo data..."
python seed/seed_data.py

# Start server
echo ""
echo "[*] Starting server on http://0.0.0.0:8000"
echo "[*] API Docs: http://localhost:8000/api/docs"
echo ""
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
