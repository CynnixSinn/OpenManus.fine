import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface CommandInputProps {
  onSubmit: (command: string) => void;
  isExecuting: boolean;
  placeholder?: string;
}

export function CommandInput({ onSubmit, isExecuting, placeholder = "Enter a command..." }: CommandInputProps) {
  const [command, setCommand] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim() && !isExecuting) {
      onSubmit(command);
      setCommand("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
      <Input
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder={placeholder}
        disabled={isExecuting}
        className="flex-1"
      />
      <Button type="submit" disabled={isExecuting || !command.trim()}>
        <Send className="h-4 w-4 mr-2" />
        Send
      </Button>
    </form>
  );
}