import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Circle, Clock, XCircle } from "lucide-react";
import type { Schema } from "@/lib/db-types";

type Task = Schema["tasks"] & { id: number };

interface TaskListProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function TaskList({ tasks, onTaskClick }: TaskListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "planning":
        return "bg-blue-500";
      case "frontend":
        return "bg-purple-500";
      case "backend":
        return "bg-green-500";
      case "testing":
        return "bg-amber-500";
      case "deployment":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No tasks yet</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id}>
                <div 
                  className="flex items-center gap-3 p-3 hover:bg-muted rounded-md cursor-pointer"
                  onClick={() => onTaskClick?.(task)}
                >
                  {getStatusIcon(task.status || "pending")}
                  <div className="flex-1">
                    <p className="font-medium">{task.description}</p>
                  </div>
                  <Badge className={getTypeColor(task.type)}>
                    {task.type}
                  </Badge>
                </div>
                <Separator className="my-2"/>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}