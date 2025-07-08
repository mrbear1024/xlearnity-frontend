import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import AddContentDialog from "@/components/AddContentDialog";

const Index = () => {
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);

  const handleAddContent = () => {
    setIsAddContentOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar onAddContent={handleAddContent} />
      <MainContent onAddContent={handleAddContent} />
      <AddContentDialog 
        open={isAddContentOpen} 
        onOpenChange={setIsAddContentOpen} 
      />
    </div>
  );
};

export default Index;
