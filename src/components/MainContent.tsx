import { Upload, Link, Mic, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface MainContentProps {
  onAddContent: () => void;
}

const MainContent = ({ onAddContent }: MainContentProps) => {
  const features = [
    {
      icon: Upload,
      title: "上传",
      description: "文件、音频、视频",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Link,
      title: "粘贴",
      description: "YouTube、网站、文本",
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      icon: Mic,
      title: "记录",
      description: "录制课堂、视频通话",
      color: "text-green-500",
      bgColor: "bg-green-50"
    }
  ];

  const continueStudying = [
    {
      id: 1,
      title: "LANGCHAIN IN 2025",
      thumbnail: "/lovable-uploads/44724c43-e237-487e-a306-21b296d2edf7.png",
      type: "video"
    },
    {
      id: 2,
      title: "Setup",
      thumbnail: "/api/placeholder/300/200",
      type: "document"
    },
    {
      id: 3,
      title: "今天演算法",
      thumbnail: "/api/placeholder/300/200",
      type: "document"
    },
    {
      id: 4,
      title: "The Road to AGI",
      thumbnail: "/api/placeholder/300/200",
      type: "video"
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="border-youlearn-primary text-youlearn-primary hover:bg-youlearn-primary hover:text-youlearn-primary-foreground"
            >
              升级
            </Button>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">⌘K</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl font-bold text-center mb-12">你想学什么?</h1>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-2 hover:border-youlearn-primary/20"
                onClick={onAddContent}
              >
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.bgColor} mb-4`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <Input
                placeholder="学习任何东西"
                className="w-full py-4 px-6 text-center border-2 border-muted focus:border-youlearn-primary transition-colors"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">Default</span>
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </div>
                <span className="text-sm">搜索</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Continue Learning Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">继续学习</h2>
            <Button variant="ghost" className="text-youlearn-primary hover:text-youlearn-primary">
              查看全部
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {continueStudying.map((item) => (
              <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-purple-500 to-blue-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{item.title}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainContent;