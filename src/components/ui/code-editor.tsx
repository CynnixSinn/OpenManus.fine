import React from "react";
import { cn } from "@/lib/utils";

interface CodeEditorProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  className,
  ...props
}: CodeEditorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative rounded-md border border-border overflow-hidden">
      <div className="absolute top-2 right-2 px-2 py-1 text-xs font-mono bg-muted rounded text-muted-foreground">
        {language}
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        className={cn(
          "w-full h-full min-h-[300px] p-4 font-mono text-sm bg-card text-card-foreground resize-y",
          className
        )}
        spellCheck="false"
        {...props}
      />
    </div>
  );
}