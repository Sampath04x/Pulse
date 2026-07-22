import uvicorn
import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, SessionLocal
from app.seed.seed_data import seed_db
from app.api import auth, companies, employees, managers, evaluations, hr

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("main")

# Auto-seed trigger if database isn't initialized or file doesn't exist
db_file = settings.DATABASE_URL.replace("sqlite:///", "")
if not os.path.exists(db_file) or os.path.getsize(db_file) == 0:
    logger.info("Database file empty or not found. Running seed script...")
    db = SessionLocal()
    try:
        seed_db(db)
    except Exception as e:
        logger.error(f"Seed script failed: {e}")
    finally:
        db.close()

app = FastAPI(
    title="Pulse REST API",
    description="Backend API supporting Pulse Continuous Growth conversations platform.",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(companies.router, prefix="/api")
app.include_router(employees.router, prefix="/api")
app.include_router(managers.router, prefix="/api")
app.include_router(evaluations.router, prefix="/api")
app.include_router(hr.router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
