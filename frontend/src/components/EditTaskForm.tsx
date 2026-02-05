import { useState } from 'react';
import { Task, UpdateTaskData, apiClient } from '@/lib/api';

interface EditTaskFormProps {
  task: Task;
  onSave: (updatedTask: Task) => void;
  onCancel: () => void;
}

export default function EditTaskForm({ task, onSave, onCancel }: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [completed, setCompleted] = useState(task.completed);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedTask = await apiClient.updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        completed
      });

      onSave(updatedTask);
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

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow overflow-hidden sm:rounded-md p-4 mb-4">
      <div className="grid grid-cols-1 gap-y-4">
        <div>
          <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            id="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="edit-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={loading}
          />
        </div>

        <div className="flex items-center">
          <input
            id="edit-completed"
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            disabled={loading}
          />
          <label htmlFor="edit-completed" className="ml-2 block text-sm text-gray-900">
            Mark as completed
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="32"  height="32">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}