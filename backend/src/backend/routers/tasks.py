from fastapi import APIRouter, HTTPException
from sqlalchemy import select

from backend.database import SessionLocal
from backend.models import Task
from backend.schemas import TaskCreate, TaskUpdate


router = APIRouter()


@router.post("/tasks")
def create_task(data: TaskCreate):
    with SessionLocal() as session:
        task = Task(title=data.title, description=data.description)

        session.add(task)
        session.commit()
        session.refresh(task)

        return task


@router.get("/tasks")
def get_tasks():
    with SessionLocal() as session:
        statement = select(Task)
        result = session.execute(statement)
        tasks = result.scalars().all()

        return tasks


@router.patch("/tasks/{task_id}")
def update_task(task_id: int, data: TaskUpdate):
    with SessionLocal() as session:
        task = session.get(Task, task_id)

        if task is None:
            raise HTTPException(
                status_code=404,
                detail="Task not found",
            )

        if data.title is not None:
            task.title = data.title

        if data.description is not None:
            task.description = data.description

        if data.completed is not None:
            task.completed = data.completed

        session.commit()
        session.refresh(task)

        return task


@router.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    with SessionLocal() as session:
        task = session.get(Task, task_id)

        if task is None:
            raise HTTPException(
                status_code=404,
                detail="Task not found",
            )

        session.delete(task)
        session.commit()

        return {"message": "Task deleted"}