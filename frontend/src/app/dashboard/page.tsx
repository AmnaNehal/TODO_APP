'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import TaskList from '@/components/TaskList';
import AddTaskForm from '@/components/AddTaskForm';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Task, apiClient } from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import ChatLauncher from "@/components/ChatLauncher";


export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const { session, signOut, isLoading } = useAuth();

  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') ?? 'dashboard';

  useEffect(() => {
    if (!session) return;

    const load = async () => {
      try {
        setTasksLoading(true);
        const data = await apiClient.getTasks();
        setTasks(data);
      } catch (e) {
        console.error('Error fetching tasks:', e);
        setTasks([]);
      } finally {
        setTasksLoading(false);
      }
    };

    load();
  }, [session]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  const handleTaskAdded = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleTaskDeleted = (deletedTaskId: number) => {
    setTasks(prev => prev.filter(t => t.id !== deletedTaskId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse-slow inline-flex h-16 w-16 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    if (typeof window !== 'undefined') window.location.href = '/login';
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={{ name: session?.user?.name, email: session?.user?.email }} onSignOut={signOut} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={tab === 'tasks' ? 'Tasks' : 'Dashboard'} subtitle="Manage your tasks efficiently and boost your productivity" />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Show stats only on dashboard tab */}
          {tab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{tasksLoading ? '...' : stats.total}</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{tasksLoading ? '...' : stats.completed}</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{tasksLoading ? '...' : stats.pending}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <AddTaskForm onTaskAdded={handleTaskAdded} />
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <TaskList
                  tasks={tasks}
                  loading={tasksLoading}
                  onTaskUpdate={handleTaskUpdated}
                  onTaskDelete={handleTaskDeleted}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
       <ChatLauncher
        userId={session.user.id}
        token={session.accessToken}
      />

    </div>
  );
}
