import { useEffect, useState } from 'react'
import {
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  useParams,
  useNavigate,
} from 'react-router-dom'
import axios from 'axios'
import useTaskStore from './store'

function Navigation() {
  const linkStyle = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? 'bg-red-700 text-white'
        : 'text-gray-700 hover:bg-red-50 hover:text-red-700'
    }`

  return (
    <nav className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap gap-2 items-center">
        <Link to="/" className="font-bold text-xl text-red-600 mr-auto">
          TaskMaster
        </Link>
        <NavLink to="/" end className={linkStyle}>Dashboard</NavLink>
        <NavLink to="/groups" className={linkStyle}>Groups</NavLink>
        <NavLink to="/guide" className={linkStyle}>Guide</NavLink>
        <NavLink to="/users" className={linkStyle}>User Information</NavLink>
        <NavLink to="/developers" className={linkStyle}>Developers</NavLink>
      </div>
    </nav>
  )
}

function Stat({ title, value }) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <p className="text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-red-600 mt-1">{value}</p>
    </div>
  )
}

function ApiStatus({ loading, error, onRetry }) {
  if (loading) {
    return <p className="text-sm text-gray-500">Loading user information...</p>
  }

  if (error) {
    return (
      <div className="text-sm text-red-700">
        <p>{error}</p>
        <button onClick={onRetry} className="mt-2 underline font-semibold">
          Try again
        </button>
      </div>
    )
  }

  return null
}

function UserSummary({ user }) {
  if (!user) return null

  return (
    <div className="flex items-center gap-4">
      <img
        src={user.image}
        alt={`${user.firstName} ${user.lastName}`}
        className="w-16 h-16 rounded-full object-cover bg-gray-100"
      />
      <div>
        <p className="font-bold">{user.firstName} {user.lastName}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
        <p className="text-sm text-gray-500">@{user.username}</p>
      </div>
    </div>
  )
}

function Dashboard({ user, loading, error, onRetry }) {
  const groups = useTaskStore((state) => state.groups)
  const tasks = useTaskStore((state) => state.tasks)
  const completed = tasks.filter((task) => task.done).length
  const pending = tasks.length - completed

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-2">Welcome to TaskMaster</h1>
      <p className="text-gray-600 mb-6">Manage your tasks and stay organized.</p>

      <section className="bg-white border rounded-xl p-5 mb-6 shadow-sm">
        <h2 className="font-bold text-lg mb-3">Sample User Information</h2>
        <ApiStatus loading={loading} error={error} onRetry={onRetry} />
        {!loading && !error && <UserSummary user={user} />}
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Stat title="Total Tasks" value={tasks.length} />
        <Stat title="Completed" value={completed} />
        <Stat title="Pending" value={pending} />
      </div>

      <h2 className="text-xl font-bold mb-3">Your Groups</h2>
      {groups.length === 0 ? (
        <p className="text-gray-500">You have no groups yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {groups.map((group) => (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className="bg-white border rounded-lg p-4 hover:border-red-500"
            >
              <h3 className="font-semibold">{group.name}</h3>
              <p className="text-sm text-gray-500">
                {tasks.filter((task) => task.groupId === group.id).length} tasks
              </p>
            </Link>
          ))}
        </div>
      )}

      <Link to="/groups" className="inline-block mt-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
        Manage Groups
      </Link>
    </main>
  )
}
      


  
function Groups() {
  const groups = useTaskStore((state) => state.groups)
  const tasks = useTaskStore((state) => state.tasks)
  const addGroup = useTaskStore((state) => state.addGroup)
  const deleteGroup = useTaskStore((state) => state.deleteGroup)
  const [name, setName] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) return
    addGroup(name.trim())
    setName('')
  }

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-5">Task Groups</h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter group name"
          className="border rounded-lg px-3 py-2 flex-1 min-w-0"
        />
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
          Add Group
        </button>
      </form>

      {groups.length === 0 ? (
        <p className="text-gray-500">You have no groups yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white border rounded-lg p-4"
            >
              <Link
                to={`/groups/${group.id}`}
                className="block hover:text-red-600"
              >
                <h3 className="font-semibold">{group.name}</h3>
                <p className="text-sm text-gray-500">
                  {tasks.filter((task) => task.groupId === group.id).length} tasks
                </p>
              </Link>

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this group?')) {
                    deleteGroup(group.id)
                  }
                }}
                className="text-red-600 text-sm mt-3"
              >
                Delete Group
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}


function GroupDetails() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const groups = useTaskStore((state) => state.groups)
  const tasks = useTaskStore((state) => state.tasks)
  const addTask = useTaskStore((state) => state.addTask)
  const toggleTask = useTaskStore((state) => state.toggleTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const [title, setTitle] = useState('')

  const group = groups.find((item) => item.id === groupId)
  const groupTasks = tasks.filter((task) => task.groupId === groupId)

  function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim()) return
    addTask(groupId, title.trim())
    setTitle('')
  }

  if (!group) {
    return (
      <main className="max-w-5xl mx-auto p-4 sm:p-6">
        <p>Group not found.</p>
        <button onClick={() => navigate('/groups')} className="text-red-600 mt-3">
          Back to Groups
        </button>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6">
      <Link to="/groups" className="text-red-600">← Back to Groups</Link>
      <h1 className="text-3xl font-bold mt-4 mb-5">{group.name}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter a task"
          className="border rounded-lg px-3 py-2 flex-1 min-w-0"
        />
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
          Add Task
        </button>
      </form>

      <div className="space-y-3">
        {groupTasks.map((task) => (
          <div key={task.id} className="bg-white border rounded-lg p-4 flex flex-wrap items-center gap-3">
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
              aria-label={`Mark ${task.title} as ${task.done ? 'not done' : 'done'}`}
            />
            <span className={`flex-1 min-w-0 break-words ${task.done ? 'line-through text-gray-400' : ''}`}>
              {task.title}
            </span>
            <span className="text-sm text-gray-500">{task.done ? 'Done' : 'Not Done'}</span>
            <button onClick={() => deleteTask(task.id)} className="text-red-600 hover:text-red-800">
              Delete
            </button>
          </div>
        ))}
        {groupTasks.length === 0 && <p className="text-gray-500">No tasks in this group yet.</p>}
      </div>
    </main>
  )
}

function Guide() {
  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-5">User Guide</h1>
      <div className="bg-white border rounded-xl p-5 space-y-4">
        <section>
          <h2 className="font-bold">1. Create a Group</h2>
          <p className="text-gray-600">Open Groups, enter a group name, and click Add Group.</p>
        </section>
        <section>
          <h2 className="font-bold">2. Add Tasks</h2>
          <p className="text-gray-600">Open a group, enter a task, and click Add Task.</p>
        </section>
        <section>
          <h2 className="font-bold">3. Complete Tasks</h2>
          <p className="text-gray-600">Use the checkbox to mark a task Done or Not Done.</p>
        </section>
        <section>
          <h2 className="font-bold">4. Delete Tasks</h2>
          <p className="text-gray-600">Click Delete beside a task to remove it.</p>
        </section>
        <section>
          <h2 className="font-bold">5. Navigate the Website</h2>
          <p className="text-gray-600">Use the navigation links to move between pages. React Router DOM changes routes without reloading the entire website.</p>
        </section>
        <section>
          <h2 className="font-bold">6. Zustand State Management</h2>
          <p className="text-gray-600">Zustand stores groups and tasks globally. When a task is added, completed, or deleted, components using the store receive the updated data.</p>
        </section>
        <section>
          <h2 className="font-bold">7. Axios and DummyJSON</h2>
          <p className="text-gray-600">Axios sends a GET request to DummyJSON to retrieve sample user information. The website shows a loading message while waiting and an error message with a retry option if the request fails.</p>
        </section>
      </div>
    </main>
  )
}

function Users({ user, loading, error, onRetry }) {
  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-2">User Information</h1>
      <p className="text-gray-600 mb-6">Sample user information retrieved from the DummyJSON API using Axios.</p>
      <section className="bg-white border rounded-xl p-5 shadow-sm">
        <ApiStatus loading={loading} error={error} onRetry={onRetry} />
        {!loading && !error && user && (
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <img
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-28 h-28 rounded-full object-cover bg-gray-100"
            />
            <div className="space-y-2">
              <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Age:</strong> {user.age}</p>
              <p><strong>Gender:</strong> {user.gender}</p>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

function Developers() {
  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-5">Developer</h1>
      <div className="bg-white border rounded-xl p-5">
        <h2 className="font-bold text-xl">Matthew Nebres</h2>
        <p className="text-gray-600">BSIT Student / Developer</p>
        <p className="mt-3">Responsible for the design and development of TaskFlow.</p>
      </div>
    </main>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchUser() {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get('https://dummyjson.com/users/1')
      setUser(response.data)
    } catch {
      setUser(null)
      setError('Unable to retrieve user information. Please check your internet connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard user={user} loading={loading} error={error} onRetry={fetchUser} />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:groupId" element={<GroupDetails />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/users" element={<Users user={user} loading={loading} error={error} onRetry={fetchUser} />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
