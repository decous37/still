export type Mode = 'word' | 'sentence' | 'recall';
export type Locale = 'en' | 'zh-CN';

export type Question = {
  id: string;
  mode: Mode;
  reference: string;
  blocks: { id: string; text: string }[];
  answers: string[][];
  before?: string;
  after?: string;
};

type WordItem = { id: string; text: string };
type SentenceItem = { id: string; blocks: string[]; answers?: string[][] };
type RecallItem = {
  id: string;
  before: string;
  answer: string;
  after: string;
  distractors: [string, string];
};

function stripEndingPeriod(text: string) {
  return text.replace(/[。.]$/, '');
}

export function stripSentenceEnding(text: string) {
  return text.replace(
    /[。.!！?？…]+(?=[。.!！?？…”’"'」』）)\]】]*\s*$)/gu,
    '',
  );
}

const words: Record<Locale, WordItem[]> = {
  en: [
    { id: 'en-word-0', text: 'PAUSE' },
    { id: 'en-word-1', text: 'CALM' },
    { id: 'en-word-2', text: 'SLOW' },
    { id: 'en-word-3', text: 'SPACE' },
    { id: 'en-word-4', text: 'LIGHT' },
    { id: 'en-word-5', text: 'BREATHE' },
    { id: 'en-word-6', text: 'MOMENT' },
    { id: 'en-word-7', text: 'GENTLE' },
    { id: 'en-word-8', text: 'QUIET' },
    { id: 'en-word-9', text: 'REST' },
    { id: 'en-word-10', text: 'EASE' },
    { id: 'en-word-11', text: 'STILL' },
    { id: 'en-word-12', text: 'RIVER' },
    { id: 'en-word-13', text: 'CANDLE' },
    { id: 'en-word-14', text: 'WINDOW' },
    { id: 'en-word-15', text: 'LEAF' },
    { id: 'en-word-16', text: 'STONE' },
    { id: 'en-word-17', text: 'GARDEN' },
    { id: 'en-word-18', text: 'PENCIL' },
    { id: 'en-word-19', text: 'CLOUD' },
    { id: 'en-word-20', text: 'BASKET' },
    { id: 'en-word-21', text: 'BUTTON' },
    { id: 'en-word-22', text: 'STREAM' },
    { id: 'en-word-23', text: 'FLOWER' },
    { id: 'en-word-24', text: 'BRANCH' },
    { id: 'en-word-25', text: 'FABRIC' },
    { id: 'en-word-26', text: 'LANTERN' },
    { id: 'en-word-27', text: 'POCKET' },
    { id: 'en-word-28', text: 'MEADOW' },
    { id: 'en-word-29', text: 'HUMBLE' },
    { id: 'en-word-30', text: 'BREEZE' },
    { id: 'en-word-31', text: 'MARBLE' },
    { id: 'en-word-32', text: 'NARROW' },
    { id: 'en-word-33', text: 'SILVER' },
  ],
  'zh-CN': [
    { id: 'zh-CN-word-0', text: '慢慢来' },
    { id: 'zh-CN-word-1', text: '静一静' },
    { id: 'zh-CN-word-2', text: '留白' },
    { id: 'zh-CN-word-3', text: '轻轻放下' },
    { id: 'zh-CN-word-4', text: '看一看' },
    { id: 'zh-CN-word-5', text: '深呼吸' },
    { id: 'zh-CN-word-6', text: '一小步' },
    { id: 'zh-CN-word-7', text: '不着急' },
    { id: 'zh-CN-word-8', text: '此时此刻' },
    { id: 'zh-CN-word-9', text: '听听风' },
    { id: 'zh-CN-word-10', text: '片刻安静' },
    { id: 'zh-CN-word-11', text: '慢一点' },
    { id: 'zh-CN-word-12', text: '青石路' },
    { id: 'zh-CN-word-13', text: '小木桌' },
    { id: 'zh-CN-word-14', text: '旧书页' },
    { id: 'zh-CN-word-15', text: '一盏灯' },
    { id: 'zh-CN-word-16', text: '纸风车' },
    { id: 'zh-CN-word-17', text: '白瓷杯' },
    { id: 'zh-CN-word-18', text: '木铅笔' },
    { id: 'zh-CN-word-19', text: '窗边雨' },
    { id: 'zh-CN-word-20', text: '浅水湾' },
    { id: 'zh-CN-word-21', text: '蓝布包' },
    { id: 'zh-CN-word-22', text: '细竹篮' },
    { id: 'zh-CN-word-23', text: '小纸船' },
    { id: 'zh-CN-word-24', text: '暖手炉' },
    { id: 'zh-CN-word-25', text: '青草地' },
    { id: 'zh-CN-word-26', text: '石阶旁' },
    { id: 'zh-CN-word-27', text: '半扇窗' },
    { id: 'zh-CN-word-28', text: '水声轻' },
    { id: 'zh-CN-word-29', text: '薄荷叶' },
    { id: 'zh-CN-word-30', text: '新毛巾' },
    { id: 'zh-CN-word-31', text: '小圆盘' },
    { id: 'zh-CN-word-32', text: '玻璃瓶' },
    { id: 'zh-CN-word-33', text: '淡云影' },
  ],
};

const sentences: Record<Locale, SentenceItem[]> = {
  en: [
    { id: 'en-sentence-0', blocks: ['Take', 'a short', 'break'] },
    { id: 'en-sentence-1', blocks: ['Leave', 'a little', 'space'] },
    { id: 'en-sentence-2', blocks: ['Open', 'the window', 'gently'] },
    { id: 'en-sentence-3', blocks: ['Put', 'the book', 'here'] },
    { id: 'en-sentence-4', blocks: ['Watch', 'the clouds', 'drift'] },
    { id: 'en-sentence-5', blocks: ['Let', 'the light', 'in'] },
    { id: 'en-sentence-6', blocks: ['Read', 'one line', 'slowly'] },
    { id: 'en-sentence-7', blocks: ['Hold', 'the warm', 'cup'] },
    { id: 'en-sentence-8', blocks: ['Listen', 'to the', 'rain'] },
    { id: 'en-sentence-9', blocks: ['Give', 'yourself', 'a moment'] },
    { id: 'en-sentence-10', blocks: ['Let', 'your shoulders', 'relax'] },
    { id: 'en-sentence-11', blocks: ['Take', 'one small', 'step'] },
    { id: 'en-sentence-12', blocks: ['Place', 'the keys', 'by the bowl'] },
    { id: 'en-sentence-13', blocks: ['Fold', 'the blue', 'cloth'] },
    { id: 'en-sentence-14', blocks: ['Carry', 'the basket', 'inside'] },
    { id: 'en-sentence-15', blocks: ['Trace', 'the line', 'with care'] },
    { id: 'en-sentence-16', blocks: ['Set', 'the pencil', 'down'] },
    { id: 'en-sentence-17', blocks: ['Turn', 'the page', 'slowly'] },
    { id: 'en-sentence-18', blocks: ['Notice', 'the pale', 'moon'] },
    { id: 'en-sentence-19', blocks: ['Brush', 'dust', 'from the shelf'] },
    { id: 'en-sentence-20', blocks: ['Keep', 'the door', 'half open'] },
    { id: 'en-sentence-21', blocks: ['Pour', 'water', 'into the glass'] },
    { id: 'en-sentence-22', blocks: ['Smooth', 'the paper', 'flat'] },
    { id: 'en-sentence-23', blocks: ['Look', 'across', 'the quiet street'] },
    { id: 'en-sentence-24', blocks: ['Place', 'a stone', 'near the path'] },
    { id: 'en-sentence-25', blocks: ['Tie', 'the ribbon', 'loosely'] },
    { id: 'en-sentence-26', blocks: ['Watch', 'steam', 'rise from tea'] },
    { id: 'en-sentence-27', blocks: ['Close', 'the drawer', 'softly'] },
    { id: 'en-sentence-28', blocks: ['Mark', 'today', 'on the calendar'] },
    { id: 'en-sentence-29', blocks: ['Let', 'the candle', 'burn low'] },
    { id: 'en-sentence-30', blocks: ['Move', 'the chair', 'near the window'] },
    { id: 'en-sentence-31', blocks: ['Wash', 'one apple', 'at the sink'] },
    { id: 'en-sentence-32', blocks: ['Rest', 'the brush', 'on the tray'] },
    { id: 'en-sentence-33', blocks: ['Step', 'around', 'the puddle'] },
  ],
  'zh-CN': [
    { id: 'zh-CN-sentence-0', blocks: ['给自己', '留一点', '空白'] },
    { id: 'zh-CN-sentence-1', blocks: ['把', '书本', '轻轻合上'] },
    { id: 'zh-CN-sentence-2', blocks: ['慢慢地', '打开', '窗户'] },
    { id: 'zh-CN-sentence-3', blocks: ['让', '阳光', '照进来'] },
    { id: 'zh-CN-sentence-4', blocks: ['听听', '窗外的', '雨声'] },
    { id: 'zh-CN-sentence-5', blocks: ['把', '杯子', '放在桌上'] },
    { id: 'zh-CN-sentence-6', blocks: ['给', '这句话', '一点时间'] },
    { id: 'zh-CN-sentence-7', blocks: ['看着', '白云', '慢慢飘过'] },
    { id: 'zh-CN-sentence-8', blocks: ['让', '肩膀', '放松下来'] },
    { id: 'zh-CN-sentence-9', blocks: ['先', '读完', '这一行'] },
    { id: 'zh-CN-sentence-10', blocks: ['我们', '一起', '慢慢走'] },
    {
      id: 'zh-CN-sentence-11',
      blocks: ['今天', '我', '在家看书'],
      answers: [
        ['今天', '我', '在家看书'],
        ['我', '今天', '在家看书'],
      ],
    },
    { id: 'zh-CN-sentence-12', blocks: ['把钥匙', '放进', '小碗里'] },
    { id: 'zh-CN-sentence-13', blocks: ['沿着', '石阶', '往上走'] },
    { id: 'zh-CN-sentence-14', blocks: ['把蓝布', '叠成', '方块'] },
    { id: 'zh-CN-sentence-15', blocks: ['用铅笔', '画一条', '细线'] },
    { id: 'zh-CN-sentence-16', blocks: ['把窗帘', '拉开', '一半'] },
    { id: 'zh-CN-sentence-17', blocks: ['让茶水', '慢慢', '变温'] },
    { id: 'zh-CN-sentence-18', blocks: ['小路旁', '开着', '白花'] },
    { id: 'zh-CN-sentence-19', blocks: ['把纸张', '铺平', '在桌上'] },
    { id: 'zh-CN-sentence-20', blocks: ['风吹过', '浅浅的', '水面'] },
    { id: 'zh-CN-sentence-21', blocks: ['把椅子', '挪到', '窗边'] },
    { id: 'zh-CN-sentence-22', blocks: ['给花瓶', '换上', '清水'] },
    { id: 'zh-CN-sentence-23', blocks: ['把抽屉', '轻轻', '推回去'] },
    { id: 'zh-CN-sentence-24', blocks: ['在日历上', '圈出', '今天'] },
    { id: 'zh-CN-sentence-25', blocks: ['把苹果', '洗净', '放好'] },
    { id: 'zh-CN-sentence-26', blocks: ['屋檐下', '滴着', '雨水'] },
    { id: 'zh-CN-sentence-27', blocks: ['用手指', '抹去', '灰尘'] },
    { id: 'zh-CN-sentence-28', blocks: ['把丝带', '松松', '系好'] },
    { id: 'zh-CN-sentence-29', blocks: ['白瓷盘', '放在', '木桌上'] },
    { id: 'zh-CN-sentence-30', blocks: ['灯光落在', '旧书', '边上'] },
    { id: 'zh-CN-sentence-31', blocks: ['小纸船', '顺着', '水流走'] },
    { id: 'zh-CN-sentence-32', blocks: ['把毛巾', '挂回', '架子上'] },
    { id: 'zh-CN-sentence-33', blocks: ['云影', '慢慢', '移过墙面'] },
  ],
};

const recall: Record<Locale, RecallItem[]> = {
  en: [
    {
      id: 'en-recall-0',
      before: 'Let the ',
      answer: 'morning',
      after: ' light in.',
      distractors: ['evening', 'soft'],
    },
    {
      id: 'en-recall-1',
      before: 'Put the cup on the ',
      answer: 'table',
      after: '.',
      distractors: ['shelf', 'tray'],
    },
    {
      id: 'en-recall-2',
      before: 'A ',
      answer: 'small',
      after: ' bird sits outside.',
      distractors: ['quiet', 'blue'],
    },
    {
      id: 'en-recall-3',
      before: 'The book has a ',
      answer: 'green',
      after: ' cover.',
      distractors: ['blue', 'red'],
    },
    {
      id: 'en-recall-4',
      before: 'The room feels ',
      answer: 'quiet',
      after: ' today.',
      distractors: ['warm', 'bright'],
    },
    {
      id: 'en-recall-5',
      before: 'Leave the door ',
      answer: 'open',
      after: '.',
      distractors: ['closed', 'still'],
    },
    {
      id: 'en-recall-6',
      before: 'We walk by the ',
      answer: 'river',
      after: '.',
      distractors: ['garden', 'window'],
    },
    {
      id: 'en-recall-7',
      before: 'The tea is still ',
      answer: 'warm',
      after: '.',
      distractors: ['cold', 'fresh'],
    },
    {
      id: 'en-recall-8',
      before: 'A leaf falls ',
      answer: 'slowly',
      after: '.',
      distractors: ['softly', 'gently'],
    },
    {
      id: 'en-recall-9',
      before: 'Read the ',
      answer: 'first',
      after: ' line again.',
      distractors: ['last', 'next'],
    },
    {
      id: 'en-recall-10',
      before: 'The sky is ',
      answer: 'clear',
      after: ' now.',
      distractors: ['grey', 'blue'],
    },
    {
      id: 'en-recall-11',
      before: 'Rest your hands on your ',
      answer: 'knees',
      after: '.',
      distractors: ['desk', 'lap'],
    },
    {
      id: 'en-recall-12',
      before: 'The candle sits near the ',
      answer: 'mirror',
      after: '.',
      distractors: ['drawer', 'basket'],
    },
    {
      id: 'en-recall-13',
      before: 'A pencil rolls under the ',
      answer: 'chair',
      after: '.',
      distractors: ['plate', 'clock'],
    },
    {
      id: 'en-recall-14',
      before: 'The garden path feels ',
      answer: 'narrow',
      after: '.',
      distractors: ['silver', 'round'],
    },
    {
      id: 'en-recall-15',
      before: 'Steam rises from the ',
      answer: 'kettle',
      after: '.',
      distractors: ['pillow', 'button'],
    },
    {
      id: 'en-recall-16',
      before: 'The window holds a ',
      answer: 'shadow',
      after: '.',
      distractors: ['handle', 'flower'],
    },
    {
      id: 'en-recall-17',
      before: 'Place the stone beside the ',
      answer: 'path',
      after: '.',
      distractors: ['lamp', 'page'],
    },
    {
      id: 'en-recall-18',
      before: 'A clean towel hangs on the ',
      answer: 'rail',
      after: '.',
      distractors: ['roof', 'step'],
    },
    {
      id: 'en-recall-19',
      before: 'The apple rests in the ',
      answer: 'bowl',
      after: '.',
      distractors: ['jar', 'bag'],
    },
    {
      id: 'en-recall-20',
      before: 'The blue cloth covers the ',
      answer: 'basket',
      after: '.',
      distractors: ['window', 'pencil'],
    },
    {
      id: 'en-recall-21',
      before: 'Rain gathers near the ',
      answer: 'curb',
      after: '.',
      distractors: ['cup', 'door'],
    },
    {
      id: 'en-recall-22',
      before: 'The notebook lies open on the ',
      answer: 'desk',
      after: '.',
      distractors: ['floor', 'shelf'],
    },
    {
      id: 'en-recall-23',
      before: 'A ribbon circles the ',
      answer: 'box',
      after: '.',
      distractors: ['mug', 'leaf'],
    },
    {
      id: 'en-recall-24',
      before: 'The lantern glows after ',
      answer: 'sunset',
      after: '.',
      distractors: ['breakfast', 'winter'],
    },
    {
      id: 'en-recall-25',
      before: 'A soft breeze moves the ',
      answer: 'curtain',
      after: '.',
      distractors: ['calendar', 'marble'],
    },
    {
      id: 'en-recall-26',
      before: 'The brush waits on the ',
      answer: 'tray',
      after: '.',
      distractors: ['hill', 'road'],
    },
    {
      id: 'en-recall-27',
      before: 'The glass catches a thin ',
      answer: 'spark',
      after: '.',
      distractors: ['thread', 'stone'],
    },
    {
      id: 'en-recall-28',
      before: 'One shell rests in my ',
      answer: 'pocket',
      after: '.',
      distractors: ['garden', 'corner'],
    },
    {
      id: 'en-recall-29',
      before: 'The calendar marks a ',
      answer: 'quiet',
      after: ' day.',
      distractors: ['wooden', 'silver'],
    },
    {
      id: 'en-recall-30',
      before: 'A branch taps the ',
      answer: 'roof',
      after: '.',
      distractors: ['bowl', 'tray'],
    },
    {
      id: 'en-recall-31',
      before: 'The paper boat follows the ',
      answer: 'stream',
      after: '.',
      distractors: ['button', 'drawer'],
    },
    {
      id: 'en-recall-32',
      before: 'A lamp brightens the ',
      answer: 'corner',
      after: '.',
      distractors: ['puddle', 'thread'],
    },
    {
      id: 'en-recall-33',
      before: 'The towel smells like fresh ',
      answer: 'linen',
      after: '.',
      distractors: ['metal', 'gravel'],
    },
  ],
  'zh-CN': [
    {
      id: 'zh-CN-recall-0',
      before: '让',
      answer: '清晨',
      after: '的阳光照进来。',
      distractors: ['午后', '傍晚'],
    },
    {
      id: 'zh-CN-recall-1',
      before: '把杯子放在',
      answer: '桌上',
      after: '。',
      distractors: ['窗边', '书旁'],
    },
    {
      id: 'zh-CN-recall-2',
      before: '窗外停着一只',
      answer: '小鸟',
      after: '。',
      distractors: ['蝴蝶', '蜻蜓'],
    },
    {
      id: 'zh-CN-recall-3',
      before: '这本书的封面是',
      answer: '绿色',
      after: '的。',
      distractors: ['蓝色', '红色'],
    },
    {
      id: 'zh-CN-recall-4',
      before: '今天的房间很',
      answer: '安静',
      after: '。',
      distractors: ['温暖', '明亮'],
    },
    {
      id: 'zh-CN-recall-5',
      before: '请把门轻轻',
      answer: '打开',
      after: '。',
      distractors: ['关上', '推开'],
    },
    {
      id: 'zh-CN-recall-6',
      before: '我们沿着',
      answer: '河边',
      after: '慢慢走。',
      distractors: ['街道', '小路'],
    },
    {
      id: 'zh-CN-recall-7',
      before: '杯里的茶还是',
      answer: '温热',
      after: '的。',
      distractors: ['清凉', '滚烫'],
    },
    {
      id: 'zh-CN-recall-8',
      before: '一片叶子',
      answer: '缓缓',
      after: '落下。',
      distractors: ['轻轻', '悠悠'],
    },
    {
      id: 'zh-CN-recall-9',
      before: '再读一遍',
      answer: '第一',
      after: '行。',
      distractors: ['最后一', '第二'],
    },
    {
      id: 'zh-CN-recall-10',
      before: '现在的天空很',
      answer: '晴朗',
      after: '。',
      distractors: ['阴沉', '明亮'],
    },
    {
      id: 'zh-CN-recall-11',
      before: '把双手放在',
      answer: '膝盖',
      after: '上。',
      distractors: ['桌面', '扶手'],
    },
    {
      id: 'zh-CN-recall-12',
      before: '小木桌旁有一盏',
      answer: '台灯',
      after: '。',
      distractors: ['花瓶', '竹篮'],
    },
    {
      id: 'zh-CN-recall-13',
      before: '雨水落在',
      answer: '屋檐',
      after: '下面。',
      distractors: ['书页', '石阶'],
    },
    {
      id: 'zh-CN-recall-14',
      before: '把铅笔放回',
      answer: '笔盒',
      after: '里。',
      distractors: ['碗里', '袋里'],
    },
    {
      id: 'zh-CN-recall-15',
      before: '白花开在',
      answer: '路旁',
      after: '。',
      distractors: ['窗内', '桌边'],
    },
    {
      id: 'zh-CN-recall-16',
      before: '玻璃瓶里装着',
      answer: '清水',
      after: '。',
      distractors: ['细沙', '热茶'],
    },
    {
      id: 'zh-CN-recall-17',
      before: '风把窗帘吹得',
      answer: '轻轻',
      after: '摆动。',
      distractors: ['慢慢', '悄悄'],
    },
    {
      id: 'zh-CN-recall-18',
      before: '小纸船漂过',
      answer: '水面',
      after: '。',
      distractors: ['墙面', '桌面'],
    },
    {
      id: 'zh-CN-recall-19',
      before: '把钥匙放进',
      answer: '小碗',
      after: '里。',
      distractors: ['布包', '抽屉'],
    },
    {
      id: 'zh-CN-recall-20',
      before: '新毛巾挂在',
      answer: '架子',
      after: '上。',
      distractors: ['门边', '椅背'],
    },
    {
      id: 'zh-CN-recall-21',
      before: '月光落在',
      answer: '窗台',
      after: '上。',
      distractors: ['纸面', '杯底'],
    },
    {
      id: 'zh-CN-recall-22',
      before: '一枚石子躺在',
      answer: '小路',
      after: '边。',
      distractors: ['盘子', '书页'],
    },
    {
      id: 'zh-CN-recall-23',
      before: '蓝布包靠着',
      answer: '椅脚',
      after: '。',
      distractors: ['花枝', '门锁'],
    },
    {
      id: 'zh-CN-recall-24',
      before: '旧书翻到',
      answer: '中间',
      after: '一页。',
      distractors: ['开头', '末尾'],
    },
    {
      id: 'zh-CN-recall-25',
      before: '一根丝带绕着',
      answer: '盒子',
      after: '。',
      distractors: ['杯子', '瓶口'],
    },
    {
      id: 'zh-CN-recall-26',
      before: '薄荷叶放在',
      answer: '盘中',
      after: '。',
      distractors: ['袋中', '书中'],
    },
    {
      id: 'zh-CN-recall-27',
      before: '白瓷杯映出',
      answer: '灯影',
      after: '。',
      distractors: ['云影', '树影'],
    },
    {
      id: 'zh-CN-recall-28',
      before: '抽屉里有一枚',
      answer: '纽扣',
      after: '。',
      distractors: ['石子', '纸船'],
    },
    {
      id: 'zh-CN-recall-29',
      before: '竹篮放在',
      answer: '门边',
      after: '。',
      distractors: ['墙上', '水中'],
    },
    {
      id: 'zh-CN-recall-30',
      before: '日历上圈着',
      answer: '今天',
      after: '。',
      distractors: ['昨天', '明天'],
    },
    {
      id: 'zh-CN-recall-31',
      before: '浅水湾边吹来',
      answer: '海风',
      after: '。',
      distractors: ['山风', '热风'],
    },
    {
      id: 'zh-CN-recall-32',
      before: '墙面上移过一片',
      answer: '云影',
      after: '。',
      distractors: ['灯影', '树影'],
    },
    {
      id: 'zh-CN-recall-33',
      before: '圆盘里放着一颗',
      answer: '苹果',
      after: '。',
      distractors: ['石子', '纽扣'],
    },
  ],
};

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function legacyBank(locale: Locale, mode: Mode): Question[] {
  if (mode === 'word') {
    return words[locale].map((word) => ({
      id: word.id,
      mode,
      reference: word.text,
      answers: [Array.from(word.text)],
      blocks: Array.from(word.text).map((text, n) => ({
        id: `${word.id}-${n}`,
        text,
      })),
    }));
  }

  if (mode === 'sentence') {
    return sentences[locale].map((sentence) => ({
      id: sentence.id,
      mode,
      reference: sentence.blocks
        .map(stripEndingPeriod)
        .join(locale === 'en' ? ' ' : ''),
      answers: (sentence.answers ?? [sentence.blocks]).map((answer) =>
        answer.map(stripEndingPeriod),
      ),
      blocks: sentence.blocks.map((text, n) => ({
        id: `${sentence.id}-${n}`,
        text: stripEndingPeriod(text),
      })),
    }));
  }

  return recall[locale].map((item) => ({
    id: item.id,
    mode,
    before: item.before,
    after: stripSentenceEnding(item.after),
    reference: stripSentenceEnding(`${item.before}${item.answer}${item.after}`),
    answers: [[item.answer]],
    blocks: [item.answer, ...item.distractors].map((text, n) => ({
      id: `${item.id}-${n}`,
      text,
    })),
  }));
}

export type QuestionGroup = {
  id: string;
  mode: Mode;
  title: Record<Locale, string>;
  questionIds: Record<Locale, string[]>;
};

function rows(locale: Locale, mode: Mode) {
  return (
    mode === 'word' ? wordRows : mode === 'sentence' ? sentenceRows : recallRows
  )[locale];
}

function entries(locale: Locale, mode: Mode, theme: keyof typeof wordRows.en) {
  return rows(locale, mode)
    [theme].trim()
    .split('\n')
    .map((line) => {
      if (line.startsWith('@'))
        return { id: `${locale}-${mode}-${line.slice(1)}`, content: null };
      const split = line.indexOf('~');
      return {
        id: `${locale}-${mode}-${theme}-${line.slice(0, split)}`,
        content: line.slice(split + 1),
      };
    });
}

const groupCache = new Map<Mode, QuestionGroup[]>();
const bankCache = new Map<string, Question[]>();
export function groups(mode: Mode): QuestionGroup[] {
  const cached = groupCache.get(mode);
  if (cached) return cached;
  const result = themes.map(([theme, zh, en]) => ({
    id: `${mode}-${theme}`,
    mode,
    title: { en, 'zh-CN': zh },
    questionIds: {
      en: entries('en', mode, theme).map((q) => q.id),
      'zh-CN': entries('zh-CN', mode, theme).map((q) => q.id),
    },
  }));
  groupCache.set(mode, result);
  return result;
}

export function bank(locale: Locale, mode: Mode): Question[] {
  const key = `${locale}:${mode}`;
  const cached = bankCache.get(key);
  if (cached) return cached;
  const additions: Question[] = [];
  for (const [theme] of themes) {
    for (const { id, content } of entries(locale, mode, theme)) {
      if (content === null) continue;
      const parts = content.split('|');
      const answer =
        mode === 'word'
          ? Array.from(content)
          : mode === 'sentence'
            ? parts
            : [parts[1]];
      const after =
        mode === 'recall' ? stripSentenceEnding(parts[2]) : undefined;
      additions.push({
        id,
        mode,
        reference:
          mode === 'recall'
            ? `${parts[0]}${parts[1]}${after}`
            : answer.join(mode === 'sentence' && locale === 'en' ? ' ' : ''),
        answers: [answer],
        blocks: (mode === 'recall'
          ? [parts[1], parts[3], parts[4]]
          : answer
        ).map((text, i) => ({ id: `${id}-${i}`, text })),
        ...(mode === 'recall' ? { before: parts[0], after } : {}),
      });
    }
  }
  const result = [...legacyBank(locale, mode), ...additions];
  bankCache.set(key, result);
  return result;
}

export function groupQuestions(
  locale: Locale,
  mode: Mode,
  groupId: string,
): Question[] {
  const group = groups(mode).find((g) => g.id === groupId);
  if (!group) throw new Error(`Unknown group: ${groupId}`);
  const pool = new Map(bank(locale, mode).map((q) => [q.id, q]));
  return group.questionIds[locale].map((id) => {
    const q = pool.get(id);
    if (!q) throw new Error(`Missing question: ${id}`);
    return q;
  });
}

export function createPracticeSet(
  locale: Locale,
  mode: Mode,
  groupId: string,
): Question[] {
  return groupQuestions(locale, mode, groupId).map((q) => ({
    ...q,
    blocks: shuffled(q.blocks),
  }));
}

export function questionCount(locale: Locale, mode: Mode): number {
  return bank(locale, mode).length;
}

export function accepts(q: Question, prefix: string[], text: string) {
  return q.answers.some((answer) =>
    [...prefix, text].every((word, i) => answer[i] === word),
  );
}
import { themes, wordRows, sentenceRows, recallRows } from './group-content';
