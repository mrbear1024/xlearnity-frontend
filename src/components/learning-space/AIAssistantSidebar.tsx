import { Send, MessageCircle, CreditCard, BarChart3, FileEdit, Sparkles, BookOpen, Brain, Eye, Clock, Star, Trash2, Plus, Download, ChevronDown, Paperclip, Mic, Search, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Flashcard {
  id: number;
  title: string;
  term: string;
  definition: string;
  starred: boolean;
}

interface ChatMessage {
  id: number;
  type: string;
  content: string;
}

interface AIAssistantSidebarProps {
  activeRightTab: string;
  setActiveRightTab: (tab: string) => void;
  chatMessage: string;
  setChatMessage: (message: string) => void;
  chatMessages: ChatMessage[];
}

const AIAssistantSidebar = ({
  activeRightTab,
  setActiveRightTab,
  chatMessage,
  setChatMessage,
  chatMessages
}: AIAssistantSidebarProps) => {
  // 模型选择状态
  const [selectedModel, setSelectedModel] = useState("Default");
  
  // 抽认卡状态管理
  const [flashcardsGenerated, setFlashcardsGenerated] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTerm, setNewCardTerm] = useState("");
  const [newCardDefinition, setNewCardDefinition] = useState("");

  // 模型选项
  const modelOptions = [
    { name: "Default", isPremium: false },
    { name: "Gemini 2.5 Flash", isPremium: false },
    { name: "Claude 4 Sonnet", isPremium: true },
    { name: "GPT-4.1", isPremium: true },
    { name: "Gemini 2.5 Pro", isPremium: true }
  ];

  const handleSendMessage = () => {
    console.log('Send message:', chatMessage);
    setChatMessage('');
  };

  // 生成模拟抽认卡
  const generateFlashcards = () => {
    const mockCards: Flashcard[] = [
      {
        id: 1,
        title: "AI Job Uncertainty",
        term: "人工智能在求职者中制造了什么样的不确定感?",
        definition: "人们不确定之前认为可用的工作是否仍然会存在",
        starred: false
      },
      {
        id: 2,
        title: "AI Job Uncertainty",
        term: "人们在人工智能背景下对所有权表达了什么担忧",
        definition: "担心失去对工作和技能的控制权",
        starred: false
      },
      {
        id: 3,
        title: "Coinbase Strategy",
        term: "Coinbase 是如何体现小众市场起步的概念的?",
        definition: "Coinbase 的起步是针对想要简单购买和持有比特币的人群",
        starred: false
      },
      {
        id: 38,
        title: "Niche Market Strategy",
        term: "在人工智能的背景下，聚焦小众市场特别重要的",
        definition: "在人工智能领域聚集于小众市场是重要的，因为这样可以更好地服务特定用户群体",
        starred: false
      }
    ];
    setFlashcards(mockCards);
    setFlashcardsGenerated(true);
  };

  // 添加新卡片
  const addNewCard = () => {
    if (newCardTerm.trim() && newCardDefinition.trim()) {
      const newCard: Flashcard = {
        id: flashcards.length + 1,
        title: `Card ${flashcards.length + 1}`,
        term: newCardTerm,
        definition: newCardDefinition,
        starred: false
      };
      setFlashcards([...flashcards, newCard]);
      setNewCardTerm("");
      setNewCardDefinition("");
      setIsAddingCard(false);
    }
  };

  // 切换收藏状态
  const toggleStar = (id: number) => {
    setFlashcards(flashcards.map(card => 
      card.id === id ? { ...card, starred: !card.starred } : card
    ));
  };

  // 删除卡片
  const deleteCard = (id: number) => {
    setFlashcards(flashcards.filter(card => card.id !== id));
  };

  return (
    <div className="h-full flex flex-col">
      {/* AI Assistant Header */}
      <div className="p-4 border-b border-border">
        <Tabs value={activeRightTab} onValueChange={setActiveRightTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat" className="flex flex-col items-center gap-1 text-xs">
              <MessageCircle className="h-4 w-4" />
              聊天
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex flex-col items-center gap-1 text-xs">
              <CreditCard className="h-4 w-4" />
              抽认卡
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex flex-col items-center gap-1 text-xs">
              <BarChart3 className="h-4 w-4" />
              测验
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex flex-col items-center gap-1 text-xs">
              <FileEdit className="h-4 w-4" />
              摘要
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeRightTab} className="flex-1 flex flex-col">
          {/* Chat Tab */}
          <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-0">
            <div className="flex-1 flex flex-col">
              {/* AI Assistant Welcome */}
              <div className="p-4 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">与人工智能辅导员一起学习</h3>
              </div>

              {/* Learning Tools Grid */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-xs">小测验</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span className="text-xs">思维导图</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">语音模式</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-xs">抽认卡</span>
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center gap-1">
                    <FileEdit className="h-3 w-3" />
                    <span className="text-xs">抽认卡</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    <span className="text-xs">搜索</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">时间表</span>
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-border">
                <div className="bg-muted/30 rounded-2xl p-4 space-y-3">
                  {/* Input area */}
                  <div className="flex items-center gap-3">
                    {/* Model selector */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 text-sm px-3 py-2 h-auto">
                          {selectedModel}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        {modelOptions.map((model) => (
                          <DropdownMenuItem
                            key={model.name}
                            className="flex items-center justify-between"
                            onClick={() => setSelectedModel(model.name)}
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
                      className="rounded-full bg-green-100 text-green-700 border-green-200 hover:bg-green-200 px-4"
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      Learn+
                    </Button>

                    {/* Search button */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 px-4"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      搜索
                    </Button>

                    <Button variant="ghost" size="sm" className="text-muted-foreground p-2">
                      <span className="text-lg">@</span>
                    </Button>

                    <div className="flex-1" />

                    {/* Right side buttons */}
                    <Button variant="ghost" size="sm" className="text-muted-foreground p-2">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="text-muted-foreground p-2">
                      <Mic className="h-4 w-4" />
                    </Button>

                    <Button 
                      size="sm" 
                      className="rounded-full bg-black text-white hover:bg-gray-800 p-3"
                    >
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full ml-0.5"></div>
                          <div className="w-1 h-1 bg-white rounded-full ml-0.5"></div>
                        </div>
                      </div>
                    </Button>
                  </div>

                  {/* Text input */}
                  <Input
                    placeholder="问什么都可以..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="border-0 bg-transparent placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-base"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Flashcards Tab */}
          <TabsContent value="flashcards" className="flex-1 flex flex-col m-0 p-0">
            {!flashcardsGenerated ? (
              // 初始界面
              <div className="flex-1 flex flex-col">
                {/* 头部选项 */}
                <div className="p-4 flex justify-center gap-4 border-b border-border">
                  <Button variant="ghost" size="sm" className="text-green-600">
                    主动召回 新
                  </Button>
                  <Button variant="ghost" size="sm">
                    快速回顾
                  </Button>
                </div>

                {/* 今天的卡片统计 */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium">今天的卡片</h2>
                    <Button variant="ghost" size="sm">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* 统计圆圈和数据 */}
                  <div className="flex items-center justify-center mb-8">
                    <div className="w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center mr-8">
                      <span className="text-4xl font-light text-muted-foreground">0</span>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                          <span className="text-sm">✕</span>
                        </div>
                        <div>
                          <span className="text-xl font-medium">20</span>
                          <p className="text-sm text-muted-foreground">未研究</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center">
                          <span className="text-sm text-white">✓</span>
                        </div>
                        <div>
                          <span className="text-xl font-medium">0</span>
                          <p className="text-sm text-muted-foreground">审查</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 学习卡按钮 */}
                  <Button 
                    className="w-full py-6 text-lg" 
                    onClick={generateFlashcards}
                  >
                    学习卡
                  </Button>
                </div>

                {/* 甲板进度 */}
                <div className="p-6 border-t border-border">
                  <h3 className="font-medium mb-4">甲板进度</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-2 h-2 rounded-full bg-muted"></div>
                    <span className="text-sm">38 未研究</span>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">0 审查</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-0"></div>
                  </div>
                </div>
              </div>
            ) : (
              // 卡片列表界面
              <div className="flex-1 flex flex-col">
                {/* 头部控制栏 */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">抽认卡 ({flashcards.length})</h2>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        全部撤销
                      </Button>
                      <Button variant="secondary" size="sm">
                        已完成
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 卡片列表 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {flashcards.map((card) => (
                    <div key={card.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">卡片 {card.id}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleStar(card.id)}
                            className="p-1"
                          >
                            <Star className={`h-4 w-4 ${card.starred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                          </Button>
                          <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCard(card.id)}
                          className="p-1"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-red-500">学期 *</label>
                          <div className="mt-1 p-3 bg-muted rounded-lg">
                            <p className="text-sm">{card.term}</p>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-red-500">定义 *</label>
                          <div className="mt-1 p-3 bg-muted rounded-lg">
                            <p className="text-sm">{card.definition}</p>
                          </div>
                          <Button variant="link" className="p-0 h-auto text-sm text-muted-foreground mt-2">
                            显示更多选项
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* 添加新卡片 */}
                  {isAddingCard ? (
                    <div className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">卡片 {flashcards.length + 1}</span>
                          <Button variant="ghost" size="sm" className="p-1">
                            <Star className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsAddingCard(false)}
                          className="p-1"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-red-500">学期 *</label>
                          <Textarea
                            placeholder="输入术语..."
                            value={newCardTerm}
                            onChange={(e) => setNewCardTerm(e.target.value)}
                            className="mt-1"
                            rows={2}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-red-500">定义 *</label>
                          <Textarea
                            placeholder="输入定义..."
                            value={newCardDefinition}
                            onChange={(e) => setNewCardDefinition(e.target.value)}
                            className="mt-1"
                            rows={2}
                          />
                          <Button variant="link" className="p-0 h-auto text-sm text-muted-foreground mt-2">
                            显示更多选项
                          </Button>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button onClick={addNewCard} size="sm">
                            保存卡片
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setIsAddingCard(false)}>
                            取消
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full p-8 border-2 border-dashed border-border hover:border-primary/50 transition-colors"
                      onClick={() => setIsAddingCard(true)}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      添加卡片
                    </Button>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz" className="flex-1 flex flex-col m-0 p-0">
            <div className="flex-1 flex flex-col">
              {/* Quiz Welcome */}
              <div className="p-4 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">与人工智能辅导员一起学习</h3>
              </div>

              {/* Learning Tools Grid */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-xs">小测验</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span className="text-xs">思维导图</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">语音模式</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-xs">抽认卡</span>
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center gap-1">
                    <FileEdit className="h-3 w-3" />
                    <span className="text-xs">抽认卡</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    <span className="text-xs">搜索</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">时间表</span>
                  </Button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">测验功能</h3>
                    <p className="text-sm text-muted-foreground mb-4">基于视频内容生成测验题目</p>
                    <Button>开始测验</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="flex-1 flex flex-col m-0 p-0">
            <div className="flex-1 flex flex-col">
              {/* Summary Welcome */}
              <div className="p-4 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileEdit className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">与人工智能辅导员一起学习</h3>
              </div>

              {/* Learning Tools Grid */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-xs">小测验</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span className="text-xs">思维导图</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">语音模式</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-xs">抽认卡</span>
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center gap-1">
                    <FileEdit className="h-3 w-3" />
                    <span className="text-xs">抽认卡</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    <span className="text-xs">搜索</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">时间表</span>
                  </Button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <FileEdit className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">摘要功能</h3>
                    <p className="text-sm text-muted-foreground mb-4">获取视频的关键要点总结</p>
                    <Button>生成摘要</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIAssistantSidebar;