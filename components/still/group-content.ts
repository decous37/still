// Explicit IDs preserve the original group membership and question order.
// Word: id~text. Sentence: id~block|block. Recall: id~text [gap] text|distractor|distractor.
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
    home: `en-word-0~pillow
en-word-9~blanket
en-word-10~cupboard
en-word-14~curtain
en-word-25~doormat
en-word-home-a~bedroom
en-word-home-b~cushion
en-word-home-c~doorbell
en-word-home-d~windowsill
en-word-home-e~armchair`,
    nature: `en-word-12~river
en-word-16~estuary
en-word-22~pebbles
en-word-28~waterway
en-word-nature-a~coastline
en-word-nature-b~hillside
en-word-nature-c~waterfall
en-word-nature-d~woodland
en-word-nature-e~countryside
en-word-nature-f~mountain`,
    light: `en-word-4~shadow
en-word-13~sunlight
en-word-26~daylight
en-word-33~lantern
en-word-light-a~sunrise
en-word-light-b~reflect
en-word-light-c~sparkle
en-word-light-d~moonlight
en-word-light-e~reflection
en-word-light-f~lamplight`,
    weather: `en-word-19~cloud
en-word-30~drizzle
en-word-weather-a~rainbow
en-word-weather-b~thunder
en-word-weather-c~weather
en-word-weather-d~showers
en-word-weather-e~overcast
en-word-weather-f~snowfall
en-word-weather-g~thunderstorm
en-word-weather-h~forecast`,
    plants: `en-word-15~petal
en-word-17~blossom
en-word-23~seedling
en-word-24~orchard
en-word-plants-a~compost
en-word-plants-b~sapling
en-word-plants-c~sunflower
en-word-plants-d~treetop
en-word-plants-e~greenhouse
en-word-plants-f~chestnut`,
    food: `en-word-20~bread
en-word-food-a~breakfast
en-word-food-b~porridge
en-word-food-c~noodles
en-word-food-d~pancake
en-word-food-e~sandwich
en-word-food-f~apricot
en-word-food-g~cucumber
en-word-food-h~strawberry
en-word-food-i~rosemary`,
    reading: `en-word-3~story
en-word-6~chapter
en-word-18~library
en-word-reading-a~reading
en-word-reading-b~notebook
en-word-reading-c~bookmark
en-word-reading-d~magazine
en-word-reading-e~paragraph
en-word-reading-f~dictionary
en-word-reading-g~bookshelf`,
    travel: `en-word-2~ticket
en-word-27~journey
en-word-32~station
en-word-travel-a~bicycle
en-word-travel-b~luggage
en-word-travel-c~platform
en-word-travel-d~railway
en-word-travel-e~carriage
en-word-travel-f~roundabout
en-word-travel-g~crossroad`,
    objects: `en-word-21~basket
en-word-31~scissors
en-word-objects-a~envelope
en-word-objects-b~calendar
en-word-objects-c~handrail
en-word-objects-d~earrings
en-word-objects-e~keyhole
en-word-objects-f~teaspoon
en-word-objects-g~thermometer
en-word-objects-h~notepad`,
    sound: `en-word-1~chime
en-word-5~whisper
en-word-7~rustling
en-word-8~footstep
en-word-11~humming
en-word-29~crackle
en-word-sound-a~ringing
en-word-sound-b~whistle
en-word-sound-c~conversation
en-word-sound-d~listener`,
  },
  'zh-CN': {
    home: `zh-CN-word-0~小木桌
zh-CN-word-3~窗边的旧椅子
zh-CN-word-5~晒过太阳的棉被
zh-CN-word-13~刚洗好的床单
zh-CN-word-24~厨房飘来饭香
zh-CN-word-27~门后挂着围裙
zh-CN-word-30~桌角放着水杯
zh-CN-word-home-a~收起阳台衣服
zh-CN-word-home-b~把拖鞋摆在门边等你
zh-CN-word-home-c~推开半掩的门`,
    nature: `zh-CN-word-12~青石路
zh-CN-word-20~沿着小溪散步
zh-CN-word-25~石缝里的清泉
zh-CN-word-26~远山渐渐清晰
zh-CN-word-nature-a~湖边停着小船
zh-CN-word-nature-b~沙地留下脚印
zh-CN-word-nature-c~潮水慢慢退去
zh-CN-word-nature-d~树下捡到松果
zh-CN-word-nature-e~沿河的小路通向远山
zh-CN-word-nature-f~水面浮着落叶`,
    light: `zh-CN-word-2~小台灯
zh-CN-word-4~光从窗缝进来
zh-CN-word-15~树影落在墙上
zh-CN-word-33~清晨的第一束光
zh-CN-word-light-a~晚霞映红窗子
zh-CN-word-light-b~月光照着石阶
zh-CN-word-light-c~灯下摊开书本
zh-CN-word-light-d~云后透出阳光
zh-CN-word-light-e~一束阳光穿过旧窗帘
zh-CN-word-light-f~水中摇晃的光`,
    weather: `zh-CN-word-9~窗外雨
zh-CN-word-16~下雨前的微风
zh-CN-word-19~雨后空气清新
zh-CN-word-weather-a~屋檐挂着水珠
zh-CN-word-weather-b~风把云吹散了
zh-CN-word-weather-c~等一场雨停下
zh-CN-word-weather-d~雪落在手心里
zh-CN-word-weather-e~清晨起了薄雾
zh-CN-word-weather-f~雨停以后推开窗透气
zh-CN-word-weather-g~天边响起雷声`,
    plants: `zh-CN-word-29~薄荷叶
zh-CN-word-plants-a~给窗边花浇水
zh-CN-word-plants-b~一片新长的叶子
zh-CN-word-plants-c~春天枝头发芽
zh-CN-word-plants-d~花盆长出青草
zh-CN-word-plants-e~雨打湿了花瓣
zh-CN-word-plants-f~竹笋钻出泥土
zh-CN-word-plants-g~藤蔓爬上木架
zh-CN-word-plants-h~把落叶轻轻夹进书里
zh-CN-word-plants-i~树根旁的苔藓`,
    food: `zh-CN-word-17~白瓷碗
zh-CN-word-31~切一小块面包
zh-CN-word-food-a~热汤冒着白气
zh-CN-word-food-b~碗里盛着米饭
zh-CN-word-food-c~洗净一篮青菜
zh-CN-word-food-d~把苹果切成片
zh-CN-word-food-e~灶上煮着稀饭
zh-CN-word-food-f~筷子放在碗边
zh-CN-word-food-g~饭后慢慢喝一杯热茶
zh-CN-word-food-h~烤面包的香气`,
    reading: `zh-CN-word-8~旧书页
zh-CN-word-14~翻到昨天那页
zh-CN-word-18~书签夹在中间
zh-CN-word-reading-a~读完一段文字
zh-CN-word-reading-b~在空白处做笔记
zh-CN-word-reading-c~把书放回原处
zh-CN-word-reading-d~借来一本画册
zh-CN-word-reading-e~窗前读书的人
zh-CN-word-reading-f~读到喜欢的句子停下
zh-CN-word-reading-g~纸上淡淡墨香`,
    travel: `zh-CN-word-6~小车站
zh-CN-word-7~等下一班公车
zh-CN-word-11~桥边停着单车
zh-CN-word-23~走过一条小巷
zh-CN-word-travel-a~背包放在腿上
zh-CN-word-travel-b~沿路看见花开
zh-CN-word-travel-c~车窗外的田野
zh-CN-word-travel-d~把车票收好了
zh-CN-word-travel-e~顺着河边走到老桥下
zh-CN-word-travel-f~列车驶过山谷`,
    objects: `zh-CN-word-21~玻璃瓶
zh-CN-word-22~抽屉里的纽扣
zh-CN-word-32~一把旧铜钥匙
zh-CN-word-objects-a~桌上的小闹钟
zh-CN-word-objects-b~折起一张白纸
zh-CN-word-objects-c~把信放进信封
zh-CN-word-objects-d~挂在墙上那幅画
zh-CN-word-objects-e~收好针线盒子
zh-CN-word-objects-f~用布擦去镜子上的灰尘
zh-CN-word-objects-g~木盒里的贝壳`,
    sound: `zh-CN-word-1~小风铃
zh-CN-word-10~听见远处鸟鸣
zh-CN-word-28~雨点敲着窗台
zh-CN-word-sound-a~走廊传来脚步
zh-CN-word-sound-b~风吹树叶沙沙
zh-CN-word-sound-c~水壶轻轻响了
zh-CN-word-sound-d~琴声从窗里来
zh-CN-word-sound-e~纸页翻动的声音
zh-CN-word-sound-f~闭上眼听屋外的雨声
zh-CN-word-sound-g~门外有人敲门`,
  },
};
export const sentenceRows: Record<'en' | 'zh-CN', Rows> = {
  en: {
    home: `en-sentence-0~The cat|sleeps quietly|beside the sofa
en-sentence-2~We fold|clean towels|and put them|on the shelf|beside the sink
en-sentence-9~Before breakfast|she opens|the kitchen window|to let in|some fresh air
en-sentence-10~A rug|covers the floor|between the bed|and chair|by the wall
en-sentence-19~Please leave|your muddy shoes|on the mat|and hang|your coat here
en-sentence-20~He carries|warm blankets|up the stairs|and places them|in the bedroom
en-sentence-27~After dinner|we wash|the blue plates|and leave them|on the rack
en-sentence-30~The dog|waits patiently|by the door|while I look|for my keys
en-sentence-home-a~After dinner|we clear|the wooden table|and set out|a bowl|of fresh fruit|for everyone
en-sentence-home-b~She moves|her chair|closer to the window|before opening|her new book`,
    nature: `en-sentence-18~Two ducks|swim across|the quiet pond
en-sentence-24~Along the shore|we find|small smooth stones|hidden beneath|the wet sand
en-sentence-nature-a~The stream|winds through|a patch of grass|before reaching|the larger river
en-sentence-nature-b~A crab|comes out|from under a stone|and disappears|into the water
en-sentence-nature-c~We follow|the path|through the woods|until we reach|a wooden bridge
en-sentence-nature-d~Beyond the hills|a ribbon|of pale mist|hangs above|the sleeping valley
en-sentence-nature-e~The tide|has carried|driftwood|onto the beach|near our footprints
en-sentence-nature-f~Several birds|gather around|a shallow pool|to drink|after the morning rain
en-sentence-nature-g~At the forest edge|we stop|beside a fallen tree|and watch|a beetle|slowly cross|the path
en-sentence-nature-h~An otter|slides quietly|into the stream|leaving only|a few widening circles`,
    light: `en-sentence-5~Morning light|falls across|the empty table
en-sentence-29~Sunlight reaches|the back wall|through a gap|in the curtain|beside me
en-sentence-light-a~She turns|the desk lamp|toward her notebook|to read|the smaller writing
en-sentence-light-b~In the hallway|our shadows|move across|the pale floor|as we walk
en-sentence-light-c~Sunlight catches|the windows|of distant houses|on the hill|above town
en-sentence-light-d~A glass jar|on the shelf|casts a rainbow|across|the kitchen tiles
en-sentence-light-e~He shades|his eyes|with one hand|to see|the distant boat
en-sentence-light-f~Clouds pass|over the sun|and the garden|becomes darker|for a moment
en-sentence-light-g~At dusk|we switch on|the lamp|beside the sofa|and watch|the room fill|with warm light
en-sentence-light-h~Moonlight shines|through branches|making silver patterns|on the path|outside our door`,
    weather: `en-sentence-4~Rain taps|against the glass|all afternoon
en-sentence-33~We bring|the washing inside|when clouds|begin to gather|over the hills
en-sentence-weather-a~Morning fog|slowly lifts|and houses|across the river|come into view
en-sentence-weather-b~A gust|sends dry leaves|spinning along|the narrow street|outside the school
en-sentence-weather-c~She shakes|rain from|her folded umbrella|before stepping|into the warm kitchen
en-sentence-weather-d~By early evening|the snow|has covered|every chair|in the empty garden
en-sentence-weather-e~We wait|under the awning|until the rain|slows to|a gentle drizzle
en-sentence-weather-f~Drops cling|to the fence|after the shower|and shine|in the sunlight
en-sentence-weather-g~After the storm|we open|the door|and find|a branch|lying across|the wet front step
en-sentence-weather-h~The forecast|promises clear skies|so we pack|a light lunch|for tomorrow`,
    plants: `en-sentence-plants-a~Fresh leaves|unfold beside|the kitchen window
en-sentence-plants-b~She checks|the soil|with one finger|before watering|the little lemon tree
en-sentence-plants-c~A vine|has reached|the top shelf|and curled around|the wooden frame
en-sentence-plants-d~We leave|the seeds|in a paper envelope|until|the warmer spring days
en-sentence-plants-e~New shoots|appear between|the old leaves|at the base|of the plant
en-sentence-plants-f~He moves|the mint|away from the radiator|and toward|the open window
en-sentence-plants-g~The cherry tree|drops pale petals|onto the grass|beside|our garden bench
en-sentence-plants-h~A fern|grows in|the shaded space|between two stones|near the stream
en-sentence-plants-i~Before leaving|for the weekend|she waters|the balcony plants|and moves|the smallest pots|into shade
en-sentence-plants-j~We press|the loose earth|around each seedling|then label|the wooden sticks`,
    food: `en-sentence-7~Warm bread|waits beside|a bowl of soup
en-sentence-21~She slices|ripe tomatoes|and spreads them|across the plate|with fresh basil
en-sentence-26~While water boils|I take|two mugs|from the shelf|above the sink
en-sentence-31~We stir|the soup|with a spoon|and taste it|before adding salt
en-sentence-food-a~He wraps|the bread|in a cloth|to keep it|soft until morning
en-sentence-food-b~The smell|of toasted almonds|fills the kitchen|as we prepare|our breakfast
en-sentence-food-c~She rinses|green beans|under cold water|before cutting|off their tough ends
en-sentence-food-d~A bowl|of sliced peaches|cools on the counter|while|tea slowly brews
en-sentence-food-e~Once the rice|is ready|we turn off|the heat|and leave|the covered pot|to rest briefly
en-sentence-food-f~We share|the last pancake|and save|a little honey|for tomorrow morning`,
    reading: `en-sentence-3~A paper bookmark|rests between|the open pages
en-sentence-6~She reads|the paragraph|once more|before closing|the book on her lap
en-sentence-15~I note|a new word|in my notebook|then check it|after reading
en-sentence-16~The library|keeps new books|on a low shelf|just beside|the entrance
en-sentence-17~He follows|the lines|with one finger|while reading|the poem to us
en-sentence-22~A note|slips from my book|and lands|on the floor|beneath me
en-sentence-28~We return|the atlas|to the library|before choosing|another book to read
en-sentence-reading-a~She notes|the page number|on paper|and puts it|inside the cover
en-sentence-reading-b~As the chapter ends|I look up|and notice|the room|has grown quiet|around me|at last
en-sentence-reading-c~He copies|a passage|into his journal|then adds|a question beside it`,
    travel: `en-sentence-11~Our train|arrives at|the small station
en-sentence-23~We check|the platform number|on screen|before carrying|our bags downstairs
en-sentence-travel-a~She keeps|her ticket|inside the book|that she reads|on the train
en-sentence-travel-b~The bus|crosses the bridge|and stops|beside the bakery|on the corner
en-sentence-travel-c~We take|the quieter road|along the river|to avoid|busy morning traffic
en-sentence-travel-d~He parks|his bicycle|under shelter|and fastens|the lock around the frame
en-sentence-travel-e~Through the window|I see|a row of houses|beyond|the green fields
en-sentence-travel-f~They pause|at the crossing|and wait|for the signal|before walking across
en-sentence-travel-g~At the last stop|we follow|the signs|through a lane|toward|the old harbor|near the market
en-sentence-travel-h~She places|her backpack|beneath the seat|and watches|the landscape slide past`,
    objects: `en-sentence-1~A brass key|lies beside|the empty bowl
en-sentence-12~He folds|the map|along its creases|and slips it|into his pocket
en-sentence-13~We find|a button|in the wooden box|beside|the needles and thread
en-sentence-14~She wipes|the mirror|with a soft cloth|until|the last marks disappear
en-sentence-25~The clock|needs a battery|so I leave it|on my desk|today
en-sentence-32~A crack|runs along|the cup handle|we repaired|last Sunday morning
en-sentence-objects-a~He writes|the address|on the envelope|before pressing|the stamp into place
en-sentence-objects-b~We keep|old photographs|inside a flat box|on|the highest cupboard shelf
en-sentence-objects-c~Before mending|the shirt|she lays out|a needle|some thread|and sharp scissors|on the table
en-sentence-objects-d~The screw|rolls beneath the chair|and stops|against|some folded cardboard`,
    sound: `en-sentence-8~A small bell|rings above|the shop door
en-sentence-sound-a~We hear|birds singing|in the garden|before|the street begins to wake
en-sentence-sound-b~The sound|of steady footsteps|comes closer|along the hallway|outside our room
en-sentence-sound-c~She lowers|the volume|so we can hear|the rain|against the window
en-sentence-sound-d~The spoon|rings against|the glass|as he stirs|his drink
en-sentence-sound-e~From the kitchen|comes the whistle|of the kettle|just before|it stops
en-sentence-sound-f~Dry leaves|crackle underfoot|as we walk|along the path|beside the wall
en-sentence-sound-g~He stops|turning pages|to listen|to a distant train|beyond the garden
en-sentence-sound-h~When the wind drops|we hear|water moving|over stones|in the stream|just below|the wooden bridge
en-sentence-sound-i~The piano note|fades slowly|while everyone|in the room|remains seated`,
  },
  'zh-CN': {
    home: `zh-CN-sentence-2~午后的阳光|照在|客厅的小木桌上
zh-CN-sentence-8~妈妈|把刚晒好的被子|抱进屋里|轻轻铺在|靠窗的床上
zh-CN-sentence-14~吃完晚饭|我们一起|收拾餐桌|把洗净的碗|放回柜子
zh-CN-sentence-16~窗边的猫|听见开门声|抬起头|又慢慢缩回|柔软的毯子
zh-CN-sentence-21~她在阳台|收好晾干的衣服|叠成几摞|放进|卧室的抽屉
zh-CN-sentence-23~进门以后|先把湿雨伞|放在门边|再换上|干净的拖鞋
zh-CN-sentence-27~爷爷坐在|客厅的旧藤椅上|戴好眼镜|翻开|今天的报纸
zh-CN-sentence-32~我们把|挡住过道的纸箱|搬到墙角|给门口|留出空位
zh-CN-sentence-home-a~弟弟找了半天|才从沙发下面|拿出|昨天丢失的|那只|蓝色袜子|和一颗玻璃珠
zh-CN-sentence-home-b~水壶烧开后|我关掉炉火|拿出两个杯子|放到|餐桌中间`,
    nature: `zh-CN-sentence-13~两只小鸭|游过|长满芦苇的池塘
zh-CN-sentence-20~小溪绕过|一片长满青草的坡地|慢慢汇入|山脚下的|那条河
zh-CN-sentence-31~走到湖边|我们停下脚步|看水里的倒影|随着微风|轻轻晃动
zh-CN-sentence-nature-a~一只小蟹|从石头下面钻出|横着身子|很快躲进|浅浅的水里
zh-CN-sentence-nature-b~退潮以后|沙滩上留下|细细的波纹|还有几枚|完整的贝壳
zh-CN-sentence-nature-c~沿着山路|走过一片竹林|眼前忽然出现|一座|小小的木桥
zh-CN-sentence-nature-d~风吹过|河岸边的芦苇|带起一阵轻响|惊动了|藏着的小鸟
zh-CN-sentence-nature-e~我们蹲下来|看着|一队搬运食物的蚂蚁|穿过|湿润的泥土
zh-CN-sentence-nature-f~太阳快落山时|我们沿着|弯曲的小河|慢慢往回走|远处|有几只白鸟|掠过水面
zh-CN-sentence-nature-g~雨水积在|树根旁的凹处|一只蜗牛|正沿着边缘|缓缓爬行`,
    light: `zh-CN-sentence-3~傍晚的灯光|照亮|窗边摊开的书本
zh-CN-sentence-30~清晨的一束光|穿过窗帘缝隙|落在桌上|照亮了|半页铅笔字
zh-CN-sentence-33~他把台灯|转向摊开的地图|用手指|慢慢寻找|山中的那条路
zh-CN-sentence-light-a~我们经过走廊|长长的影子|随着脚步|移过|淡黄色的墙面
zh-CN-sentence-light-b~玻璃杯边缘|映出一小片彩光|正好落在|桌布的|白色花纹上
zh-CN-sentence-light-c~太阳躲进云里|院子暗了些|过了一会儿|又恢复|原来的明亮
zh-CN-sentence-light-d~她拉开窗帘|让午后的阳光|照进屋里|晒暖了|沙发上的靠垫
zh-CN-sentence-light-e~街角的路灯|接连亮起|回家的人|慢慢走过|安静的小桥
zh-CN-sentence-light-f~关掉顶灯后|我们留下|沙发旁的台灯|让暖光|照着|茶几上的花瓶|和那本旧书
zh-CN-sentence-light-g~月光穿过树枝|在地上留下|浅浅的光斑|随着晚风|轻轻摇动`,
    weather: `zh-CN-sentence-7~细细的雨点|打湿|院子里的木板凳
zh-CN-sentence-26~天空变暗|妈妈把阳台的衣服|收进屋里|又关好|朝北的窗
zh-CN-sentence-weather-a~晨雾|慢慢散开以后|河对岸的房子|终于露出|清楚的轮廓
zh-CN-sentence-weather-b~一阵风吹来|街边的落叶|打着转向前跑|最后停在|路灯下面
zh-CN-sentence-weather-c~她走进屋里|先抖掉伞上的水|再用毛巾|擦干|湿漉漉的头发
zh-CN-sentence-weather-d~雪停以后|我们来到院子|发现每把椅子|都盖着|薄薄的雪
zh-CN-sentence-weather-e~屋檐的水珠|一滴滴落下|敲在门口的铁桶上|发出|清脆声响
zh-CN-sentence-weather-f~乌云移向远处|西边露出亮光|孩子们|隔着窗户|望着天空
zh-CN-sentence-weather-g~午后的雨|终于停了|我们推开门|看见石阶上|还有|几片吹落的叶子|紧贴着地面
zh-CN-sentence-weather-h~出门前|他看了天气预报|把一件薄外套|折好|放进背包`,
    plants: `zh-CN-sentence-18~一片新叶|从|窗台的花盆里长出
zh-CN-sentence-22~她用手指|轻轻碰了碰盆土|发现已经干了|才给|小树浇水
zh-CN-sentence-plants-a~绿藤沿着|阳台上的木架|慢慢往上爬|卷住了|细细的横杆
zh-CN-sentence-plants-b~我们把花种|装进纸袋|写上采集的日期|留到|明年春天再种
zh-CN-sentence-plants-c~一场雨过后|院里的樱花|落在青草上|像铺了|一层浅色花毯
zh-CN-sentence-plants-d~他把薄荷盆|搬离暖气旁边|放到窗前|让叶子|吹一会儿风
zh-CN-sentence-plants-e~石阶背阴处|长出一片苔藓|走近看时|还能发现|细小的水珠
zh-CN-sentence-plants-f~奶奶蹲在菜地|拔掉杂草|把松散的泥土|轻轻压在|幼苗周围
zh-CN-sentence-plants-g~出门旅行前|她给阳台的花|逐盆浇水|又把|容易晒伤的小苗|移到|有树荫的墙边
zh-CN-sentence-plants-h~我们沿着小径|寻找松果|准备带回家|放在|窗边的木盘里`,
    food: `zh-CN-sentence-5~热气腾腾的汤|摆在|刚擦干净的桌上
zh-CN-sentence-17~她把番茄|切成薄片|整齐摆在盘中|再撒上|切碎的香草
zh-CN-sentence-25~水还没烧开|我从柜子里|取出两个杯子|放在|厨房的台面上
zh-CN-sentence-29~锅里的粥|开始冒出热气|爷爷拿起勺子|贴着锅底|慢慢搅动
zh-CN-sentence-food-a~我们把剩下的面包|用布包好|收进篮子|留作|明天的早餐
zh-CN-sentence-food-b~烤箱里的杏仁|飘出香气|她戴好隔热手套|准备|取出烤盘
zh-CN-sentence-food-c~洗好的青菜|放在竹篮里沥水|水滴沿着篮底|落进|下面的盆
zh-CN-sentence-food-d~弟弟分开橘子|把一半|放进姐姐的碗里|又拿起|一片面包
zh-CN-sentence-food-e~米饭煮好后|我们关掉火|让盖好的饭锅|再放一会儿|然后|摆好碗筷|等大家吃饭
zh-CN-sentence-food-f~他用小勺|尝了一口热汤|觉得味道正好|把盐罐|放回架子`,
    reading: `zh-CN-sentence-0~一张旧书签|夹在|厚厚的画册中间
zh-CN-sentence-1~她读完一段|又看了看|开头的句子|才轻轻|合上膝头的书
zh-CN-sentence-6~遇到生词|我先记在本子上|等读完这一页|再去|查它的意思
zh-CN-sentence-9~图书馆的新书|放在矮架子上|就在|入口旁边|靠窗的位置
zh-CN-sentence-11~爷爷指着字|慢慢读出一首诗|我们坐在旁边|静静|听他读完
zh-CN-sentence-15~一张便条|从书页间滑落|飘过椅子边缘|落在|脚旁的地板上
zh-CN-sentence-19~借来的地图册|今天到期|我们带上借书证|出门|走向图书馆
zh-CN-sentence-24~她在纸片上|记下页码|把它夹进书里|准备|明天接着看
zh-CN-sentence-reading-a~读完这一章|我从书页上|抬起头来|才发现|窗外天色|已经暗下来|屋里也安静了
zh-CN-sentence-reading-b~他把喜欢的句子|抄在本子上|又在旁边|用铅笔|写下问题`,
    travel: `zh-CN-sentence-10~开往山里的列车|停在|小小的站台边
zh-CN-sentence-travel-a~我们先看清|屏幕上的站台号|再提起行李|沿台阶|走下去
zh-CN-sentence-travel-b~她把车票|夹在随身的书里|等上车坐稳后|才拿出|书来读
zh-CN-sentence-travel-c~公交车经过老桥|在面包店旁|缓缓停下|几位乘客|起身下车
zh-CN-sentence-travel-d~为避开早高峰|我们选择|沿着河边小路|步行前往|附近车站
zh-CN-sentence-travel-e~他把自行车|推进屋檐下|锁好车轮|又检查|篮子里的东西
zh-CN-sentence-travel-f~透过车窗|能看见田野|几座白色房屋|散落在|青绿色的坡上
zh-CN-sentence-travel-g~孩子们来到路口|停下脚步|等绿灯亮起|再一起|走过斑马线
zh-CN-sentence-travel-h~在终点站下车后|我们看着路牌|穿过|一条小巷|再沿着|市场的边缘|走向旧码头
zh-CN-sentence-travel-i~她把背包|放在座位下|靠着车窗|看路边的树|慢慢向后退`,
    objects: `zh-CN-sentence-12~一把旧铜钥匙|躺在|桌上的白瓷碗里
zh-CN-sentence-28~他沿着折痕|把地图叠好|轻轻抚平边角|再放进|外套的侧袋
zh-CN-sentence-objects-a~我们在木盒里|找到备用纽扣|颜色正好|配得上|那件旧衬衣
zh-CN-sentence-objects-b~她用软布|擦拭浴室的镜子|直到边缘水渍|也变得|看不清了
zh-CN-sentence-objects-c~厨房的挂钟|需要换电池|我把它取下|暂时放在|靠墙的桌边
zh-CN-sentence-objects-d~蓝色杯子|把手上有道细纹|是上次搬家时|不小心|碰出来的
zh-CN-sentence-objects-e~他先在信封上|写好地址|再取出邮票|仔细贴在|右上角
zh-CN-sentence-objects-f~家里的旧照片|装在纸盒中|每次看完|都要放回|柜子最上层
zh-CN-sentence-objects-g~缝补衬衣时|她在桌上|摆好针线盒|找出|颜色相近的线|又把小剪刀|放到手边
zh-CN-sentence-objects-h~一颗螺丝|从桌边滚落|穿过椅子下面|停在|折起的纸板旁`,
    sound: `zh-CN-sentence-4~小风铃|在|商店门口轻轻响了一声
zh-CN-sentence-sound-a~清晨街道很静|花园的鸟|开始鸣叫|声音穿过|半开的窗户
zh-CN-sentence-sound-b~走廊里传来|不急不慢的脚步声|越来越近|最后停在|门口
zh-CN-sentence-sound-c~她把收音机|调轻一些|我们就能听见|窗外的雨|落在树叶上
zh-CN-sentence-sound-d~小勺碰到玻璃杯|清脆地响了一声|他停下|把杯子|移到桌边
zh-CN-sentence-sound-e~厨房的水壶|响起哨声|很快又安静下来|奶奶起身|准备泡茶
zh-CN-sentence-sound-f~我们踩过落叶|听见沙沙声|便放慢脚步|沿着墙边|继续走
zh-CN-sentence-sound-g~远处传来火车声|他停下翻书|望向窗外|听声音|慢慢远去
zh-CN-sentence-sound-h~风停下的时候|我们站在木桥上|听见|桥下的溪水|绕过|一块块石头|轻轻地流淌
zh-CN-sentence-sound-i~最后一个琴音|慢慢消失|大家仍然坐着|没有急着|起身离开`,
  },
};
export const recallRows: Record<'en' | 'zh-CN', Rows> = {
  en: {
    home: `en-recall-5~The clean towels are on the [shelf]|chair|table
en-recall-11~She leaves her [slippers] beside the bed and opens the [curtains]|boots|blinds
en-recall-18~We keep spare [blankets] in the cupboard above the [stairs]|pillows|door
en-recall-20~The [cat] curls up on a cushion near the [radiator]|dog|window
en-recall-33~He wipes the [counter] before putting away the clean [dishes]|table|glasses
en-recall-home-a~A [basket] of washing stands beside the open kitchen [door]|pile|window
en-recall-home-b~I hang my [jacket] on the hook beside your [scarf]|coat|hat
en-recall-home-c~The [clock] strikes seven while we set the [table] for dinner|bell|tray
en-recall-home-d~After the guests leave, she folds the [napkins] and puts them in the [drawer] beneath the plates|towels|cupboard
en-recall-home-e~Our [neighbor] returns the ladder and stays for a [coffee]|friend|tea`,
    nature: `en-recall-2~A small turtle rests on the [rock]|log|bank
en-recall-6~We find a [feather] beside the path through the [woods]|shell|marsh
en-recall-17~The [river] bends sharply before it reaches the wide [valley]|stream|meadow
en-recall-28~A [heron] stands in shallow water close to the [reeds]|duck|rocks
en-recall-31~The [tide] leaves a silver shell near our [footprints] in the sand|rain|shoes
en-recall-nature-a~Across the [lake], small boats rest beneath the distant [hills]|bay|cliffs
en-recall-nature-b~An [ant] carries a crumb along the edge of a [leaf]|beetle|stone
en-recall-nature-c~We cross the [bridge] and follow the stream toward the [waterfall]|field|village
en-recall-nature-d~At the end of the walk, we collect a few [pebbles] and leave the [shells] beside the water|stones|feathers
en-recall-nature-e~The [squirrel] hides a nut in the soft ground beside a [root]|mouse|branch`,
    light: `en-recall-0~The lantern casts a [shadow] on the wall|circle|stripe
en-recall-12~A [sunbeam] reaches the table through a gap in the [blinds]|reflection|curtains
en-recall-16~She angles the [lamp] toward the map on her [desk]|torch|table
en-recall-24~The [moon] appears between clouds above the empty [street]|sun|garden
en-recall-27~A [rainbow] forms on the floor beside the glass [bowl]|reflection|jar
en-recall-32~Our [shadows] stretch across the path as we approach the [gate]|footprints|bridge
en-recall-light-a~The [candle] lights the room when the power fails after [sunset]|lantern|midnight
en-recall-light-b~He notices a [glimmer] beneath the door and checks the [hallway]|shadow|kitchen
en-recall-light-c~As the sun sinks behind the houses, a strip of [gold] remains along the edge of the [clouds]|pink|rooftops
en-recall-light-d~The [mirror] reflects a bright patch of sky onto the [ceiling]|window|floor`,
    weather: `en-recall-10~The morning [fog] hides the distant houses|rain|snow
en-recall-21~We put on our [boots] before walking through the muddy [garden]|shoes|field
en-recall-25~A sudden [gust] blows the newspaper against the wooden [fence]|breeze|gate
en-recall-weather-a~She brings an [umbrella] because the forecast predicts [showers] after lunch|raincoat|sunshine
en-recall-weather-b~The [snow] has covered every step leading down to the [road]|frost|yard
en-recall-weather-c~A [puddle] reflects the clouds beside the old [bus stop]|stream|postbox
en-recall-weather-d~By [noon] the clouds have cleared and the grass feels [dry]|dawn|wet
en-recall-weather-e~The first [raindrops] fall as we hurry back toward the [shelter]|snowflakes|cottage
en-recall-weather-f~During the night, the [wind] changes direction and blows the last dry leaves from the [tree] outside|rain|hedge
en-recall-weather-g~We leave the [windows] open to catch the cooler evening [breeze]|doors|air`,
    plants: `en-recall-8~A tiny [shoot] appears above the soil|leaf|root
en-recall-14~She plants the [seeds] in a shallow tray beside the [window]|bulbs|door
en-recall-plants-a~We tie the young [tree] gently to a sturdy wooden [stake]|vine|frame
en-recall-plants-b~The [mint] smells stronger after we brush against its green [leaves]|basil|stems
en-recall-plants-c~He adds fresh [compost] to the pots behind the garden [shed]|soil|bench
en-recall-plants-d~A [vine] curls around the railing at the edge of the [balcony]|branch|terrace
en-recall-plants-e~We move the [fern] into the shade beneath the tall [bamboo]|lily|maple
en-recall-plants-f~The [petals] drift onto the grass beside a row of [tulips]|leaves|daisies
en-recall-plants-g~Before the first frost arrives, we carry the [pots] inside and arrange them along the sunny [windowsill]|trays|shelf
en-recall-plants-h~She finds a [bud] on the rose that we planted in [spring]|thorn|autumn`,
    food: `en-recall-1~The sliced bread rests on a [board]|plate|tray
en-recall-7~We add [ginger] to the soup just before serving it in [bowls]|pepper|cups
en-recall-15~She squeezes a [lemon] over the fish and adds fresh [parsley]|lime|basil
en-recall-19~The [rice] cooks slowly while he rinses the green [beans]|pasta|peas
en-recall-food-a~I spread [honey] on toast and pour milk into my [tea]|jam|coffee
en-recall-food-b~A [peach] rolls across the counter and stops beside the [kettle]|plum|toaster
en-recall-food-c~He stirs the [porridge] and cuts a ripe [banana] into slices|soup|pear
en-recall-food-d~We pack [sandwiches] for lunch and fill two bottles with [water]|pancakes|juice
en-recall-food-e~Once the dough has risen, she shapes it into a round [loaf] and places it on the [tray]|roll|board
en-recall-food-f~The [carrots] roast in the oven beside a dish of [potatoes]|onions|tomatoes`,
    reading: `en-recall-3~The bookmark marks the start of a [chapter]|poem|story
en-recall-9~She copies a [sentence] into her notebook using a blue [pencil]|paragraph|pen
en-recall-22~We borrow an [atlas] and find the island on its first [map]|guide|page
en-recall-29~He writes the [date] at the top of a fresh [page]|title|sheet
en-recall-reading-a~The [librarian] finds our book on a shelf near the [entrance]|assistant|window
en-recall-reading-b~A faded [photograph] falls from the book onto her [lap]|bookmark|desk
en-recall-reading-c~I underline a [word] and look for its meaning in the [dictionary]|phrase|glossary
en-recall-reading-d~The [poem] describes a walk through the woods in early [winter]|story|spring
en-recall-reading-e~At the end of the [chapter], he closes the book and writes a short note in his [journal]|article|notebook
en-recall-reading-f~She reads the [title] aloud before turning to the [contents] page|author|index`,
    travel: `en-recall-travel-a~Our bus stops outside the old [market]|station|library
en-recall-travel-b~She checks the [timetable] while I carry our bags to the [platform]|map|entrance
en-recall-travel-c~We follow a narrow [lane] down to the boats in the [harbor]|path|marina
en-recall-travel-d~He puts the [ticket] in his pocket and opens his [backpack]|receipt|suitcase
en-recall-travel-e~The [train] passes a small village before entering the long [tunnel]|bus|valley
en-recall-travel-f~We leave our [bicycles] beside the shop and walk across the [bridge]|scooters|square
en-recall-travel-g~A [sign] points toward the museum at the next [crossing]|map|corner
en-recall-travel-h~She takes a [window] seat and watches the fields beyond the [town]|front|village
en-recall-travel-i~After we reach the [station], we buy a paper map and mark the route to our [hotel]|airport|campsite
en-recall-travel-j~The [ferry] arrives just as we finish our lunch beside the [pier]|boat|beach`,
    objects: `en-recall-13~A small compass lies inside the [box]|drawer|basket
en-recall-23~She measures the [shelf] with a ruler before cutting the [paper]|table|cloth
en-recall-26~He threads the [needle] and starts to mend his torn [sleeve]|hook|pocket
en-recall-objects-a~We put the [photographs] in an envelope beside the old [letters]|postcards|tickets
en-recall-objects-b~The [thermometer] hangs on the wall above a small [calendar]|clock|mirror
en-recall-objects-c~I find a loose [button] beneath the chair near my [bag]|coin|shoe
en-recall-objects-d~She sharpens the [pencil] and brushes the shavings into the [bin]|crayon|tray
en-recall-objects-e~A [ribbon] holds the folded notes inside the little wooden [chest]|string|box
en-recall-objects-f~Before sealing the parcel, he wraps the [cup] in soft paper and adds a handwritten [label] on top|bowl|card
en-recall-objects-g~He uses a [brush] to remove dust from the carved [frame]|cloth|box`,
    sound: `en-recall-4~A distant [bell] rings across the square|horn|whistle
en-recall-30~We hear a [woodpecker] tapping in the trees beyond the [fence]|blackbird|wall
en-recall-sound-a~The [doorbell] rings while she is listening to the evening [news]|telephone|music
en-recall-sound-b~A soft [rustle] comes from the leaves beside the garden [path]|crackle|gate
en-recall-sound-c~He stops the [radio] to hear someone knocking at the [door]|recording|window
en-recall-sound-d~The [kettle] whistles as a truck passes outside our [kitchen]|timer|house
en-recall-sound-e~We hear slow [footsteps] on the stairs above the quiet [hallway]|voices|bedroom
en-recall-sound-f~A [spoon] taps the cup as she reaches for the [sugar]|fork|honey
en-recall-sound-g~When the rain stops, we can hear a [frog] calling beside the pond beyond the old stone [wall]|bird|bridge
en-recall-sound-h~The last [note] fades as the musician lowers her [violin] and smiles|chord|flute`,
  },
  'zh-CN': {
    home: `zh-CN-recall-5~洗干净的毛巾整齐放在[架子]上|椅子|桌子
zh-CN-recall-11~她把[拖鞋]摆在床边又拉开朝向花园的[窗帘]|皮鞋|百叶窗
zh-CN-recall-20~我们把多余的[被子]叠好放进楼梯旁的[柜子]|枕头|箱子
zh-CN-recall-23~那只[小猫]蜷在柔软的垫子上靠着暖和的[炉子]|小狗|暖气
zh-CN-recall-29~他先擦干净[台面]然后收起架子上晾干的[碗碟]|桌面|杯子
zh-CN-recall-home-a~一篮洗好的[衣服]放在厨房门口旁边摆着[拖把]|毛巾|扫帚
zh-CN-recall-home-b~我把外套挂在[门后]的小钩上围巾则放在[椅背]|墙边|桌边
zh-CN-recall-home-c~墙上的[挂钟]敲了七下我们开始摆好吃饭的[碗筷]|闹钟|杯盘
zh-CN-recall-home-d~客人离开以后她把用过的[桌布]收好又将洗净的[茶杯]放回靠近水池的柜子|餐巾|碗碟
zh-CN-recall-home-e~隔壁的[邻居]送回借用的梯子坐下来喝了一杯[热茶]|朋友|咖啡`,
    nature: `zh-CN-recall-2~一只小乌龟趴在河边的[石头]上|木头|沙地
zh-CN-recall-6~我们在穿过树林的[小路]旁找到一根灰色的[羽毛]|河岸|树枝
zh-CN-recall-18~小河绕过那座[山丘]以后慢慢流进开阔的[山谷]|村庄|平原
zh-CN-recall-22~一只[白鹭]站在浅水里身后是一大片随风摇动的[芦苇]|野鸭|蒲草
zh-CN-recall-nature-a~退去的[潮水]把一枚贝壳留在沙滩上紧靠我们的[脚印]|浪花|鞋子
zh-CN-recall-nature-b~隔着平静的[湖面]能看见几条小船停在远处的[山脚]|水湾|岸边
zh-CN-recall-nature-c~小小的[蚂蚁]搬着面包屑沿着一片宽大的[叶子]往前走|甲虫|石头
zh-CN-recall-nature-d~我们穿过[木桥]顺着溪流继续走向山里的那道[瀑布]|草地|石门
zh-CN-recall-nature-e~走到海边的小路尽头我们捡起几颗光滑的[石子]把那些漂亮的[贝壳]留在原处|沙粒|树枝
zh-CN-recall-nature-f~一只[松鼠]把坚果藏进松软的泥土就在粗大的[树根]旁|田鼠|石块`,
    light: `zh-CN-recall-0~窗边的小灯在墙上投下一片[影子]|亮光|倒影
zh-CN-recall-12~一束[阳光]穿过百叶窗的缝隙照亮桌上的那本[画册]|灯光|字典
zh-CN-recall-21~她把[台灯]转向桌上的地图仔细寻找标着红点的[小路]|手电|河流
zh-CN-recall-27~深夜的[月亮]从云层后面露出照着空无一人的[街道]|星星|广场
zh-CN-recall-32~玻璃碗旁出现一小片[彩光]映在厨房浅色的[地砖]上|阴影|墙面
zh-CN-recall-light-a~我们的[影子]在小路上越拉越长一直伸向花园的[木门]|脚印|围栏
zh-CN-recall-light-b~停电以后他点亮[蜡烛]放在餐桌上等窗外最后的[晚霞]散去|油灯|夕阳
zh-CN-recall-light-c~他发现门缝里透出一线[亮光]便起身去查看外面的[走廊]|月光|厨房
zh-CN-recall-light-d~太阳落到屋顶后面时天边还留着一条[金色]的光带照亮远处层层叠叠的[云朵]|粉色|山峰
zh-CN-recall-light-e~挂在墙上的[镜子]把窗外明亮的天空映到白色的[天花板]|玻璃|地板`,
    weather: `zh-CN-recall-10~清晨的[薄雾]遮住了河对岸的房子|细雨|白雪
zh-CN-recall-13~出门之前我们换上[雨靴]准备穿过积水很多的[院子]|布鞋|草地
zh-CN-recall-17~一阵突然刮起的[大风]把报纸吹到院里那道[木栅栏]上|微风|石围墙
zh-CN-recall-31~她看完预报带上[雨伞]因为下午可能会有一阵[小雨]|外套|小雪
zh-CN-recall-weather-a~夜里的[积雪]盖住每一级台阶一直延伸到门前的[马路]|白霜|草坪
zh-CN-recall-weather-b~老车站旁有一汪[积水]里面倒映着缓缓移动的[白云]|溪水|树影
zh-CN-recall-weather-c~到了[中午]天空终于放晴院里的草地也渐渐变得[干燥]|傍晚|湿润
zh-CN-recall-weather-d~第一阵[雨点]落下时我们正赶回小路尽头的[凉亭]|雪花|木屋
zh-CN-recall-weather-e~半夜里窗外的[北风]忽然转了方向吹落了院子里那棵[梧桐]上最后几片干叶|南风|银杏
zh-CN-recall-weather-f~我们把[窗户]敞开让傍晚凉快的[微风]吹进闷热的屋子|房门|空气`,
    plants: `zh-CN-recall-8~一棵小小的[嫩芽]钻出了松软的泥土|幼苗|青草
zh-CN-recall-15~她把[种子]撒进浅浅的育苗盘再把盘子搬到[窗前]|球茎|门边
zh-CN-recall-26~我们用软绳把新栽的[小树]轻轻绑在结实的[木桩]上|藤蔓|竹架
zh-CN-recall-plants-a~手指碰过[薄荷]以后会留下淡淡清香来自绿色的[叶片]|罗勒|枝茎
zh-CN-recall-plants-b~他往花盆里添了一点[堆肥]然后把它们放回[棚子]后面|泥土|长椅
zh-CN-recall-plants-c~一根细细的[藤蔓]绕过栏杆慢慢爬到小小的[阳台]边上|树枝|露台
zh-CN-recall-plants-d~我们把[蕨草]搬到阴凉处放在高大的[竹子]下面避开日晒|兰花|枫树
zh-CN-recall-plants-e~浅色的[花瓣]飘到草地上落在一排刚开的[郁金香]旁边|落叶|风信子
zh-CN-recall-plants-f~第一场霜到来之前我们把阳台上的[花盆]搬进屋里沿着朝南的[窗台]一字排开|苗盘|架子
zh-CN-recall-plants-g~她在去年[春天]种下的月季枝头发现了一颗小小的[花苞]|秋天|尖刺`,
    food: `zh-CN-recall-1~切好的面包整齐摆在木头[砧板]上|托盘|碟子
zh-CN-recall-7~汤快煮好时我们放入一点[生姜]再把热汤盛进[瓷碗]|胡椒|杯子
zh-CN-recall-33~她在烤鱼上挤了些[柠檬]汁然后撒上刚切好的[香菜]|青柠|罗勒
zh-CN-recall-food-a~锅里的[米饭]慢慢煮着他在水池旁清洗新鲜的[豆角]|面条|豌豆
zh-CN-recall-food-b~我给面包抹上薄薄的[蜂蜜]再往杯里的[红茶]加一点奶|果酱|咖啡
zh-CN-recall-food-c~一颗[桃子]沿着台面滚过去最后停在白色的[水壶]旁边|李子|烤箱
zh-CN-recall-food-d~他一边搅动锅里的[燕麦粥]一边把熟透的[香蕉]切成薄片|蔬菜汤|苹果
zh-CN-recall-food-e~我们准备了午餐吃的[三明治]又往两个水瓶里灌满[清水]|煎饼|果汁
zh-CN-recall-food-f~面团发好以后她把它揉成圆圆的[面包]放在铺好纸的[烤盘]中间等着入炉|馒头|木板
zh-CN-recall-food-g~烤箱里一盘[胡萝卜]正在变软旁边还有切成小块的[土豆]|洋葱|番茄`,
    reading: `zh-CN-recall-3~书签正好夹在下一[章节]开始的地方|故事|段落
zh-CN-recall-9~她用蓝色的[铅笔]把刚读到的一句[诗]抄进随身的本子|钢笔|词
zh-CN-recall-24~我们借来一本[地图册]在第一页找到那座小岛的[位置]|旅行书|名字
zh-CN-recall-30~他在新的一页纸上写好[日期]又在旁边标注这次的[题目]|天气|页码
zh-CN-recall-reading-a~图书馆的[管理员]帮我们找到一本书就在[入口]旁的架子上|志愿者|窗户
zh-CN-recall-reading-b~一张褪色的[照片]从旧书里面滑出来落在她的[膝盖]上|书签|脚边
zh-CN-recall-reading-c~我在那个生词下面画了一道[横线]准备读完以后再查[字典]|波浪线|词表
zh-CN-recall-reading-d~这首[小诗]写的是一次林间散步那时正好是寒冷的[冬天]|散文|秋天
zh-CN-recall-reading-e~读完最后一段[故事]他合上书从包里拿出蓝色的[日记本]写下自己的感想|文章|练习册
zh-CN-recall-reading-f~她先轻声念出这本书的[名字]再翻到前面的[目录]寻找章节|作者|索引`,
    travel: `zh-CN-recall-travel-a~我们坐的公交车停在老[市场]的外面|车站|书店
zh-CN-recall-travel-b~她低头查看[时刻表]我把两个人的行李提到前面的[站台]|地图|入口
zh-CN-recall-travel-c~我们沿着狭窄的[小巷]往下走去看停在[港口]里的渔船|石路|码头
zh-CN-recall-travel-d~他把刚买的[车票]放进口袋再打开[背包]拿出一瓶水|收据|行李箱
zh-CN-recall-travel-e~这趟[列车]经过一个小村庄以后就要驶入长长的[隧道]|客车|山谷
zh-CN-recall-travel-f~我们把[自行车]停在小店旁边准备步行穿过前面的[石桥]|滑板车|广场
zh-CN-recall-travel-g~路边的[指示牌]告诉我们博物馆就在下一个[路口]的右边|地图册|街角
zh-CN-recall-travel-h~她选了一个靠[窗边]的座位看着[城镇]外面连绵的田野|过道|村庄
zh-CN-recall-travel-i~到达[车站]以后我们买了一张地图用铅笔标出从这里步行前往[旅馆]的路线|机场|营地
zh-CN-recall-travel-j~我们刚在[码头]边吃完午饭远处的那艘[渡船]就慢慢靠岸了|沙滩|游艇`,
    objects: `zh-CN-recall-14~一个小小的指南针放在木头[盒子]里|抽屉|篮子
zh-CN-recall-16~她先用[尺子]量好书架的宽度再裁下大小合适的[纸张]|卷尺|布料
zh-CN-recall-19~他把线穿进[针眼]然后开始缝补衬衣上破了一个洞的[袖口]|线圈|口袋
zh-CN-recall-25~我们把几张[照片]装进信封放在那一摞旧[信件]的旁边|明信片|车票
zh-CN-recall-28~墙上挂着一支[温度计]下面是一本翻到九月的小[日历]|湿度计|挂图
zh-CN-recall-objects-a~我在椅子下面发现一枚松脱的[纽扣]就在自己的[书包]旁边|硬币|鞋子
zh-CN-recall-objects-b~她削好手里的[铅笔]用小刷子把木屑扫进桌边的[纸篓]|蜡笔|托盘
zh-CN-recall-objects-c~一根蓝色的[丝带]捆着折好的便条放在小小的[木箱]里面|棉绳|铁盒
zh-CN-recall-objects-d~封好包裹前他用软纸仔细裹住那只[杯子]又在最上面放了一张手写的[卡片]|碗碟|标签
zh-CN-recall-objects-e~他拿起一把柔软的[刷子]慢慢清理雕花[相框]缝隙里的灰尘|抹布|木盒`,
    sound: `zh-CN-recall-4~远处传来一声[钟响]越过安静的广场|汽笛|鸟鸣
zh-CN-recall-sound-a~我们听见[啄木鸟]在围墙外的树上敲击旁边偶尔传来[蝉声]|喜鹊|鸟鸣
zh-CN-recall-sound-b~她正听着晚间[新闻]门口的[门铃]忽然清脆地响了一下|音乐|电话
zh-CN-recall-sound-c~花园小路旁传来轻轻的[沙沙声]原来是风吹动了[落叶]|噼啪声|树枝
zh-CN-recall-sound-d~他关掉正在播放的[收音机]侧耳听有没有人敲外面的[房门]|录音机|窗户
zh-CN-recall-sound-e~水壶发出短短的[哨声]同时一辆[卡车]从厨房外的路上经过|铃声|客车
zh-CN-recall-sound-f~安静的楼道里传来缓慢的[脚步声]是楼上[邻居]刚刚回来了|说话声|房东
zh-CN-recall-sound-g~她伸手去拿[糖罐]时桌上的小勺轻轻碰响了旁边的[杯子]|蜜罐|碗碟
zh-CN-recall-sound-h~雨停以后我们坐在窗边听见院外池塘里的[青蛙]在叫声音越过那道旧[石墙]|小鸟|木桥
zh-CN-recall-sound-i~最后一个[音符]慢慢消失演奏的人放下[小提琴]向大家微笑|和弦|长笛`,
  },
};
