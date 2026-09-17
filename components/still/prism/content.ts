import type { Locale, Question, LengthTier } from '../questions';
import { shuffle } from './engine';

const words: Record<Locale, string[]> = {
  'zh-CN': [
    '追光者',
    '向着山顶出发',
    '穿过风雨前行',
    '在舞台上起舞',
    '让脚步追上风',
    '沿着星光奔向远方',
  ],
  en: ['spark', 'explore', 'momentum', 'spotlight', 'electric', 'breakthrough'],
};
const sentences: Record<Locale, string[]> = {
  'zh-CN': [
    '鼓点响起|我们一起|奔向舞台',
    '聚光灯亮起|我们|踏着鼓点|走向舞台|迎接新的挑战',
    '穿过山谷|迎着晨风|我们|沿着山脊|寻找更远的方向',
    '把帆升起|让海风|带着我们|越过浪尖|看见新的海岸',
    '夜色降临|伙伴们|点亮营火|用歌声|回应远处的群山',
    '当晨光|照进山谷|我们背起行囊|跨过溪流|沿着山路|继续前进|迎接山顶的晨风',
  ],
  en: [
    'Follow the rhythm|and step|into the light',
    'The crowd|falls silent|as we|step forward|into the spotlight',
    'We raise|our sails|and let|the wind|carry us beyond the harbor',
    'With every stride|we find|a new reason|to keep|moving forward',
    'Our footsteps|echo together|as the trail|climbs above|the sleeping valley',
    'When the lights|come on|we take|one breath|step onto the stage|and let|our voices rise',
  ],
};
const tiers: LengthTier[] = [
  'short',
  'medium',
  'medium',
  'medium',
  'medium',
  'long',
];
export function prismBank(locale: Locale): Question[] {
  return (['word', 'sentence'] as const).flatMap((mode) =>
    (mode === 'word' ? words : sentences)[locale].map((row, i) => {
      const answer = mode === 'word' ? Array.from(row) : row.split('|');
      const id = `prism-v1-${locale}-${mode}-${i + 1}`;
      return {
        id,
        mode,
        lengthTier: tiers[i],
        reference: answer.join(
          locale === 'en' && mode === 'sentence' ? ' ' : '',
        ),
        answers: [answer],
        blocks: answer.map((text, j) => ({ id: `${id}-${j}`, text })),
      };
    }),
  );
}
export function deal(q: Question): Question {
  return { ...q, blocks: shuffle(q.blocks) };
}
