/**
    * @description      : 
    * @author           : fortu
    * @group            : 
    * @created          : 01/01/2026 - 04:51:36
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 01/01/2026
    * - Author          : fortu
    * - Modification    : 
**/
/**
 * @description      : Modern Task Manager - Website Style Layout
 * @author           : fortu
 * @created          : 01/01/2026
**/

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Check, X, Search, ClipboardList, RotateCcw } from 'lucide-react'

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks')
    return saved ? JSON.parse(saved) : []
  })
  const [deletedTasks, setDeletedTasks] = useState(() => {
    const saved = localStorage.getItem('deletedTasks')
    return saved ? JSON.parse(saved) : []
  })
  const [showDeleted, setShowDeleted] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks))
  }, [deletedTasks])

  const addTask = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setTasks([
        {
          id: Date.now(),
          text: inputValue.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
        },
        ...tasks,
      ])
      setInputValue('')
    }
  }

  const deleteTask = (id) => {
    const taskToDelete = tasks.find(task => task.id === id)
    if (taskToDelete) {
      setDeletedTasks([{ ...taskToDelete, deletedAt: new Date().toISOString() }, ...deletedTasks])
    }
    setTasks(tasks.filter(task => task.id !== id))
  }

  const permanentlyDelete = (id) => {
    setDeletedTasks(deletedTasks.filter(task => task.id !== id))
  }

  const restoreTask = (id) => {
    const taskToRestore = deletedTasks.find(task => task.id === id)
    if (taskToRestore) {
      const { deletedAt, ...restoredTask } = taskToRestore
      setTasks([restoredTask, ...tasks])
    }
    setDeletedTasks(deletedTasks.filter(task => task.id !== id))
  }

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const startEdit = (task) => {
    setEditingId(task.id)
    setEditValue(task.text)
  }

  const saveEdit = () => {
    if (editValue.trim()) {
      setTasks(
        tasks.map((task) =>
          task.id === editingId ? { ...task, text: editValue.trim() } : task
        )
      )
      setEditingId(null)
      setEditValue('')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'active') return !task.completed
      if (filter === 'completed') return task.completed
      return true
    })
    .filter((task) =>
      task.text.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  }

  return (
    <div className="bg-linear-to-br min-h-screen from-[#0a0b0d] via-[#11131a] to-[#1b1e27] text-white">
      <div className="bg-size-[50px_50px] pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#232630_1px,transparent_1px),linear-gradient(to_bottom,#232630_1px,transparent_1px)] opacity-10" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-16 lg:px-20 lg:py-24">
        {/* Top Bar - Stats */}
        <div className="mb-20 flex flex-col items-start justify-between gap-8 sm:mb-32 lg:mb-48 lg:flex-row lg:items-center lg:gap-0">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">Task Manager</h1>
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 lg:gap-16">
            <div className="flex min-w-[100px] items-center gap-2 sm:min-w-[120px] sm:gap-3">
              <span className="text-sm text-gray-400 sm:text-base">Total:</span>
              <span className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">{stats.total}</span>
            </div>
            <div className="flex min-w-[100px] items-center gap-2 sm:min-w-[120px] sm:gap-3">
              <span className="text-sm text-gray-400 sm:text-base">Active:</span>
              <span className="text-xl font-bold text-blue-400 sm:text-2xl lg:text-3xl">{stats.active}</span>
            </div>
            <div className="flex min-w-[100px] items-center gap-2 sm:min-w-[120px] sm:gap-3">
              <span className="text-sm text-gray-400 sm:text-base">Done:</span>
              <span className="text-xl font-bold text-green-400 sm:text-2xl lg:text-3xl">{stats.completed}</span>
            </div>
            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className="flex min-w-[140px] items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 transition-all hover:bg-white/10 sm:min-w-[180px] sm:gap-3 sm:rounded-xl sm:px-6 sm:py-3"
            >
              <Trash2 className="h-4 w-4 text-red-400 sm:h-6 sm:w-6" />
              <span className="text-sm text-gray-400 sm:text-base">Deleted:</span>
              <span className="text-xl font-bold text-red-400 sm:text-2xl lg:text-3xl">{deletedTasks.length}</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mx-auto mb-20 max-w-4xl sm:mb-32 lg:mb-48">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 sm:left-8 sm:h-7 sm:w-7" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="focus:bg-white/8 w-full min-w-[200px] rounded-2xl border-2 border-white/10 bg-white/5 py-4 pl-14 pr-4 text-base text-white placeholder-gray-500 backdrop-blur-xl transition-all focus:border-white/30 focus:outline-none sm:rounded-3xl sm:py-7 sm:pl-20 sm:pr-8 sm:text-xl"
            />
          </div>
        </div>

        {showDeleted ? (
          /* Deleted Tasks View */
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 flex items-center justify-between sm:mb-20 lg:mb-32">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-red-400 sm:gap-4 sm:text-3xl lg:text-4xl">
                <Trash2 className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
                Deleted Tasks
              </h2>
              <button
                onClick={() => setShowDeleted(false)}
                className="min-w-[60px] rounded-lg bg-white/10 px-4 py-2 transition-all hover:bg-white/20 sm:min-w-[80px] sm:rounded-xl sm:px-6 sm:py-3"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
              </button>
            </div>
            <div className="space-y-4 sm:space-y-6 lg:space-y-10">
              {deletedTasks.length === 0 ? (
                <div className="py-16 text-center sm:py-24 lg:py-32">
                  <Trash2 className="mx-auto mb-4 h-12 w-12 text-gray-500 opacity-20 sm:mb-6 sm:h-20 sm:w-20 lg:h-24 lg:w-24" />
                  <p className="text-lg text-gray-500 sm:text-xl lg:text-2xl">No deleted tasks</p>
                </div>
              ) : (
                deletedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col items-start justify-between gap-4 rounded-2xl border-2 border-red-500/20 bg-red-500/5 p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:gap-0 sm:rounded-3xl sm:p-8 lg:p-12"
                  >
                    <div className="flex-1">
                      <p className="text-base text-white sm:text-lg lg:text-xl">{task.text}</p>
                      <p className="mt-1 text-sm text-gray-500 sm:mt-2 sm:text-base">
                        Deleted {new Date(task.deletedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4 lg:gap-6">
                      <button
                        onClick={() => restoreTask(task.id)}
                        className="flex min-w-[120px] items-center justify-center gap-2 rounded-lg bg-green-500/20 px-4 py-2 text-sm text-green-400 transition-all hover:bg-green-500/30 sm:min-w-[140px] sm:gap-3 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
                      >
                        <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
                        Restore
                      </button>
                      <button
                        onClick={() => permanentlyDelete(task.id)}
                        className="flex min-w-[60px] items-center justify-center rounded-lg bg-red-500/20 p-2 text-red-400 transition-all hover:bg-red-500/30 sm:min-w-[80px] sm:rounded-xl sm:p-3"
                      >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Main Tasks View */
          <div className="mx-auto max-w-5xl">
            <form onSubmit={addTask} className="mb-20 sm:mb-32 lg:mb-48">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-5 lg:gap-8">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="What needs to be done?"
                  className="focus:bg-white/8 min-w-[200px] flex-1 rounded-2xl border-2 border-white/10 bg-white/5 px-5 py-4 text-base text-white placeholder-gray-500 backdrop-blur-xl transition-all focus:border-white/30 focus:outline-none sm:rounded-3xl sm:px-8 sm:py-6 sm:text-lg lg:px-10 lg:py-8 lg:text-xl"
                />
                <button
                  type="submit"
                  className="flex min-w-[100px] items-center justify-center gap-2 rounded-2xl border-2 border-white/20 bg-white/10 px-6 py-4 text-base font-bold transition-all hover:bg-white/20 active:scale-95 sm:min-w-[140px] sm:gap-3 sm:rounded-3xl sm:px-10 sm:py-6 sm:text-lg lg:px-12 lg:py-8"
                >
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                  Add
                </button>
              </div>
            </form>

            <div className="mb-16 flex justify-center sm:mb-24 lg:mb-40">
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
                {['all', 'active', 'completed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-8 sm:px-12 lg:px-16 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg capitalize transition-all border-2 min-w-[120px] sm:min-w-[160px] lg:min-w-[200px] ${
                      filter === f
                        ? 'bg-white/20 text-white border-white/30'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6 lg:space-y-10">
              {filteredTasks.length === 0 ? (
                <div className="py-16 text-center sm:py-24 lg:py-32">
                  <ClipboardList className="mx-auto mb-4 h-16 w-16 text-gray-500 opacity-20 sm:mb-6 sm:h-24 sm:w-24 lg:mb-8 lg:h-32 lg:w-32" />
                  <p className="text-lg text-gray-500 sm:text-xl lg:text-2xl">
                    {tasks.length === 0
                      ? 'No tasks yet. Add one to get started!'
                      : 'No matching tasks found.'}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="hover:bg-white/8 group rounded-2xl border-2 border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all hover:border-white/20 sm:rounded-3xl sm:p-8 lg:p-12"
                  >
                    {editingId === task.id ? (
                      <div className="flex gap-3 sm:gap-4 lg:gap-6">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          className="bg-white/8 min-w-[150px] flex-1 rounded-xl border-2 border-white/20 px-4 py-3 text-base text-white focus:border-white/40 focus:outline-none sm:rounded-2xl sm:px-6 sm:py-4 sm:text-lg lg:px-8 lg:py-5"
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="min-w-[50px] rounded-xl bg-green-500/20 p-3 text-green-400 transition-all hover:bg-green-500/30 sm:min-w-[60px] sm:rounded-2xl sm:p-4 lg:p-5"
                        >
                          <Check className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="min-w-[50px] rounded-xl bg-white/10 p-3 text-gray-400 transition-all hover:bg-white/20 sm:min-w-[60px] sm:rounded-2xl sm:p-4 lg:p-5"
                        >
                          <X className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 sm:gap-6 lg:gap-10">
                        <button
                          onClick={() => toggleComplete(task.id)}
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl border-2 flex items-center justify-center shrink-0 transition-all ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-600 hover:border-gray-400'
                          }`}
                        >
                          {task.completed && <Check className="h-4 w-4 text-white sm:h-5 sm:w-5" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-base sm:text-lg lg:text-xl transition-all truncate ${
                              task.completed
                                ? 'line-through text-gray-500'
                                : 'text-white'
                            }`}
                          >
                            {task.text}
                          </p>
                          <p className="mt-1 text-xs text-gray-600 sm:mt-2 sm:text-sm">
                            {new Date(task.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>

                        <div className="flex gap-2 opacity-100 transition-opacity group-hover:opacity-100 sm:gap-3 sm:opacity-0 lg:gap-5">
                          <button
                            onClick={() => startEdit(task)}
                            className="min-w-[44px] rounded-lg bg-white/10 p-2 text-gray-400 transition-all hover:bg-white/20 hover:text-white sm:min-w-[52px] sm:rounded-xl sm:p-3 lg:rounded-2xl lg:p-4"
                          >
                            <Edit2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="min-w-[44px] rounded-lg bg-red-500/10 p-2 text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300 sm:min-w-[52px] sm:rounded-xl sm:p-3 lg:rounded-2xl lg:p-4"
                          >
                            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
