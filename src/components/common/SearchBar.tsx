import { Input } from "@/components/ui/input";
import { SearchBarProps } from "@/types/ui";
import ActionButton from "./ActionButton";
import { cn } from "@/lib/utils";

const SearchBar = ({
  placeholder = "Search...",
  value,
  onChange,
  onSubmit,
  actions = [],
  disabled = false,
  className,
}: SearchBarProps & { className?: string }) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit(value);
    }
  };

  return (
    <div className={cn("relative bg-muted/50 rounded-3xl shadow-sm border border-border/50", className)}>
      {/* Input field */}
      <div className="px-6 py-4 flex items-center gap-3">
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/70"
        />
        
        {/* Primary submit action */}
        {actions.length > 0 && (
          <ActionButton
            {...actions[0]}
            variant="ghost"
            size="sm"
            className="bg-foreground text-background hover:bg-foreground/90"
          />
        )}
      </div>
      
      {/* Toolbar with additional actions */}
      {actions.length > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/30">
          <div className="flex items-center gap-2">
            {actions.slice(1).map((action, index) => (
              <ActionButton key={index} {...action} size="sm" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;