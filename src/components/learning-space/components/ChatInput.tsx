import { ChevronDown, Sparkles } from "lucide-react";
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
      <div className="bg-muted/30 rounded-2xl p-3">
        {/* Top row with model selector and Learn+ button */}
        <div className="flex items-center gap-2 mb-3">
          {/* Model selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 text-sm px-2 py-1 h-auto font-normal">
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

          {/* Learn+ button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full bg-green-100 text-green-700 border-green-200 hover:bg-green-200 px-3 py-1 h-auto text-xs"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Learn+
          </Button>
        </div>

        {/* Text input */}
        <Input
          placeholder="问什么都可以..."
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          className="border-0 bg-transparent placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-base resize-none min-h-[60px]"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSendMessage();
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatInput;