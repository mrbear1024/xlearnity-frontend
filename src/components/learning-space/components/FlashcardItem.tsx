import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Flashcard {
  id: number;
  title: string;
  term: string;
  definition: string;
  starred: boolean;
}

interface FlashcardItemProps {
  card?: Flashcard;
  isEditing?: boolean;
  term: string;
  definition: string;
  onTermChange: (value: string) => void;
  onDefinitionChange: (value: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  onToggleStar?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const FlashcardItem = ({
  card,
  isEditing = false,
  term,
  definition,
  onTermChange,
  onDefinitionChange,
  onSave,
  onCancel,
  onToggleStar,
  onDelete
}: FlashcardItemProps) => {
  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            卡片 {card?.id || '新'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => card && onToggleStar?.(card.id)}
            className="p-1"
          >
            <Star className={`h-4 w-4 ${card?.starred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
          </Button>
          {card && (
            <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => card ? onDelete?.(card.id) : onCancel?.()}
          className="p-1"
        >
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-red-500">学期 *</label>
          {isEditing ? (
            <Textarea
              placeholder="输入术语..."
              value={term}
              onChange={(e) => onTermChange(e.target.value)}
              className="mt-1"
              rows={2}
            />
          ) : (
            <div className="mt-1 p-3 bg-muted rounded-lg">
              <p className="text-sm">{card?.term}</p>
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-red-500">定义 *</label>
          {isEditing ? (
            <Textarea
              placeholder="输入定义..."
              value={definition}
              onChange={(e) => onDefinitionChange(e.target.value)}
              className="mt-1"
              rows={2}
            />
          ) : (
            <div className="mt-1 p-3 bg-muted rounded-lg">
              <p className="text-sm">{card?.definition}</p>
            </div>
          )}
          <Button variant="link" className="p-0 h-auto text-sm text-muted-foreground mt-2">
            显示更多选项
          </Button>
        </div>

        {isEditing && (
          <div className="flex gap-2 pt-2">
            <Button onClick={onSave} size="sm">
              保存卡片
            </Button>
            <Button variant="outline" size="sm" onClick={onCancel}>
              取消
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardItem;