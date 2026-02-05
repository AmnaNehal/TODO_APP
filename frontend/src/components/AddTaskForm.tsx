import { useState } from 'react';
import { CreateTaskData, Task, apiClient } from '@/lib/api';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';

interface AddTaskFormProps {
  onTaskAdded?: (task: Task) => void;
}

export default function AddTaskForm({ onTaskAdded }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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
      const newTask = await apiClient.createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        completed: false
      });

      setTitle('');
      setDescription('');

      if (onTaskAdded) {
        onTaskAdded(newTask);
      }
    } catch (err: any) {
      if (err.message.includes('Unauthorized')) {
        setError('Session expired. Please log in again.');
      } else if (err.message.includes('Forbidden')) {
        setError('Access denied. Please log in with appropriate permissions.');
      } else {
        setError('Failed to create task. Please try again.');
      }
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          label="Task Title *"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          disabled={loading}
          error={error === 'Title is required' ? error : undefined}
          className="text-sm"
        />

        <Textarea
          label="Description"
          id="description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details..."
          disabled={loading}
          className="text-sm"
        />

        {error && error !== 'Title is required' && (
          <div className="rounded-lg bg-red-50 p-3 border border-red-100 -mt-2">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="32"  height="32">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="w-full py-2 text-sm"
          >
            {loading ? 'Adding Task...' : 'Add Task'}
          </Button>
        </div>
      </div>
    </form>
  );
}