import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Schema } from "@/lib/db-types";

type Task = Schema["tasks"] & { id: number };

interface TaskGraphProps {
  tasks: Task[];
}

export function TaskGraph({ tasks }: TaskGraphProps) {
  // This is a simplified version - in a real app, you'd use a proper graph visualization library
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981"; // green
      case "in-progress":
        return "#f59e0b"; // amber
      case "failed":
        return "#ef4444"; // red
      default:
        return "#6b7280"; // gray
    }
  };

  // Parse dependencies for each task
  const taskWithDeps = tasks.map(task => {
    let dependencies: number[] = [];
    if (task.dependencies) {
      try {
        dependencies = JSON.parse(task.dependencies);
      } catch (e) {
        // Invalid JSON, treat as no dependencies
      }
    }
    return { ...task, parsedDeps: dependencies };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Dependencies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px] bg-muted/20 rounded-md p-4 overflow-auto">
          {tasks.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No tasks to display
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {taskWithDeps.map(task => (
                <div key={task.id} className="relative">
                  <div 
                    className="p-3 rounded-md border border-border"
                    style={{ 
                      backgroundColor: `${getStatusColor(task.status || "pending")}20`,
                      borderColor: getStatusColor(task.status || "pending")
                    }}
                  >
                    <div className="font-medium">{task.description}</div>
                    <div className="text-xs text-muted-foreground">{task.type}</div>
                  </div>
                  
                  {/* Draw lines to dependencies - simplified version */}
                  {task.parsedDeps.length > 0 && (
                    <div className="absolute -top-4 left-1/2 w-px h-4 bg-muted-foreground"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}