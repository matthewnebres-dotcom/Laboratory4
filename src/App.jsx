
import { useEffect, useState } from 'react'
import {
  Routes,
  Route,
  NavLink,
  Link,
  useParams,
} from 'react-router-dom'
import axios from 'axios'
import useTaskStore from './store'

function Navigation() {
  return (
    <nav className="bg-white border-b p-4">
      <div className="max-w-5xl mx-auto flex gap-5 flex-wrap">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/groups">Groups</NavLink>
        <NavLink to="/guide">Guide</NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/developers">Developers</NavLink>
      </div>
    </nav>
  )
}

function Dashboard() {
  const groups = useTaskStore((state) => state.groups)
  const tasks = useTaskStore((state) => state.tasks)

  const completed = tasks.filter((task) => task.done).length
  const pending = tasks.length - completed

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Welcome to TaskFlow</h1>
      <p className="text-gray-600 mb-6">
        Manage your tasks and organize them into groups.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <p>Total Tasks</p>
          <h2 className="text-3xl font-bold">{tasks.length}</h2>
        </div>

        <div className="card">
          <p>Completed Tasks</p>
          <h2 className="text-3xl font-bold">{completed}</h2>
        </div>

        <div className="card">
          <p>Pending Tasks</p>
          <h2 className="text-3xl font-bold">{pending}</h2>
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="text-xl font-bold">Your Groups</h2>
        <p className="my-2">You have {groups.length} groups.</p>
        <Link to="/groups" className="text-t1 font-bold">
          Manage Groups
        </Link>
      </div>
    </main>
  )
}

function Groups() {
  const [name, setName] = useState('')
  const groups = useTaskStore((state) => state.groups)
  const addGroup = useTaskStore((state) => state.addGroup)

  function handleSubmit(e) {
    e.preventDefault()

    if (!name.trim()) return

    addGroup(name.trim())
    setName('')
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-5">Task Groups</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter group name"
          className="border rounded px-3 py-2 flex-1"
        />

        <button type="submit" className="primary-btn">
          Add Group
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((group) => (
          <div className="card" key={group.id}>
            <h2 className="font-bold text-xl mb-3">{group.name}</h2>
            <Link
              to={`/groups/${group.id}`}
              className="text-t1 font-bold"
            >
              View Tasks
            </Link>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <p className="text-gray-500">No groups created yet.</p>
      )}
    </main>
  )
}

function GroupDetails() {
  const { groupId } = useParams()
  const [title, setTitle] = useState('')

  const groups = useTaskStore((state) => state.groups)
  const tasks = useTaskStore((state) => state.tasks)
  const addTask = useTaskStore((state) => state.addTask)
  const toggleTask = useTaskStore((state) => state.toggleTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)

  const group = groups.find((item) => item.id === groupId)
  const groupTasks = tasks.filter((task) => task.groupId === groupId)

  function handleSubmit(e) {
    e.preventDefault()

    if (!title.trim()) return

    addTask(groupId, title.trim())
    setTitle('')
  }

  if (!group) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Group not found</h1>
        <Link to="/groups" className="text-t1">
          Back to Groups
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <Link to="/groups" className="text-t1">
        Back to Groups
      </Link>

      <h1 className="text-3xl font-bold my-5">{group.name}</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task"
          className="border rounded px-3 py-2 flex-1"
        />

        <button type="submit" className="primary-btn">
          Add Task
        </button>
      </form>

      <div className="space-y-3">
        {groupTasks.map((task) => (
          <div
            key={task.id}
            className="card flex flex-wrap items-center justify-between gap-3"
          >
            <span className={task.done ? 'line-through text-gray-400' : ''}>
              {task.title}
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                className="border rounded px-3 py-1"
              >
                {task.done ? 'Mark Not Done' : 'Mark Done'}
              </button>

              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                className="bg-red-600 text-white rounded px-3 py-1"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {groupTasks.length === 0 && (
        <p className="text-gray-500">No tasks in this group yet.</p>
      )}
    </main>
  )
}

function Guide() {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-5">User Guide</h1>

      <div className="card space-y-4">
        <section>
          <h2 className="font-bold">Groups</h2>
          <p>Create groups to organize your tasks.</p>
        </section>

        <section>
          <h2 className="font-bold">Tasks</h2>
          <p>Add tasks inside your selected group.</p>
        </section>

        <section>
          <h2 className="font-bold">Task Status</h2>
          <p>Mark tasks as Done or Not Done.</p>
        </section>

        <section>
          <h2 className="font-bold">Delete</h2>
          <p>Delete tasks you no longer need.</p>
        </section>

        <section>
          <h2 className="font-bold">React Router</h2>
          <p>Used to navigate between application pages.</p>
        </section>

        <section>
          <h2 className="font-bold">Zustand</h2>
          <p>Manages and shares task and group data between pages.</p>
        </section>

        <section>
          <h2 className="font-bold">Axios and DummyJSON</h2>
          <p>Axios retrieves sample user information from DummyJSON.</p>
        </section>
      </div>
    </main>
  )
}

function Users() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axios
      .get('https://dummyjson.com/users/1')
      .then((response) => {
        setUser(response.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Unable to load user information.')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        <p>Loading user information...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        <p className="text-red-600">{error}</p>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-5">User Information</h1>

      <div className="card flex flex-col sm:flex-row items-center gap-5">
        <img
          src={user.image}
          alt="User profile"
          className="w-24 h-24 rounded-full"
        />

        <div>
          <h2 className="text-xl font-bold">
            {user.firstName} {user.lastName}
          </h2>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  )
}

function Developers() {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-5">Developers</h1>

      <div className="card">
        <h2 className="text-xl font-bold">Matthew Nebres</h2>
        <p>Role: Student Developer</p>
        <p>Contribution: Designed and developed TaskFlow.</p>
      </div>
    </main>
  )
}

function App() {
  return (
    <>
      <Navigation />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:groupId" element={<GroupDetails />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/users" element={<Users />} />
        <Route path="/developers" element={<Developers />} />
      </Routes>
    </>
  )
}

export default App
