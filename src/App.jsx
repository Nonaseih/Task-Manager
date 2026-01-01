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
    <div className="min-h-screen bg-linear-to-br from-[#0a0b0d] via-[#11131a] to-[#1b1e27] text-white">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#232630_1px,transparent_1px),linear-gradient(to_bottom,#232630_1px,transparent_1px)] bg-size-[50px_50px] opacity-10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 py-8 sm:py-16 lg:py-24">
        {/* Top Bar - Stats */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-0 mb-20 sm:mb-32 lg:mb-48">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">Task Manager</h1>
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 lg:gap-16">
            <div className="flex items-center gap-2 sm:gap-3 min-w-[100px] sm:min-w-[120px]">
              <span className="text-gray-400 text-sm sm:text-base">Total:</span>
              <span className="text-white font-bold text-xl sm:text-2xl lg:text-3xl">{stats.total}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 min-w-[100px] sm:min-w-[120px]">
              <span className="text-gray-400 text-sm sm:text-base">Active:</span>
              <span className="text-blue-400 font-bold text-xl sm:text-2xl lg:text-3xl">{stats.active}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 min-w-[100px] sm:min-w-[120px]">
              <span className="text-gray-400 text-sm sm:text-base">Done:</span>
              <span className="text-green-400 font-bold text-xl sm:text-2xl lg:text-3xl">{stats.completed}</span>
            </div>
            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg sm:rounded-xl transition-all min-w-[140px] sm:min-w-[180px]"
            >
              <Trash2 className="w-4 h-4 sm:w-6 sm:h-6 text-red-400" />
              <span className="text-gray-400 text-sm sm:text-base">Deleted:</span>
              <span className="text-red-400 font-bold text-xl sm:text-2xl lg:text-3xl">{deletedTasks.length}</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-20 sm:mb-32 lg:mb-48">
          <div className="relative">
            <Search className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-7 sm:h-7 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full min-w-[200px] bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl sm:rounded-3xl pl-14 sm:pl-20 pr-4 sm:pr-8 py-4 sm:py-7 text-base sm:text-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all"
            />
          </div>
        </div>

        {showDeleted ? (
          /* Deleted Tasks View */
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-12 sm:mb-20 lg:mb-32">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-400 flex items-center gap-2 sm:gap-4">
                <Trash2 className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                Deleted Tasks
              </h2>
              <button
                onClick={() => setShowDeleted(false)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all min-w-[60px] sm:min-w-[80px]"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
              </button>
            </div>
            <div className="space-y-4 sm:space-y-6 lg:space-y-10">
              {deletedTasks.length === 0 ? (
                <div className="text-center py-16 sm:py-24 lg:py-32">
                  <Trash2 className="w-12 h-12 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 opacity-20 text-gray-500" />
                  <p className="text-gray-500 text-lg sm:text-xl lg:text-2xl">No deleted tasks</p>
                </div>
              ) : (
                deletedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-red-500/5 backdrop-blur-xl border-2 border-red-500/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0"
                  >
                    <div className="flex-1">
                      <p className="text-white text-base sm:text-lg lg:text-xl">{task.text}</p>
                      <p className="text-gray-500 text-sm sm:text-base mt-1 sm:mt-2">
                        Deleted {new Date(task.deletedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 w-full sm:w-auto">
                      <button
                        onClick={() => restoreTask(task.id)}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
                      >
                        <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                        Restore
                      </button>
                      <button
                        onClick={() => permanentlyDelete(task.id)}
                        className="p-2 sm:p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg sm:rounded-xl transition-all flex items-center justify-center min-w-[60px] sm:min-w-[80px]"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Main Tasks View */
          <div className="max-w-5xl mx-auto">
            <form onSubmit={addTask} className="mb-20 sm:mb-32 lg:mb-48">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 lg:gap-8">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="What needs to be done?"
                  className="flex-1 min-w-[200px] bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl sm:rounded-3xl px-5 sm:px-8 lg:px-10 py-4 sm:py-6 lg:py-8 text-base sm:text-lg lg:text-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all"
                />
                <button
                  type="submit"
                  className="bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-2xl sm:rounded-3xl px-6 sm:px-10 lg:px-12 py-4 sm:py-6 lg:py-8 font-bold text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 transition-all active:scale-95 min-w-[100px] sm:min-w-[140px]"
                >
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                  Add
                </button>
              </div>
            </form>

            <div className="flex justify-center mb-16 sm:mb-24 lg:mb-40">
              <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 justify-center">
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
                <div className="text-center py-16 sm:py-24 lg:py-32">
                  <ClipboardList className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto mb-4 sm:mb-6 lg:mb-8 opacity-20 text-gray-500" />
                  <p className="text-gray-500 text-lg sm:text-xl lg:text-2xl">
                    {tasks.length === 0
                      ? 'No tasks yet. Add one to get started!'
                      : 'No matching tasks found.'}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 hover:bg-white/8 hover:border-white/20 transition-all group"
                  >
                    {editingId === task.id ? (
                      <div className="flex gap-3 sm:gap-4 lg:gap-6">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          className="flex-1 min-w-[150px] bg-white/8 border-2 border-white/20 rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-base sm:text-lg text-white focus:outline-none focus:border-white/40"
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="p-3 sm:p-4 lg:p-5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl sm:rounded-2xl transition-all min-w-[50px] sm:min-w-[60px]"
                        >
                          <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-3 sm:p-4 lg:p-5 bg-white/10 hover:bg-white/20 text-gray-400 rounded-xl sm:rounded-2xl transition-all min-w-[50px] sm:min-w-[60px]"
                        >
                          <X className="w-5 h-5 sm:w-6 sm:h-6" />
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
                          {task.completed && <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-base sm:text-lg lg:text-xl transition-all truncate ${
                              task.completed
                                ? 'line-through text-gray-500'
                                : 'text-white'
                            }`}
                          >
                            {task.text}
                          </p>
                          <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">
                            {new Date(task.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>

                        <div className="flex gap-2 sm:gap-3 lg:gap-5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(task)}
                            className="p-2 sm:p-3 lg:p-4 bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white rounded-lg sm:rounded-xl lg:rounded-2xl transition-all min-w-[44px] sm:min-w-[52px]"
                          >
                            <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-2 sm:p-3 lg:p-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg sm:rounded-xl lg:rounded-2xl transition-all min-w-[44px] sm:min-w-[52px]"
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
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
