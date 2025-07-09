import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ActionButtonProps } from "@/types/ui";
import { cn } from "@/lib/utils";

const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  tooltip,
  className,
}: ActionButtonProps & { className?: string }) => {
  const sizeMap = {
    sm: "h-8 w-8 p-0",
    md: "h-10 w-10 p-0", 
    lg: "h-12 w-12 p-0",
  };

  const iconSizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const button = (
    <Button
      variant={variant === 'primary' ? 'default' : variant === 'secondary' ? 'secondary' : variant}
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full hover:bg-muted-foreground/10",
        sizeMap[size],
        className
      )}
      aria-label={label}
    >
      <Icon className={iconSizeMap[size]} />
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export default ActionButton;