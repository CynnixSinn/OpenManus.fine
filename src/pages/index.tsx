import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectCard } from "@/components/project/project-card";
import { useProject } from "@/contexts/project-context";
import { fine } from "@/lib/fine";
import { Brain, Loader2, Plus } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const Index = () => {
  const { state } = useProject();
  const { data: session, isPending } = fine.auth.useSession();

  if (isPending) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full bg-background text-foreground">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold flex items-center">
                <Brain className="h-10 w-10 mr-2 text-primary" />
                OpenManus
              </h1>
              <p className="text-muted-foreground mt-2">
                Your AI-powered app building assistant
              </p>
            </div>
            {session?.user && (
              <Button asChild>
                <Link to="/new-project">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Link>
              </Button>
            )}
          </div>

          {session?.user ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">Your Projects</h2>
              {state.loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : state.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {state.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No projects yet</CardTitle>
                    <CardDescription>
                      Create your first project to get started
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link to="/new-project">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Project
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="mt-12">
              <Card className="max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Welcome to OpenManus
                  </CardTitle>
                  <CardDescription>
                    Your AI-powered app building assistant
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    OpenManus is an autonomous AI agent that can build web applications
                    based on your requirements. Sign up to get started!
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button asChild variant="outline" size="lg">
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button asChild size="lg">
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;