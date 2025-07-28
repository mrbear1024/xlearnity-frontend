import { BarChart3, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FlashcardItem from "./FlashcardItem";
import { useState } from "react";

interface Flashcard {
  id: number;
  title: string;
  term: string;
  definition: string;
  starred: boolean;
}

const FlashcardsTab = () => {
  const [flashcardsGenerated, setFlashcardsGenerated] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTerm, setNewCardTerm] = useState("");
  const [newCardDefinition, setNewCardDefinition] = useState("");

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

  const toggleStar = (id: number) => {
    setFlashcards(flashcards.map(card => 
      card.id === id ? { ...card, starred: !card.starred } : card
    ));
  };

  const deleteCard = (id: number) => {
    setFlashcards(flashcards.filter(card => card.id !== id));
  };

  if (!flashcardsGenerated) {
    return (
      <div className="flex-1 flex flex-col h-full">
        {/* 头部选项 */}
        <div className="p-4 flex justify-center gap-4 border-b border-border flex-shrink-0">
          <Button variant="ghost" size="sm" className="text-green-600">
            主动召回 新
          </Button>
          <Button variant="ghost" size="sm">
            快速回顾
          </Button>
        </div>

        {/* 内容区域 - 可滚动区域 */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6">
            {/* 今天的卡片统计 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">今天的卡片</h2>
              <Button variant="ghost" size="sm">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>

            {/* 卡片统计 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-muted/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-muted-foreground">新卡片</div>
              </div>
              <div className="bg-muted/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">8</div>
                <div className="text-sm text-muted-foreground">学习中</div>
              </div>
              <div className="bg-muted/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">24</div>
                <div className="text-sm text-muted-foreground">已掌握</div>
              </div>
            </div>

            {/* 生成卡片按钮 */}
            <div className="text-center">
              <Button 
                onClick={generateFlashcards}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                生成抽认卡
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                基于当前视频内容生成抽认卡
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* 头部选项 */}
      <div className="p-4 flex justify-center gap-4 border-b border-border flex-shrink-0">
        <Button variant="ghost" size="sm" className="text-green-600">
          主动召回 新
        </Button>
        <Button variant="ghost" size="sm">
          快速回顾
        </Button>
        <Button variant="ghost" size="sm">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* 卡片列表 - 可滚动区域 */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 space-y-4">
          {flashcards.map((card) => (
            <FlashcardItem
              key={card.id}
              card={card}
              term=""
              definition=""
              onTermChange={() => {}}
              onDefinitionChange={() => {}}
              onToggleStar={toggleStar}
              onDelete={deleteCard}
            />
          ))}

          {/* 添加新卡片 */}
          {isAddingCard ? (
            <FlashcardItem
              isEditing={true}
              term={newCardTerm}
              definition={newCardDefinition}
              onTermChange={setNewCardTerm}
              onDefinitionChange={setNewCardDefinition}
              onSave={addNewCard}
              onCancel={() => setIsAddingCard(false)}
            />
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
    </div>
  );
};

export default FlashcardsTab;