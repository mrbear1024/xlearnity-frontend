import { ChevronDown, Sparkles, Globe, AtSign, Paperclip, Mic, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface ChatInputProps {
  chatMessage: string;
  setChatMessage: (message: string) => void;
  onSendMessage: () => void;
}

const ChatInput = ({ chatMessage, setChatMessage, onSendMessage }: ChatInputProps) => {
  const modelOptions = [
    { name: "Default", isPremium: false },
    { name: "Gemini 2.5 Flash", isPremium: false },
    { name: "Claude 4 Sonnet", isPremium: true },
    { name: "GPT-4.1", isPremium: true },
    { name: "Gemini 2.5 Pro", isPremium: true }
  ];

  const selectedModel = "Default";

  return (
    <div className="p-4 border-t border-border">
      {/* Input container with exact styling from the image */}
      <div className="bg-muted/10 rounded-3xl p-4 border border-border/50">
        <div className="flex items-center gap-3">
          {/* Model selector - Default with dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 text-sm px-3 py-2 h-auto font-normal rounded-full bg-background border border-border hover:bg-muted/50">
                {selectedModel}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {modelOptions.map((model) => (
                <DropdownMenuItem
                  key={model.name}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    {selectedModel === model.name && <span className="w-4 h-4 text-sm">✓</span>}
                    {selectedModel !== model.name && <span className="w-4" />}
                    {model.name}
                  </span>
                  {model.isPremium && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      升级
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Learn+ button - green with sparkles icon */}
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full bg-green-100 text-green-700 border-green-200 hover:bg-green-200 px-3 py-2 h-auto text-sm font-medium"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Learn+
          </Button>

          {/* 搜索 button - blue */}
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 px-3 py-2 h-auto text-sm font-medium"
          >
            <Globe className="h-3 w-3 mr-1" />
            搜索
          </Button>

          {/* Text input - flexible width */}
          <div className="flex-1">
            <Input
              placeholder="问什么都可以..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="border-0 bg-transparent placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-base h-auto py-0"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onSendMessage();
                }
              }}
            />
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            {/* @ symbol */}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-muted/50">
              <AtSign className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Paperclip */}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-muted/50">
              <Paperclip className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Microphone */}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-muted/50">
              <Mic className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Black circle send button */}
            <Button 
              onClick={onSendMessage}
              className="h-8 w-8 p-0 rounded-full bg-foreground hover:bg-foreground/90 text-background"
            >
              <Circle className="h-4 w-4 fill-current" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;