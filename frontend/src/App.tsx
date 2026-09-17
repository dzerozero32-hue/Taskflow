import { useEffect, useState } from 'react'

type Task = {
  id: number
  title: string
  completed: boolean
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  // GET
  useEffect(() => {
    async function loadTasks() {
      const response = await fetch('http://127.0.0.1:8000/tasks')
      const data: Task[] = await response.json()

      setTasks(data)
    }

    loadTasks()
  }, [])

  // POST
  async function createTask() {
    if (!title.trim()) {
      return
    }

    const response = await fetch('http://127.0.0.1:8000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
      }),
    })

    const newTask: Task = await response.json()

    setTasks([...tasks, newTask])
    setTitle('')
  }

  // PATCH completed
  async function toggleTask(task: Task) {
    const response = await fetch(
      `http://127.0.0.1:8000/tasks/${task.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      },
    )

    const updatedTask: Task = await response.json()

    setTasks(
      tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    )
  }

  // DELETE
  async function deleteTask(id: number) {
    await fetch(`http://127.0.0.1:8000/tasks/${id}`, {
      method: 'DELETE',
    })

    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Начать редактирование
  function startEditing(task: Task) {
    setEditingId(task.id)
    setEditingTitle(task.title)
  }

  // PATCH title
  async function saveTask(id: number) {
    if (!editingTitle.trim()) {
      return
    }

    const response = await fetch(
      `http://127.0.0.1:8000/tasks/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingTitle,
        }),
      },
    )

    const updatedTask: Task = await response.json()

    setTasks(
      tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    )

    setEditingId(null)
    setEditingTitle('')
  }

  return (
    <main>
      <h1>Taskflow</h1>

      <div>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="New task"
        />

        <button onClick={createTask}>
          Add task
        </button>
      </div>

      {tasks.map((task) => (
        <div key={task.id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task)}
          />

          {editingId === task.id ? (
            <>
              <input
                type="text"
                value={editingTitle}
                onChange={(event) =>
                  setEditingTitle(event.target.value)
                }
              />

              <button onClick={() => saveTask(task.id)}>
                Save
              </button>
            </>
          ) : (
            <>
              <strong>{task.title}</strong>

              <button onClick={() => startEditing(task)}>
                Edit
              </button>
            </>
          )}

          <button onClick={() => deleteTask(task.id)}>
            Delete
          </button>
        </div>
      ))}
    </main>
  )
}

export default App