'use client';
import { Check, X } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { bank, type Locale, type Mode } from './questions';
const modes: Mode[] = ['word', 'sentence', 'recall'];
export function CollectionDrawer({
  lang,
  open,
  onOpenChange,
  mode,
  onModeChange,
  currentId,
  counts,
  onSelect,
}: {
  lang: Locale;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  currentId: string;
  counts: Record<string, number>;
  onSelect: (mode: Mode, id: string) => void;
}) {
  const title = lang === 'en' ? 'Collection' : '集合';
  const names =
    lang === 'en' ? ['Words', 'Sentences', 'Recall'] : ['重组', '句子', '补回'];
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal="trap-focus">
      <SheetTrigger className="collection-trigger" aria-label={title}>
        {title}
      </SheetTrigger>
      <SheetContent className="glass-drawer" showCloseButton={false}>
        <div className="drawer-heading">
          <SheetTitle>{title}</SheetTitle>
          <SheetClose
            className="drawer-close"
            aria-label={lang === 'en' ? 'Close collection' : '关闭集合'}
          >
            <X size={19} />
          </SheetClose>
        </div>
        <SheetDescription className="sr-only">
          {lang === 'en'
            ? 'Select a practice or close to return.'
            : '选择题目，或关闭后继续练习。'}
        </SheetDescription>
        <Tabs
          value={mode}
          onValueChange={(value) => onModeChange(value as Mode)}
          className="drawer-tabs"
        >
          <TabsList aria-label={lang === 'en' ? 'Practice mode' : '练习模式'}>
            {modes.map((m, i) => (
              <TabsTrigger value={m} key={m}>
                {names[i]}
              </TabsTrigger>
            ))}
          </TabsList>
          {modes.map((m) => (
            <TabsContent value={m} key={m} className="drawer-list">
              {bank(lang, m).map((q, i) => (
                <button
                  className="drawer-question"
                  aria-current={q.id === currentId ? 'true' : undefined}
                  key={q.id}
                  onClick={() => onSelect(m, q.id)}
                >
                  <span className="drawer-number">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="drawer-question-title">{q.reference}</span>
                  {counts[q.id] > 0 && (
                    <Check
                      size={15}
                      aria-label={lang === 'en' ? 'Completed' : '已完成'}
                    />
                  )}
                </button>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
