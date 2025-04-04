import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ConsoleProps {
  output: string;
  className?: string;
  error?: boolean;
}

export function Console({ output, className, error = false }: ConsoleProps) {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div
      ref={consoleRef}
      className={cn(
        "w-full h-[300px] p-4 font-mono text-sm bg-black text-white overflow-y-auto rounded-md",
        error && "text-destructive",
        className
      )}
    >
      <pre className="whitespace-pre-wrap">{output || "No output yet..."}</pre>
    </div>
  );
}