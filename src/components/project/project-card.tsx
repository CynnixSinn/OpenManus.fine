import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Code, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import type { Schema } from "@/lib/db-types";

type Project = Schema["projects"] & { id: number };

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-blue-500";
      case "coding":
        return "bg-amber-500";
      case "testing":
        return "bg-purple-500";
      case "deployed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{project.name}</CardTitle>
          <Badge className={getStatusColor(project.status || "planning")}>
            {project.status || "planning"}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {project.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Created: {formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <span>Last updated: {formatDate(project.updatedAt)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/project/${project.id}`}>
            <Rocket className="mr-2 h-4 w-4" />
            View Project
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}