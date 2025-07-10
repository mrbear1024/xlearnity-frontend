import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import AddContentDialog from "@/components/AddContentDialog";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddContent = () => {
    setIsAddContentOpen(true);
  };

  const handleStartChat = () => {
    sessionStorage.removeItem('chat_history'); // Clear previous chat history
    navigate('/learning-space?mode=chat');
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar onAddContent={handleAddContent} />
      <MainContent onAddContent={handleAddContent}>
        <Button onClick={handleStartChat} className="mt-4">开始聊天</Button>
      </MainContent>
      <AddContentDialog 
        open={isAddContentOpen} 
        onOpenChange={setIsAddContentOpen} 
      />
    </div>
  );
};

export default Index;
