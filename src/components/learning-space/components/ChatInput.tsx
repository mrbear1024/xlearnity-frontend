import { ChevronDown, Sparkles, Globe, AtSign, Paperclip, Mic, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

interface ChatInputProps {
  chatMessage: string;
  setChatMessage: (message: string) => void;
  onSendMessage: () => void;
}

const ChatInput = ({ chatMessage, setChatMessage, onSendMessage }: ChatInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const { t } = useLanguage();
  
  const modelOptions = [
    { name: t('models.default'), isPremium: false },
    { name: t('models.gemini25Flash'), isPremium: false },
    { name: t('models.claude4Sonnet'), isPremium: true },
    { name: t('models.gpt41'), isPremium: true },
    { name: t('models.gemini25Pro'), isPremium: true }
  ];

  const selectedModel = t('models.default');

  return (
    <div className="p-4 border-t border-border">
      {/* Input container with responsive design */}
      <div className="bg-muted/10 rounded-3xl border border-border/50">
        {/* Input section at top */}
        <div className="px-4 py-3">
          <Input
            placeholder={t('chat.inputPlaceholder')}
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="border-0 bg-transparent placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-base h-auto py-2 min-h-[40px] w-full outline-none focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSendMessage();
              }
            }}
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        {/* Icons section at bottom - 有焦点时显示，无焦点时隐藏 */}
        <div className={`flex items-center justify-between px-4 pb-3 pt-2 border-t border-border/30 transition-all duration-300 ease-in-out overflow-hidden ${
          isFocused ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          {/* Left side icons */}
          <div className="flex items-center gap-2">
            {/* Model selector dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full bg-background border border-border hover:bg-muted/50">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-background border border-border shadow-lg z-50">
                {modelOptions.map((model) => (
                  <DropdownMenuItem
                    key={model.name}
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => console.log(`Selected model: ${model.name}`)}
                  >
                    <span className="flex items-center gap-2">
                      {selectedModel === model.name && <span className="w-4 h-4 text-sm">✓</span>}
                      {selectedModel !== model.name && <span className="w-4" />}
                      {model.name}
                    </span>
                    {model.isPremium && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        {t('models.upgrade')}
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
              className="h-8 w-8 p-0 rounded-full bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
              onClick={() => console.log('Learn+ clicked')}
            >
              <Sparkles className="h-4 w-4" />
            </Button>

            {/* Search button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
              onClick={() => console.log('Search clicked')}
            >
              <Globe className="h-4 w-4" />
            </Button>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            {/* @ symbol */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full hover:bg-muted/50"
              onClick={() => console.log('@ clicked')}
            >
              <AtSign className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Paperclip */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full hover:bg-muted/50"
              onClick={() => console.log('Attach file clicked')}
            >
              <Paperclip className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Microphone */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full hover:bg-muted/50"
              onClick={() => console.log('Voice record clicked')}
            >
              <Mic className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Send button */}
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