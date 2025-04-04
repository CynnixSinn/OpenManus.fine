export type Schema = {
  projects: {
    id?: number;
    userId: string;
    name: string;
    description?: string | null;
    requirements?: string | null;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  
  tasks: {
    id?: number;
    projectId: number;
    description: string;
    type: string;
    status?: string;
    dependencies?: string | null; // JSON string of task IDs
    output?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
  
  executions: {
    id?: number;
    taskId: number;
    command: string;
    status: string;
    output?: string | null;
    error?: string | null;
    startedAt?: string;
    completedAt?: string | null;
  };
  
  deployments: {
    id?: number;
    projectId: number;
    platform: string;
    url?: string | null;
    status: string;
    logs?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
}