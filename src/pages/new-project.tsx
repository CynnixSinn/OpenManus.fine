import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NewProjectForm } from "@/components/project/new-project-form";
import { ArrowLeft } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/route-components";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

function NewProjectPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full bg-background text-foreground">
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Create New Project</h1>
            <p className="text-muted-foreground mt-2">
              Describe what you want OpenManus to build for you
            </p>
          </div>
          
          <NewProjectForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ProtectedNewProject() {
  return <ProtectedRoute Component={NewProjectPage} />;
}