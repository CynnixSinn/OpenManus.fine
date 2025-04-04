import React, { createContext, useContext, useReducer } from "react";
import { createExecution, updateExecution } from "@/lib/api";
import type { Schema } from "@/lib/db-types";

type Execution = Schema["executions"] & { id: number };

interface ExecutionState {
  currentExecution: Execution | null;
  executionHistory: Execution[];
  isExecuting: boolean;
  error: string | null;
}

type ExecutionAction =
  | { type: "SET_CURRENT_EXECUTION"; payload: Execution | null }
  | { type: "ADD_EXECUTION"; payload: Execution }
  | { type: "UPDATE_EXECUTION"; payload: Execution }
  | { type: "SET_EXECUTION_HISTORY"; payload: Execution[] }
  | { type: "SET_IS_EXECUTING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: ExecutionState = {
  currentExecution: null,
  executionHistory: [],
  isExecuting: false,
  error: null,
};

const ExecutionContext = createContext<{
  state: ExecutionState;
  dispatch: React.Dispatch<ExecutionAction>;
  executeCommand: (taskId: number, command: string) => Promise<Execution | null>;
  completeExecution: (executionId: number, output: string, error?: string) => Promise<void>;
}>({
  state: initialState,
  dispatch: () => null,
  executeCommand: async () => null,
  completeExecution: async () => {},
});

function executionReducer(state: ExecutionState, action: ExecutionAction): ExecutionState {
  switch (action.type) {
    case "SET_CURRENT_EXECUTION":
      return { ...state, currentExecution: action.payload };
    case "ADD_EXECUTION":
      return {
        ...state,
        executionHistory: [...state.executionHistory, action.payload],
        currentExecution: action.payload,
      };
    case "UPDATE_EXECUTION":
      return {
        ...state,
        executionHistory: state.executionHistory.map(e =>
          e.id === action.payload.id ? action.payload : e
        ),
        currentExecution: state.currentExecution?.id === action.payload.id
          ? action.payload
          : state.currentExecution,
      };
    case "SET_EXECUTION_HISTORY":
      return { ...state, executionHistory: action.payload };
    case "SET_IS_EXECUTING":
      return { ...state, isExecuting: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function ExecutionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(executionReducer, initialState);

  const executeCommand = async (taskId: number, command: string) => {
    dispatch({ type: "SET_IS_EXECUTING", payload: true });
    try {
      const execution: Schema["executions"] = {
        taskId,
        command,
        status: "running",
      };
      
      const newExecutions = await createExecution(execution);
      const newExecution = newExecutions[0] as Execution;
      
      dispatch({ type: "ADD_EXECUTION", payload: newExecution });
      return newExecution;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to execute command" });
      return null;
    }
  };

  const completeExecution = async (executionId: number, output: string, error?: string) => {
    try {
      const updates: Partial<Schema["executions"]> = {
        status: error ? "failed" : "completed",
        output,
        error: error || null,
        completedAt: new Date().toISOString(),
      };
      
      const updatedExecutions = await updateExecution(executionId, updates);
      
      if (updatedExecutions.length > 0) {
        dispatch({ type: "UPDATE_EXECUTION", payload: updatedExecutions[0] as Execution });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to complete execution" });
    } finally {
      dispatch({ type: "SET_IS_EXECUTING", payload: false });
    }
  };

  return (
    <ExecutionContext.Provider
      value={{
        state,
        dispatch,
        executeCommand,
        completeExecution,
      }}
    >
      {children}
    </ExecutionContext.Provider>
  );
}

export const useExecution = () => useContext(ExecutionContext);