'use client';
import { X } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { groups, groupQuestions, type Locale, type Mode } from './questions';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
const modes: Mode[] = ['word', 'sentence', 'recall'];
export function CollectionDrawer({
  lang,
  open,
  onOpenChange,
  mode,
  onModeChange,
  currentId,
  currentGroupId,
  counts,
  onSelect,
}: {
  lang: Locale;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  currentId: string;
  currentGroupId: string;
  counts: Record<string, number>;
  onSelect: (mode: Mode, groupId: string, id: string) => void;
}) {
  const title = lang === 'en' ? 'Collection' : '集合';
  const names =
    lang === 'en' ? ['Words', 'Sentences', 'Recall'] : ['重组', '句子', '补回'];
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={true}>
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
              <Accordion
                key={`${open}-${m}-${currentGroupId}`}
                multiple={false}
                defaultValue={[
                  groups(m).some((g) => g.id === currentGroupId)
                    ? currentGroupId
                    : groups(m)[0].id,
                ]}
              >
                {groups(m).map((group, groupIndex) => (
                  <AccordionItem value={group.id} key={group.id}>
                    <AccordionTrigger className="group-trigger">
                      <span className="drawer-number">
                        {String(groupIndex + 1).padStart(2, '0')}
                      </span>
                      <span>{group.title[lang]}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      {groupQuestions(lang, m, group.id).map((q, i) => (
                        <button
                          className="drawer-question"
                          aria-current={q.id === currentId ? 'true' : undefined}
                          key={q.id}
                          onClick={() => onSelect(m, group.id, q.id)}
                        >
                          <span className="drawer-number">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="drawer-question-title">
                            {q.reference}
                          </span>
                          <span
                            className={`drawer-count ${counts[q.id] > 0 ? 'has-completions' : ''}`}
                            aria-label={
                              lang === 'en'
                                ? `Completed ${counts[q.id] ?? 0} times`
                                : `完成 ${counts[q.id] ?? 0} 次`
                            }
                          >
                            {counts[q.id] ?? 0}
                          </span>
                        </button>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
