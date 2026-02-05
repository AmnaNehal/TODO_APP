import { useState } from 'react';
import { Task, apiClient } from '@/lib/api';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onUpdate: (updatedTask: Task) => void;
}

export default function TaskItem({ task, onToggleComplete, onDelete, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editCompleted, setEditCompleted] = useState(task.completed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call the API to update the task
      const updatedTask = await apiClient.updateTask(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        completed: editCompleted
      });

      setIsEditing(false);
      onUpdate(updatedTask); // Notify parent of the update
    } catch (err: any) {
      if (err.message.includes('Unauthorized')) {
        setError('Session expired. Please log in again.');
      } else if (err.message.includes('Forbidden') || err.message.includes('not found')) {
        setError('Unable to update this task. It may have been deleted or you do not have permission.');
      } else {
        setError('Failed to update task. Please try again.');
      }
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditCompleted(task.completed);
    setIsEditing(false);
  };

  return (
    <li className="py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {!isEditing ? (
          <div className="flex-1 flex flex-col sm:flex-row sm:items-start gap-4 w-full">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className={`mt-1 text-xs ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                    {task.completed && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200"
                    title="Edit task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="ml-1 text-xs hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="flex items-center p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                    title="Delete task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="ml-1 text-xs hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div className="space-y-3">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                disabled={loading}
                placeholder="Task title"
                className="text-sm"
              />
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
                disabled={loading}
                placeholder="Task description (optional)"
                className="text-sm"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`edit-completed-${task.id}`}
                  checked={editCompleted}
                  onChange={(e) => setEditCompleted(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  disabled={loading}
                />
                <label htmlFor={`edit-completed-${task.id}`} className="ml-2 block text-sm text-gray-900">
                  Mark as completed
                </label>
              </div>
              {error && (
                <div className="text-red-500 text-xs">{error}</div>
              )}
              <div className="flex flex-col sm:flex-row sm:justify-end space-y-1 sm:space-y-0 sm:space-x-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-3 py-1.5 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  loading={loading}
                  className="px-3 py-1.5 text-sm"
                >
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}