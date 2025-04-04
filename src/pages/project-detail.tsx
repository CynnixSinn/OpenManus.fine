import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TaskList } from "@/components/project/task-list";
import { TaskGraph } from "@/components/project/task-graph";
import { CommandInput } from "@/components/project/command-input";
import { Console } from "@/components/ui/console";
import { CodeEditor } from "@/components/ui/code-editor";
import { useProject } from "@/contexts/project-context";
import { useExecution } from "@/contexts/execution-context";
import { ProtectedRoute } from "@/components/auth/route-components";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Loading } from "@/components/ui/loading";
import { ErrorBoundary } from "@/components/error-boundary";
import { useLLM } from "@/lib/llm-service";
import { ArrowLeft, Code, FileCode, Loader2, Play, Settings } from "lucide-react";
import type { Schema } from "@/lib/db-types";
import { useToast } from "@/hooks/use-toast";

type Task = Schema["tasks"] & { id: number };

function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { state: projectState, loadProject, createNewTask, updateTaskStatus } = useProject();
  const { state: executionState, executeCommand, completeExecution } = useExecution();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [codeContent, setCodeContent] = useState("");
  const [consoleOutput, setConsoleOutput] = useState("");
  const { generateResponse } = useLLM();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (projectId) {
      loadProject(parseInt(projectId)).catch(error => {
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive"
        });
      });
    }
  }, [projectId, loadProject, toast]);

  useEffect(() => {
    if (selectedTask?.output) {
      try {
        // Check if the output is code (simplified check)
        if (selectedTask.output.includes("```") || selectedTask.type === "frontend" || selectedTask.type === "backend") {
          setCodeContent(selectedTask.output);
        } else {
          setConsoleOutput(selectedTask.output);
        }
      } catch (e) {
        setConsoleOutput(selectedTask.output || "");
      }
    } else {
      setCodeContent("");
      setConsoleOutput("");
    }
  }, [selectedTask]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCommandSubmit = async (command: string) => {
    if (!projectId) return;
    
    // If it's a new task command
    if (command.startsWith("/task")) {
      const taskDescription = command.replace("/task", "").trim();
      if (taskDescription) {
        try {
          const newTask = await createNewTask({
            projectId: parseInt(projectId),
            description: taskDescription,
            type: "planning", // Default type
            status: "pending",
          });
          
          if (newTask) {
            setSelectedTask(newTask);
            toast({
              title: "Task created",
              description: "New task has been created successfully"
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to create new task",
            variant: "destructive"
          });
        }
      }
      return;
    }
    
    // If we have a selected task, execute the command for that task
    if (selectedTask) {
      try {
        const execution = await executeCommand(selectedTask.id, command);
        
        if (execution) {
          // Update console immediately to show activity
          setConsoleOutput(prev => `${prev}\\n> ${command}\\nProcessing...\\n`);
          
          // Get AI response
          const llmResponse = await generateResponse({
            prompt: `Project: ${projectState.currentProject?.name}\\nTask: ${selectedTask.description}\\nCommand: ${command}`,
            temperature: 0.7
          });
          
          if (llmResponse) {
            const output = llmResponse.text;
            
            // Update the console
            setConsoleOutput(output);
            
            // Complete the execution
            await completeExecution(execution.id, output);
            
            // Update the task with the output
            await updateTaskStatus(selectedTask.id, "completed", output);
            
            toast({
              title: "Command executed",
              description: "Task has been processed successfully"
            });
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to execute command",
          variant: "destructive"
        });
      }
    } else {
      toast({
        description: "Please select a task first",
        variant: "destructive"
      });
    }
  };

  if (projectState.loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 w-full bg-background text-foreground flex items-center justify-center">
          <Loading size="lg" text="Loading project details..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (!projectState.currentProject) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 w-full bg-background text-foreground">
          <div className="container mx-auto py-16 px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Project not found</h1>
            <p className="text-muted-foreground mb-8">
              The project you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button asChild>
              <Link to="/">Back to Dashboard</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full bg-background text-foreground">
        <ErrorBoundary>
          <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
              <Button asChild variant="ghost" size="sm">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{projectState.currentProject.name}</h1>
                  <Badge className="ml-2">{projectState.currentProject.status}</Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  {projectState.currentProject.description || "No description provided"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Run Project
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <TaskList 
                  tasks={projectState.projectTasks} 
                  onTaskClick={handleTaskClick}
                />
                
                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">
                        {projectState.currentProject.requirements || "No requirements specified"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="lg:col-span-2">
                <Tabs defaultValue="console">
                  <div className="flex justify-between items-center mb-4">
                    <TabsList>
                      <TabsTrigger value="console">Console</TabsTrigger>
                      <TabsTrigger value="code">Code</TabsTrigger>
                      <TabsTrigger value="graph">Task Graph</TabsTrigger>
                    </TabsList>
                    
                    {selectedTask && (
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          {selectedTask.type}
                        </Badge>
                        <span className="text-sm font-medium">
                          {selectedTask.description}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <TabsContent value="console" className="space-y-4">
                    <Console output={consoleOutput} />
                    <CommandInput 
                      onSubmit={handleCommandSubmit}
                      isExecuting={executionState.isExecuting}
                      placeholder={selectedTask ? "Enter a command for this task..." : "Type /task to create a new task"}
                    />
                  </TabsContent>
                  
                  <TabsContent value="code">
                    <div className="space-y-4">
                      <CodeEditor 
                        value={codeContent} 
                        onChange={setCodeContent}
                        language="javascript"
                      />
                      <div className="flex justify-end">
                        <Button variant="outline" className="mr-2">
                          <FileCode className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button>
                          <Code className="h-4 w-4 mr-2" />
                          Execute
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="graph">
                    <TaskGraph tasks={projectState.projectTasks} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default function ProtectedProjectDetail() {
  return <ProtectedRoute Component={ProjectDetailPage} />;
}