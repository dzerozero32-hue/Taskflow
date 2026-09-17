from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers.tasks import router as tasks_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(tasks_router)