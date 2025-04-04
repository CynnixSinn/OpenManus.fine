import React from "react";
import { Link } from "react-router-dom";
import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-semibold">OpenManus</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} OpenManus. All rights reserved.
          </div>
          
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/security-policy" className="text-sm text-muted-foreground hover:text-primary">
              Security
            </Link>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Terms
            </a>
            <a href="mailto:contact@openmanus.app" className="text-sm text-muted-foreground hover:text-primary">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>);
}