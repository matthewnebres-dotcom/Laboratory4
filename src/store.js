
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useTaskStore = create(
  persist(
    (set) => ({
      groups: [],
      tasks: [],

      addGroup: (name) =>
        set((state) => ({
          groups: [
            ...state.groups,
            { id: `${Date.now()}-${Math.random()}`, name },
          ],
        })),
      deleteGroup: (id) =>
          set((state) => ({
            groups: state.groups.filter((group) => group.id !== id),
                tasks: state.tasks.filter((task) => task.groupId !== id),
  })),

      addTask: (groupId, title) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: `${Date.now()}-${Math.random()}`,
              groupId,
              title,
              done: false,
            },
          ],
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, done: !task.done } : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
    }),
    {
      name: 'taskmaster-storage',
    }
  )
)

export default useTaskStore
