
import { create } from 'zustand'

const useTaskStore = create((set) => ({
  groups: [],
  tasks: [],

  addGroup: (name) =>
    set((state) => ({
      groups: [
        ...state.groups,
        {
          id: Date.now().toString(),
          name,
        },
      ],
    })),

  addTask: (groupId, title) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: Date.now().toString(),
          groupId,
          title,
          done: false,
        },
      ],
    })),

  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, done: !task.done }
          : task
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
}))

export default useTaskStore
