import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/layout/theme-provider";
import { ProjectProvider } from "./contexts/project-context";
import { ExecutionProvider } from "./contexts/execution-context";
import { ErrorBoundary } from "./components/error-boundary";
import { reportWebVitals } from "./lib/performance";
import "./index.css";

import Index from "./pages";
import LoginForm from "./pages/login";
import SignupForm from "./pages/signup";
import Logout from "./pages/logout";
import NewProject from "./pages/new-project";
import ProjectDetail from "./pages/project-detail";
import Settings from "./pages/settings";
import NotFound from "./pages/not-found";
import SecurityPolicy from "./pages/security-policy";

// Initialize performance monitoring
reportWebVitals();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <ProjectProvider>
            <ExecutionProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/signup" element={<SignupForm />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/new-project" element={<NewProject />} />
                  <Route path="/project/:projectId" element={<ProjectDetail />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/security-policy" element={<SecurityPolicy />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              <Sonner />
              <Toaster />
            </ExecutionProvider>
          </ProjectProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);