import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full bg-background text-foreground">
        <div className="container mx-auto py-16 px-4 flex flex-col items-center justify-center text-center">
          <FileQuestion className="h-24 w-24 text-muted-foreground mb-6" />
          <h1 className="text-4xlfont-bold mb-4">Page Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link to="/">Go to Dashboard</Link>
            </Button>
            <Button asChild>
              <Link to="/new-project">Create New Project</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}