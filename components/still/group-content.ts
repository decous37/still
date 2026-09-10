// Each line starts with a stable ID, not an array index. @N retains a legacy ID.
// New word: id~word; sentence: id~block|block|block;
// recall: id~before|answer|after|distractor|distractor (spaces are significant).
export const themes = [
  ['home', '居家', 'Home'],
  ['nature', '自然', 'Nature'],
  ['light', '光影', 'Light'],
  ['weather', '天气', 'Weather'],
  ['plants', '植物', 'Plants'],
  ['food', '饮食', 'Food'],
  ['reading', '阅读', 'Reading'],
  ['travel', '出行', 'Travel'],
  ['objects', '物件', 'Objects'],
  ['sound', '声音', 'Sound'],
] as const;
export type ThemeId = (typeof themes)[number][0];
type Rows = Record<ThemeId, string>;
export const wordRows: Record<'en' | 'zh-CN', Rows> = {
  en: {
    home: `@0
@9
@10
@14
@25
a~PILLOW
b~CARPET
c~CEILING
d~CLOSET
e~HEARTH`,
    nature: `@12
@16
@22
@28
a~VALLEY
b~PEBBLE
c~OCEAN
d~ISLAND
e~CAVERN
f~FOREST`,
    light: `@4
@13
@26
@33
a~SHADOW
b~SPARKLE
c~SUNRISE
d~GLOW
e~PRISM
f~MIRROR`,
    weather: `@19
@30
a~DRIZZLE
b~FROST
c~THUNDER
d~SNOW
e~MIST
f~RAINBOW
g~WINTER
h~HUMID`,
    plants: `@15
@17
@23
@24
a~SPROUT
b~PETAL
c~BAMBOO
d~CLOVER
e~CACTUS
f~WILLOW`,
    food: `@20
a~APPLE
b~BREAD
c~HONEY
d~GINGER
e~NOODLE
f~PEPPER
g~YOGURT
h~CARROT
i~ALMOND`,
    reading: `@3
@6
@18
a~CHAPTER
b~MARGIN
c~STORY
d~POETRY
e~AUTHOR
f~LIBRARY
g~FABLE`,
    travel: `@2
@27
@32
a~TICKET
b~STATION
c~BRIDGE
d~JOURNEY
e~BICYCLE
f~HARBOR
g~LUGGAGE`,
    objects: `@21
@31
a~SCISSORS
b~RIBBON
c~BUCKET
d~NEEDLE
e~BOTTLE
f~LADDER
g~COMPASS
h~ENVELOPE`,
    sound: `@1
@5
@7
@8
@11
@29
a~WHISPER
b~RHYTHM
c~MELODY
d~CHIME`,
  },
  'zh-CN': {
    home: `@0
@3
@5
@13
@24
@27
@30
a~靠枕
b~地毯
c~门把手`,
    nature: `@12
@20
@25
@26
a~山谷
b~溪流
c~海岸
d~鹅卵石
e~小山丘
f~森林`,
    light: `@2
@4
@15
@33
a~晨光
b~倒影
c~月色
d~烛火
e~彩虹
f~玻璃窗`,
    weather: `@9
@16
@19
a~细雨
b~白霜
c~雪花
d~晴空
e~薄雾
f~春风
g~雷阵雨`,
    plants: `@29
a~嫩芽
b~花瓣
c~柳树
d~竹林
e~三叶草
f~向日葵
g~仙人掌
h~蒲公英
i~松果`,
    food: `@17
@31
a~小面包
b~蜂蜜
c~胡萝卜
d~燕麦粥
e~热豆浆
f~苹果片
g~白米饭
h~芝麻`,
    reading: `@8
@14
@18
a~书签
b~诗歌
c~故事书
d~图书馆
e~目录
f~段落
g~笔记本`,
    travel: `@6
@7
@11
@23
a~车站
b~小桥
c~自行车
d~行李箱
e~路标
f~渡口`,
    objects: `@21
@22
@32
a~剪刀
b~丝带
c~信封
d~指南针
e~小木梯
f~纽扣
g~橡皮擦`,
    sound: `@1
@10
@28
a~风铃
b~回声
c~脚步声
d~轻声细语
e~鸟鸣
f~节拍
g~琴声`,
  },
};

export const sentenceRows: Record<'en' | 'zh-CN', Rows> = {
  en: {
    home: `@0
@2
@9
@10
@19
@20
@27
@30
a~Hang|your coat|on the hook
b~The cushion|fits neatly|on the sofa`,
    nature: `@18
@24
a~The river|curves around|a rocky hill
b~Small waves|reach|the sandy shore
c~A beetle|crosses|the forest floor
d~The valley|opens|beyond the trees
e~Follow|the stream|to the pond
f~Two shells|lie beside|a piece of driftwood
g~The tide|leaves ripples|in the sand
h~An otter|dives beneath|the smooth water`,
    light: `@5
@29
a~A narrow shadow|stretches across|the floor
b~The mirror|reflects|a patch of sky
c~Sunlight|catches|the glass rim
d~The streetlight|comes on|at dusk
e~A bright stripe|falls across|the blanket
f~Clouds|soften|the afternoon light
g~The lantern|casts|a round glow
h~Reflections|shimmer|under the bridge`,
    weather: `@4
@33
a~Fine snow|settles on|the garden gate
b~A sudden breeze|lifts|the washing
c~The fog|clears|before noon
d~Raindrops|slide down|the bus window
e~Frost|outlines|each fallen leaf
f~The air|feels cooler|after the shower
g~Close|the umbrella|under the porch
h~Dark clouds|gather above|the distant hills`,
    plants: `a~A new shoot|leans toward|the window
b~Water|the roots|rather than the leaves
c~The sunflower|stands above|the low fence
d~Tiny seeds|cling to|my sleeve
e~A vine|winds around|the wooden post
f~The cactus|needs|very little water
g~Pick up|the pine cone|beside your shoe
h~Pink petals|float in|the shallow bowl
i~The fern|unfolds|a bright green frond
j~Bamboo leaves|bend beneath|the raindrops`,
    food: `@7
@21
@26
@31
a~Slice|the loaf|on the wooden board
b~Stir|the soup|with a long spoon
c~The pear|smells sweet|when it is ripe
d~Let|the fresh bread|cool on the rack
e~A little honey|dissolves in|the warm milk
f~Rinse|the rice|before cooking`,
    reading: `@3
@6
@15
@16
@17
@22
@28
a~The bookmark|rests between|two pages
b~Find|the chapter title|in the contents
c~Write|a short note|in the margin`,
    travel: `@11
@23
a~Check|the platform number|before boarding
b~The footpath|runs beside|the canal
c~A blue sign|points toward|the museum
d~Our train|crosses|a narrow bridge
e~Keep|your ticket|in an easy place
f~The ferry|leaves|from the small pier
g~Wait|behind the line|at the crossing
h~A cyclist|signals|before turning`,
    objects: `@1
@12
@13
@14
@25
@32
a~Thread|the needle|near the lamp
b~The lid|fits|this round tin
c~Put|the spare buttons|in a jar
d~Fold|the letter|before sealing it`,
    sound: `@8
a~A bell|rings|across the courtyard
b~Footsteps|echo along|the empty hall
c~The kettle|begins|to whistle
d~A sparrow|chirps|from the roof
e~The record|ends with|a quiet note
f~Wind chimes|sound gently|by the door
g~We hear|a train|in the distance
h~The drummer|keeps|a steady beat
i~Dry leaves|crackle|under our shoes`,
  },
  'zh-CN': {
    home: `@2
@8
@14
@16
@21
@23
@27
@32
a~外套|挂在|门后的挂钩上
b~靠枕|正好放在|沙发的一角`,
    nature: `@13
@20
@31
a~小溪|绕过石头|流向远处
b~沙滩上|留下了|弯弯的水纹
c~一只甲虫|爬过|湿润的泥土
d~山谷|藏在|两座山之间
e~退潮以后|礁石|露出了水面
f~岸边的芦苇|映在|平静的湖里
g~贝壳旁边|躺着|一小段浮木`,
    light: `@3
@30
@33
a~镜子里|映着|一小片蓝天
b~夕阳|把树影|拉得很长
c~路灯|在天黑之前|亮了起来
d~水杯的边缘|闪着|细细的亮光
e~烛火|照亮了|桌布上的花纹
f~树叶之间|漏下|斑驳的阳光
g~桥下的倒影|随着水波|轻轻晃动`,
    weather: `@7
@26
a~细雪|落在|院门的横梁上
b~清晨的薄雾|渐渐|散开了
c~一阵风|吹动了|晾衣绳上的衬衫
d~雨点|沿着车窗|往下滑
e~草叶的边缘|结着|一层白霜
f~阵雨过后|空气|凉快了许多
g~走到屋檐下|再把雨伞|收起来
h~远处的山顶|被乌云|遮住了`,
    plants: `@18
@22
a~新长出的嫩芽|朝着窗户|伸展
b~浇水时|让水流到|花盆的土里
c~向日葵|高过了|矮矮的篱笆
d~一粒种子|粘在|衣袖上
e~细细的藤蔓|绕着木杆|向上爬
f~仙人掌|不需要|太多的水
g~松果|落在|树根旁边
h~竹叶|被雨水|压弯了`,
    food: `@5
@17
@25
@29
a~把面包|放在木板上|切成薄片
b~用长柄勺|慢慢搅动|锅里的汤
c~熟透的梨|散发着|淡淡的甜香
d~刚烤好的面包|放在架子上|晾一会儿
e~一小勺蜂蜜|融进了|温热的牛奶
f~煮饭之前|先把米|淘洗干净`,
    reading: `@0
@1
@6
@9
@11
@15
@19
@24
a~书签|夹在|昨天读到的那一页
b~在页边|写下|一个简短的想法`,
    travel: `@10
a~上车之前|看清楚|站台的号码
b~小路|沿着运河|一直向前
c~蓝色的路牌|指向|博物馆
d~火车|缓缓驶过|窄窄的桥
e~把车票|放在|容易拿到的地方
f~渡船|停在|小小的码头边
g~过马路时|先在白线后|等一等
h~骑车的人|伸出手|示意转弯
i~行李箱的轮子|滚过|平整的地面`,
    objects: `@12
@28
a~在台灯旁|把线|穿进针孔
b~这个盖子|刚好盖住|圆圆的铁盒
c~把备用纽扣|收进|透明的小罐子
d~先把信纸折好|再装进|信封里
e~剪刀|平放在|针线盒旁边
f~木梯|靠着|结实的墙面
g~指南针的指针|慢慢|停了下来
h~拧紧瓶盖|再把瓶子|放进包里`,
    sound: `@4
a~钟声|穿过|安静的院子
b~脚步声|在空走廊里|轻轻回响
c~水壶|开始发出|细细的鸣声
d~屋顶上的麻雀|叫了|短短的几声
e~这首曲子|停在|一个轻柔的音符上
f~门边的风铃|被风吹得|叮当作响
g~远处|传来|火车的声音
h~鼓手|保持着|均匀的节拍
i~干树叶|在鞋底下|沙沙地响`,
  },
};

export const recallRows: Record<'en' | 'zh-CN', Rows> = {
  en: {
    home: `@5
@11
@18
@20
@33
a~The slippers wait beside the |bed||sink|stove
b~We fold the blanket into a |square||circle|triangle
c~A spare key hangs behind the |door||sofa|clock
d~The rug feels |soft| beneath my feet|cold|rough
e~She opens the curtains before |breakfast||dinner|bedtime`,
    nature: `@2
@6
@17
@28
@31
a~A crab disappears beneath a |rock||cloud|branch
b~The river meets the sea at the |coast||summit|cave
c~Our footprints remain in the wet |sand||grass|snow
d~A deer pauses at the forest |edge||floor|canopy
e~The pond is home to several |frogs||foxes|owls`,
    light: `@0
@12
@16
@24
@27
@32
a~The setting sun turns the wall |gold||blue|green
b~A reflection appears in the still |water||linen|soil
c~The shade makes this corner look |darker||wider|warmer
d~A beam of light passes through the |crack||handle|hinge`,
    weather: `@10
@21
@25
a~By noon the morning fog has |lifted||frozen|thickened
b~Snow settles on the empty |bench||kettle|pillow
c~We bring the washing in before the |storm||sunrise|weekend
d~A rainbow appears above the |hills||plates|books
e~The forecast says tomorrow will be |windy||dry|warm
f~Ice forms along the edge of the |puddle||curtain|ceiling
g~After the shower the pavement is |wet||dusty|warm`,
    plants: `@8
@14
a~The rose has a small |thorn| on its stem|petal|bud
b~We plant the seeds in shallow |soil||water|gravel
c~New roots emerge from the |cutting||flower|fruit
d~The sunflower faces the morning |sun||moon|lamp
e~The mint smells fresh when a leaf is |crushed||painted|folded
f~A vine climbs up the wooden |trellis||bucket|spoon
g~The oak drops its acorns in |autumn||spring|winter
h~The fern grows best in the |shade||sand|frost`,
    food: `@1
@7
@15
@19
a~The dough rises beneath a clean |cloth||plate|lid
b~We add a pinch of |salt| to the soup|rice|tea
c~The toast is ready when its edges turn |brown||white|pink
d~A wooden spoon rests beside the |pot||vase|book
e~The oranges fill a shallow |bowl||mug|jar
f~She slices the cucumber into thin |rounds||cubes|strips`,
    reading: `@3
@9
@22
@29
a~The poem takes up half a |page||shelf|desk
b~I mark my place with a blue |bookmark||ruler|pencil
c~The chapter begins with a short |letter||map|list
d~We return the books to the |library||station|bakery
e~The title is printed in large |letters||circles|numbers
f~A note in the margin explains the |word||date|drawing`,
    travel: `a~Our train departs from platform |three||five|eight
b~The bus stop is opposite the |bakery||school|museum
c~We cross the canal on a stone |bridge||path|step
d~The ferry reaches the island before |noon||dawn|midnight
e~My ticket is tucked inside my |wallet||glove|shoe
f~At the crossing we wait for the |signal||breeze|echo
g~The route follows the river |upstream||downstream|sideways
h~A cyclist waits beside the red |sign||gate|car
i~The suitcase has two small |wheels||handles|pockets
j~We leave our bicycles near the |entrance||fountain|bench`,
    objects: `@13
@23
@26
a~The scissors have bright yellow |handles||blades|tips
b~A needle lies on a folded |napkin||letter|scarf
c~The envelope is sealed with a round |sticker||button|coin
d~Three spare buttons sit in a glass |jar||cup|bottle
e~The compass needle points toward |north||east|west
f~A loose screw rolls across the |tray||carpet|cushion
g~The ladder rests against the brick |wall||roof|floor`,
    sound: `@4
@30
a~A distant bell rings |twice||once|often
b~The wind chimes hang beside the |porch||pond|shed
c~A woodpecker taps on a hollow |trunk||stone|shell
d~The last note fades into |silence||laughter|thunder
e~Footsteps echo through the empty |tunnel||garden|field
f~A gentle rhythm comes from the |drum||flute|violin
g~The kettle whistles on the |stove||table|shelf
h~We hear an owl just after |dusk||noon|breakfast`,
  },
  'zh-CN': {
    home: `@5
@11
@20
@23
@29
a~拖鞋整齐地摆在|床边||门外|桌下
b~我们把毯子叠成一个|方块||圆圈|三角
c~备用钥匙挂在|门后||窗边|墙角
d~脚下的地毯摸起来很|柔软||粗糙|冰凉
e~她在|早饭|前拉开窗帘|晚饭|睡觉`,
    nature: `@2
@6
@18
@22
a~小螃蟹钻进了|石缝|里|沙堆|树洞
b~河水在远处汇入|大海||湖泊|池塘
c~湿润的沙地上留着一串|脚印||水珠|贝壳
d~小鹿停在树林的|边缘||深处|中央
e~池塘里住着几只|青蛙||松鼠|麻雀
f~退潮后露出一片褐色的|礁石||泥土|树根`,
    light: `@0
@12
@21
@27
@32
a~夕阳把墙壁染成了|金色||蓝色|绿色
b~平静的水面映出树的|倒影||枝条|轮廓
c~台灯的光落在|书桌|上|地板|床头
d~一道光从门的|缝隙|里透出来|把手|顶端
e~镜子反射出窗外的一片|蓝天||草地|屋顶`,
    weather: `@10
@13
@17
@31
a~到了中午，山间的雾已经|散开||凝结|变浓
b~薄薄的雪落在空着的|长椅|上|衣柜|餐盘
c~下雨之前，我们收起了晾着的|衣服||书本|玩具
d~彩虹出现在远处的|山坡|上方|桌面|地毯
e~天气预报说明天会有|大风||浓雾|小雪
f~水洼边缘结了一层薄薄的|冰||霜|灰`,
    plants: `@8
@15
@26
a~玫瑰的茎上有一根小小的|刺||芽|枝
b~我们把种子埋进湿润的|泥土||细沙|落叶
c~小小的新根从|枝条|底部长出来|花瓣|果实
d~向日葵朝着清晨的|太阳||月亮|路灯
e~揉一揉叶子，就能闻到|薄荷|的清香|竹子|松树
f~藤蔓沿着木制的|花架|往上爬|水桶|凳子
g~蕨类植物喜欢阴凉的|角落||沙地|屋顶`,
    food: `@1
@7
@33
a~面团上盖着一块干净的|布||纸|木板
b~往汤里加一小撮|盐||米|茶叶
c~烤面包的边缘变成了|棕色||白色|粉色
d~木勺靠在|锅沿|上|瓶口|杯底
e~橘子装在一个浅浅的|碗|里|罐子|杯子
f~她把黄瓜切成了薄薄的|圆片||方块|长条
g~刚蒸好的米饭冒着|热气||泡沫|烟尘`,
    reading: `@3
@9
@24
@30
a~这首诗占了半张|书页||报纸|卡片
b~我用一枚蓝色的|书签|记住读到的位置|尺子|贴纸
c~这一章从一封简短的|信|开始|通知|请柬
d~我们把借来的书还给|图书馆||学校|书店
e~标题用了比较大的|字体||图案|空格
f~页边的注释解释了这个|词语||日期|符号`,
    travel: `a~我们的火车从|三号|站台出发|五号|八号
b~公交车站就在|面包店|对面|学校|博物馆
c~我们走过一座|石桥|来到河对岸|木桥|吊桥
d~渡船在|中午|以前到达小岛|清晨|傍晚
e~车票收在我的|钱包|里面|手套|鞋子
f~到了路口，我们停下来等|绿灯||同伴|公交车
g~这条路线沿着河流通向|上游||下游|支流
h~骑车的人停在红色的|路牌|旁边|铁门|汽车
i~行李箱下面有两只小|轮子||把手|口袋
j~我们把自行车停在|入口|附近|喷泉|长椅`,
    objects: `@14
@16
@19
@25
@28
a~剪刀的手柄是明亮的|黄色||蓝色|红色
b~一根针放在叠好的|餐巾|上|信纸|围巾
c~信封用圆形的|贴纸|封好了|纽扣|硬币
d~指南针的指针指向|北方||东方|西方
e~木梯稳稳地靠着|砖墙||屋顶|地板`,
    sound: `@4
a~远处的钟敲了|两下||一下|三下
b~风铃挂在|门廊|旁边|池塘|棚屋
c~啄木鸟敲着空心的|树干||石头|贝壳
d~最后一个音符消失后，四周恢复了|安静||喧闹|忙碌
e~脚步声在空空的|隧道|里回响|花园|田野
f~均匀的节奏来自那面|鼓||锣|钟
g~炉子上的|水壶|发出了鸣声|砂锅|茶杯
h~天黑以后，我们听见了|猫头鹰|的叫声|公鸡|海鸥
i~指尖轻轻敲着|桌面|，发出短短的响声|枕头|毛巾`,
  },
};
