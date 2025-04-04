import { fine } from "./fine";
import type { Schema } from "./db-types";

// Error handling wrapper
async function handleApiRequest<T>(requestFn: () => Promise<T>): Promise<[T | null, Error | null]> {
  try {
    const result = await requestFn();
    return [result, null];
  } catch (error) {
    console.error("API Error:", error);
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

// Project functions
export async function getProjects(userId: string) {
  const [data, error] = await handleApiRequest(() => 
    fine.table("projects").select().eq("userId", userId)
  );
  
  if (error) throw error;
  return data;
}

export async function getProject(projectId: number) {
  const [projects, error] = await handleApiRequest(() => 
    fine.table("projects").select().eq("id", projectId)
  );
  
  if (error) throw error;
  return projects?.[0] || null;
}

export async function createProject(project: Schema["projects"]) {
  const [data, error] = await handleApiRequest(() => 
    fine.table("projects").insert(project).select()
  );
  
  if (error) throw error;
  return data;
}

export async function updateProject(projectId: number, updates: Partial<Schema["projects"]>) {
  const [data, error] = await handleApiRequest(() => 
    fine.table("projects").update(updates).eq("id", projectId).select()
  );
  
  if (error) throw error;
  return data;
}

// Task functions
export async function getProjectTasks(projectId: number) {
  const [data, error] = await handleApiRequest(() => 
    fine.table("tasks").select().eq("projectId", projectId)
  );
  
  if (error) throw error;
  return data;
}

export async function createTask(task: Schema["tasks"]) {
  const [data, error] = await handleApiRequest(() => 
    fine.table("tasks").insert(task).select()
  );
  
  if (error) throw error;
  return data;
}

export async function updateTask(taskId: number, updates: Partial<Schema["tasks"]>) {
  const [data, error] = await handleApiRequest(() => 
    fine.table("tasks").update(updates).eq("id", taskId).select()
  );
  
  if (error) throw error;
  return data;
}

// Execution functions
export async function getTaskExecutions(taskId: number) {
  const [data, error] = await handleApiRequest(() => 
    fine.table("executions").select().eq("taskId", taskId)
  );
  
  if (error) throw error;
  return data;
}

export async function createExecution(execution: Schema["executions"]) {
  const [data, error] = await handleApiRequest(() => 
    fine.table("executions").insert(execution).select()
  );
  
  if (error) throw error;
  return data;
}

export async function updateExecution(executionId: number, updates: Partial<Schema["executions"]>) {
  const [data, error] = await handleApiRequest(() => 
    fine.table("executions").update(updates).eq("id", executionId).select()
  );
  
  if (error) throw error;
  return data;
}

// Deployment functions
export async function getProjectDeployments(projectId: number) {
  const [data, error] = await handleApiRequest(() => 
    fine.table("deployments").select().eq("projectId", projectId)
  );
  
  if (error) throw error;
  return data;
}

export async function createDeployment(deployment: Schema["deployments"]) {
  const [data, error] = await handleApiRequest(() => 
    fine.table("deployments").insert(deployment).select()
  );
  
  if (error) throw error;
  return data;
}

export async function updateDeployment(deploymentId: number, updates: Partial<Schema["deployments"]>) {
  const [data, error] = await handleApiRequest(() => 
    fine.table("deployments").update(updates).eq("id", deploymentId).select()
  );
  
  if (error) throw error;
  return data;
}