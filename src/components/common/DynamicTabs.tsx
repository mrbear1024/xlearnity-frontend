import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicTabsProps } from "@/types/ui";
import { cn } from "@/lib/utils";

const DynamicTabs = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}: DynamicTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className={cn("w-full", className)}>
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            disabled={tab.disabled}
            className="flex flex-col items-center gap-1 text-xs"
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="flex-1 flex flex-col m-0 p-0">
          <tab.component />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default DynamicTabs;