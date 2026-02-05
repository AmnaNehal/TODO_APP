import { useEffect, useMemo, useState } from 'react';
import { Task } from '@/lib/api';
import TaskItem from './TaskItem';
import { apiClient } from '@/lib/api';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onTaskUpdate?: (task: Task) => void;
  onTaskDelete?: (taskId: number) => void;
}

export default function TaskList({ tasks, loading, onTaskUpdate, onTaskDelete }: TaskListProps) {
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    // clear errors when tasks re-render (optional)
    setError(null);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter(t => !t.completed);
    if (filter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
  }, [tasks, filter]);

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = await apiClient.toggleTaskCompletion(task.id, !task.completed);
      onTaskUpdate?.(updatedTask);
      setError(null);
    } catch (err: any) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    onTaskUpdate?.(updatedTask);
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await apiClient.deleteTask(taskId);
      onTaskDelete?.(taskId);
      setError(null);
    } catch (err: any) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-pulse-slow inline-flex h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-purple-800"></div>
        <p className="mt-4 text-gray-600">Loading your tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 mb-4 border border-red-200">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="mt-3 text-sm font-medium text-gray-900">No tasks yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="task-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Filter tasks:
        </label>
        <select
          id="task-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
          className="w-full sm:w-auto appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Tasks</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <ul className="space-y-4">
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
          />
        ))}
      </ul>
    </div>
  );
}
