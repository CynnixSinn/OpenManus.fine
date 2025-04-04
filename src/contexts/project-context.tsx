import React, { createContext, useContext, useReducer, useEffect } from "react";
import { getProjects, getProject, getProjectTasks } from "@/lib/api";
import { measureAsync } from "@/lib/performance";
import type { Schema } from "@/lib/db-types";
import { fine } from "@/lib/fine";

type Project = Schema["projects"] & { id: number };
type Task = Schema["tasks"] & { id: number };

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  projectTasks: Task[];
  loading: boolean;
  error: string | null;
}

type ProjectAction =
  | { type: "SET_PROJECTS"; payload: Project[] }
  | { type: "SET_CURRENT_PROJECT"; payload: Project | null }
  | { type: "SET_PROJECT_TASKS"; payload: Task[] }
  | { type: "ADD_PROJECT"; payload: Project }
  | { type: "UPDATE_PROJECT"; payload: Project }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  projectTasks: [],
  loading: false,
  error: null,
};

const ProjectContext = createContext<{
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
  loadProjects: () => Promise<void>;
  loadProject: (projectId: number) => Promise<void>;
  createNewProject: (project: Schema["projects"]) => Promise<Project | null>;
  createNewTask: (task: Schema["tasks"]) => Promise<Task | null>;
  updateProjectStatus: (projectId: number, status: string) => Promise<void>;
  updateTaskStatus: (taskId: number, status: string, output?: string) => Promise<void>;
}>({
  state: initialState,
  dispatch: () => null,
  loadProjects: async () => {},
  loadProject: async () => {},
  createNewProject: async () => null,
  createNewTask: async () => null,
  updateProjectStatus: async () => {},
  updateTaskStatus: async () => {},
});

function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case "SET_PROJECTS":
      return { ...state, projects: action.payload };
    case "SET_CURRENT_PROJECT":
      return { ...state, currentProject: action.payload };
    case "SET_PROJECT_TASKS":
      return { ...state, projectTasks: action.payload };
    case "ADD_PROJECT":
      return { ...state, projects: [...state.projects, action.payload] };
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
        currentProject: state.currentProject?.id === action.payload.id 
          ? action.payload 
          : state.currentProject
      };
    case "ADD_TASK":
      return { ...state, projectTasks: [...state.projectTasks, action.payload] };
    case "UPDATE_TASK":
      return {
        ...state,
        projectTasks: state.projectTasks.map(t => 
          t.id === action.payload.id ? action.payload : t
        )
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const { data: session } = fine.auth.useSession();

  const loadProjects = async () => {
    if (!session?.user?.id) return;
    
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const projects = await measureAsync(
        'loadProjects', 
        () => getProjects(session.user.id),
        import.meta.env.DEV
      );
      dispatch({ type: "SET_PROJECTS", payload: projects as Project[] });
    } catch (error) {
      console.error("Failed to load projects:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load projects" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const loadProject = async (projectId: number) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const [project, tasks] = await Promise.all([
        measureAsync(
          'loadProject', 
          () => getProject(projectId),
          import.meta.env.DEV
        ),
        measureAsync(
          'loadProjectTasks', 
          () => getProjectTasks(projectId),
          import.meta.env.DEV
        )
      ]);
      
      dispatch({ type: "SET_CURRENT_PROJECT", payload: project as Project });
      dispatch({ type: "SET_PROJECT_TASKS", payload: tasks as Task[] });
    } catch (error) {
      console.error("Failed to load project:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load project" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const createNewProject = async (project: Schema["projects"]) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const newProjects = await measureAsync(
        'createNewProject',
        () => fine.table("projects").insert(project).select(),
        import.meta.env.DEV
      );
      
      const newProject = newProjects[0] as Project;
      dispatch({ type: "ADD_PROJECT", payload: newProject });
      return newProject;
    } catch (error) {
      console.error("Failed to create project:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to create project" });
      return null;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const createNewTask = async (task: Schema["tasks"]) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const newTasks = await measureAsync(
        'createNewTask',
        () => fine.table("tasks").insert(task).select(),
        import.meta.env.DEV
      );
      
      const newTask = newTasks[0] as Task;
      dispatch({ type: "ADD_TASK", payload: newTask });
      return newTask;
    } catch (error) {
      console.error("Failed to create task:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to create task" });
      return null;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateProjectStatus = async (projectId: number, status: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const updatedProjects = await measureAsync(
        'updateProjectStatus',
        () => fine.table("projects")
          .update({ status, updatedAt: new Date().toISOString() })
          .eq("id", projectId)
          .select(),
        import.meta.env.DEV
      );
      
      if (updatedProjects.length > 0) {
        dispatch({ type: "UPDATE_PROJECT", payload: updatedProjects[0] as Project });
      }
    } catch (error) {
      console.error("Failed to update project status:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to update project status" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateTaskStatus = async (taskId: number, status: string, output?: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const updates: Partial<Schema["tasks"]> = { 
        status, 
        updatedAt: new Date().toISOString() 
      };
      
      if (output !== undefined) {
        updates.output = output;
      }
      
      const updatedTasks = await measureAsync(
        'updateTaskStatus',
        () => fine.table("tasks")
          .update(updates)
          .eq("id", taskId)
          .select(),
        import.meta.env.DEV
      );
      
      if (updatedTasks.length > 0) {
        dispatch({ type: "UPDATE_TASK", payload: updatedTasks[0] as Task });
      }
    } catch (error) {
      console.error("Failed to update task status:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to update task status" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Load projects when user session is available
  useEffect(() => {
    if (session?.user?.id) {
      loadProjects();
    }
  }, [session?.user?.id]);

  return (
    <ProjectContext.Provider
      value={{
        state,
        dispatch,
        loadProjects,
        loadProject,
        createNewProject,
        createNewTask,
        updateProjectStatus,
        updateTaskStatus,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => useContext(ProjectContext);