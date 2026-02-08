import { getUserSession } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://todo-app-1-cgpr.onrender.com";

class ApiClient {
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<any> {
    const session = await getUserSession();

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (options.body) {
      headers["Content-Type"] = "application/json";
    }

    if (session?.token) {
      headers["Authorization"] = `Bearer ${session.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle different error types appropriately
      if (response.status === 401) {
        throw new Error("Unauthorized: Please log in again");
      } else if (response.status === 403) {
        throw new Error(
          "Forbidden: You do not have permission to perform this action",
        );
      } else if (response.status === 404) {
        throw new Error(errorData.detail || "Resource not found");
      } else if (response.status === 409) {
        throw new Error(
          "Conflict: The requested action conflicts with current state",
        );
      } else if (response.status === 422) {
        throw new Error("Validation error: Please check your input");
      } else {
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`,
        );
      }
    }

    return response.json();
  }

  // Task API methods
  async getTasks() {
    return this.makeRequest("/api/tasks", {
      method: "GET",
    });
  }

  async createTask(taskData: {
    title: string;
    description?: string;
    completed?: boolean;
  }) {
    return this.makeRequest("/api/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(
    taskId: number,
    taskData: { title?: string; description?: string; completed?: boolean },
  ) {
    return this.makeRequest(`/api/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(taskData),
    });
  }

  async toggleTaskCompletion(taskId: number, completed: boolean) {
    return this.makeRequest(`/api/tasks/${taskId}?completed=${completed}`, {
      method: "PATCH",
    });
  }

  async deleteTask(taskId: number) {
    return this.makeRequest(`/api/tasks/${taskId}`, {
      method: "DELETE",
    });
  }

  async getTask(taskId: number) {
    return this.makeRequest(`/api/tasks/${taskId}`, {
      method: "GET",
    });
  }

  async getTaskStats() {
    return this.makeRequest("/api/tasks/stats", {
      method: "GET",
    });
  }
}

export const apiClient = new ApiClient();

export type Task = {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateTaskData = {
  title: string;
  description?: string;
  completed?: boolean;
};

export type UpdateTaskData = {
  title?: string;
  description?: string;
  completed?: boolean;
};

export type TaskStats = {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
};
