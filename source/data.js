// Shared itinerary content for all three designs.
// Placeholder activity names (bilingual EN + 中文); real city/date framing.

let _id = 0;
const uid = () => 'x' + (++_id);

// helper to build a map URL from a placeholder query
const map = (q) => 'https://maps.apple.com/?q=' + encodeURIComponent(q);

// nearby item factory
const near = (type, en, zh, distance, note_en, note_zh) => ({
  type,
  name: { en, zh },
  distance,
  address: { text: 'Nearby address ' + '附近地址', mapUrl: map(en) },
  note: { en: note_en, zh: note_zh },
});

// item factory
const item = (time, type, en, zh, hoodEn, hoodZh, addrEn, addrZh, booking, descEn, descZh, nearby) => ({
  id: uid(),
  time,
  type, // activity | meal | sight | transit
  name: { en, zh },
  neighborhood: { en: hoodEn, zh: hoodZh },
  address: { text: addrEn + '  ' + addrZh, mapUrl: map(en + ' ' + addrEn) },
  bookingRequired: !!booking,
  desc: { en: descEn, zh: descZh },
  nearby: nearby || [],
});

const day = (date, dayLabel, titleEn, titleZh, items) => ({ date, dayLabel, title: { en: titleEn, zh: titleZh }, items });

// ---- reusable nearby clusters (placeholder) ----
const nb1 = [
  near('sight', 'Old Clock Tower', '老钟楼', '150 m', 'Great photo spot', '绝佳拍照点'),
  near('restaurant', 'Corner Noodle Shop', '转角面店', '200 m', 'Quick local bite', '地道小吃'),
  near('activity', 'Riverside Walk', '沿江步道', '300 m', 'Easy 20-min stroll', '轻松漫步 20 分钟'),
];
const nb2 = [
  near('sight', 'Hidden Garden', '隐秘花园', '250 m', 'Quiet courtyard', '宁静庭院'),
  near('restaurant', 'Tea & Dessert House', '茶点屋', '180 m', 'Try the sweet soup', '试试糖水'),
];
const nb3 = [
  near('restaurant', 'Street Food Stall', '街头小吃', '120 m', 'Cash only', '仅收现金'),
  near('activity', 'Craft Workshop', '手工工坊', '400 m', 'Drop-in classes', '可现场体验'),
  near('sight', 'View Terrace', '观景露台', '350 m', 'Sunset views', '日落美景'),
];

const D = 'A short placeholder description of this stop goes here — swap in your real notes later.';
const Dz = '这里是该行程的占位描述，稍后可替换为你的真实备注。';

// ============================ GUANGZHOU ============================
const guangzhou = {
  id: 'gz',
  name: { en: 'Guangzhou', zh: '广州' },
  dateRange: 'Jul 26 – 29',
  hotel: {
    name: { en: 'Riverside Hotel', zh: '江畔酒店' },
    address: { text: '88 Riverside Rd  江滨路 88 号', mapUrl: map('Riverside Hotel Guangzhou') },
    phone: '+86 20 8888 6666', confirmation: 'RVS-88231',
    checkIn: { time: '15:00', note: { en: 'Check in at the Level 1 front desk — please have every guest’s passport ready.', zh: '请于一楼前台办理入住，并备好每位客人的护照。' } },
    checkOut: { time: '12:00', note: { en: 'Free luggage storage available after checkout.', zh: '退房后可免费寄存行李。' } },
    wifi: { en: 'Free Wi-Fi · network “Riverside-Guest”, no password', zh: '免费 Wi-Fi · 网络“Riverside-Guest”，无需密码' },
    notes: [{ en: 'Breakfast buffet 7:00–10:00, Level 2', zh: '自助早餐 7:00–10:00，二楼' }, { en: '24-hour front desk & concierge', zh: '24 小时前台与礼宾服务' }],
  },
  mustEats: [
    { name: { en: 'Morning Dim Sum', zh: '早茶点心' }, note: { en: 'Shrimp dumplings & buns', zh: '虾饺与包点' } },
    { name: { en: 'Wonton Noodles', zh: '云吞面' }, note: { en: 'Springy egg noodles', zh: '弹牙鸡蛋面' } },
    { name: { en: 'Roast Goose', zh: '烧鹅' }, note: { en: 'Crispy skin classic', zh: '脆皮经典' } },
    { name: { en: 'Rice Noodle Rolls', zh: '肠粉' }, note: { en: 'Silky steamed rolls', zh: '滑嫩蒸卷' } },
    { name: { en: 'Double-skin Milk', zh: '双皮奶' }, note: { en: 'Warm milk custard', zh: '温热奶羹' } },
    { name: { en: 'Char Siu', zh: '叉烧' }, note: { en: 'Honey-glazed pork', zh: '蜜汁叉烧' } },
    { name: { en: 'Claypot Rice', zh: '煲仔饭' }, note: { en: 'Sizzling rice with cured meats', zh: '腊味煲仔饭，锅巴香脆' } },
  ],
  days: [
    day('Jul 26', 'Sat', 'Arrival & Old Town', '抵达与老城', [
      item('14:00', 'transit', 'Hotel Check-in', '酒店入住', 'Riverside', '江畔', 'Riverside Rd', '江滨路', false, D, Dz, nb1),
      item('16:30', 'sight', 'Old Town Stroll', '老城漫步', 'Old Town', '老城区', 'Heritage Lane', '老街', false, D, Dz, nb2),
      item('19:00', 'meal', 'Welcome Dinner', '接风晚餐', 'Old Town', '老城区', '12 Food St', '美食街 12 号', true, D, Dz, nb3),
    ]),
    day('Jul 27', 'Sun', 'Riverside & Markets', '江畔与市集', [
      item('09:00', 'meal', 'Morning Tea', '早茶', 'Downtown', '市中心', '3 Teahouse Rd', '茶楼路 3 号', true, D, Dz, nb3),
      item('11:00', 'activity', 'Local Market', '本地市集', 'Downtown', '市中心', 'Market Sq', '市集广场', false, D, Dz, nb1),
      item('15:00', 'sight', 'Canton Tower Area', '广州塔周边', 'Riverside', '江畔', 'Tower Plaza', '塔前广场', true, D, Dz, nb2),
      item('20:00', 'activity', 'River Night Cruise', '珠江夜游', 'Riverside', '江畔', 'Ferry Pier', '渡轮码头', true, D, Dz, nb1),
    ]),
    day('Jul 28', 'Mon', 'Temples & Tea', '寺庙与茶', [
      item('09:30', 'sight', 'Historic Temple', '历史寺庙', 'West District', '西区', 'Temple Rd', '寺庙路', false, D, Dz, nb2),
      item('12:30', 'meal', 'Dim Sum Lunch', '点心午餐', 'West District', '西区', '9 Garden Rd', '花园路 9 号', false, D, Dz, nb3),
      item('16:00', 'activity', 'Art District', '艺术区', 'North', '北区', 'Creative Park', '创意园', false, D, Dz, nb1),
    ]),
    day('Jul 29', 'Tue', 'Departure to Shanghai', '前往上海', [
      item('09:00', 'meal', 'Farewell Breakfast', '告别早餐', 'Riverside', '江畔', 'Hotel Cafe', '酒店咖啡厅', false, D, Dz, nb2),
      item('12:00', 'transit', 'High-speed Rail', '高铁', 'Station', '车站', 'South Station', '南站', true, D, Dz, nb1),
    ]),
  ],
};

// ============================ SHANGHAI ============================
const shanghai = {
  id: 'sh',
  name: { en: 'Shanghai', zh: '上海' },
  dateRange: 'Jul 29 – Aug 2',
  hotel: {
    name: { en: 'The Bund Hotel', zh: '外滩酒店' },
    address: { text: '1 Bund Ave  外滩大道 1 号', mapUrl: map('The Bund Hotel Shanghai') },
    phone: '+86 21 6000 1888', confirmation: 'BND-45102',
    checkIn: { time: '14:00', note: { en: 'Front desk is in the 3rd-floor lobby, overlooking the river.', zh: '前台位于三楼大堂，可俯瞰江景。' } },
    checkOut: { time: '12:00', note: { en: 'Late checkout until 14:00 on request.', zh: '可申请延迟退房至 14:00。' } },
    wifi: { en: 'Free Wi-Fi · “Bund-Guest” · password on your key card', zh: '免费 Wi-Fi · “Bund-Guest” · 密码见房卡' },
    notes: [{ en: 'Rooftop breakfast 7:00–10:30', zh: '天台早餐 7:00–10:30' }, { en: 'Gym & pool on Level 5', zh: '健身房与泳池位于五楼' }],
  },
  mustEats: [
    { name: { en: 'Xiaolongbao', zh: '小笼包' }, note: { en: 'Soup dumplings', zh: '汤汁小笼' } },
    { name: { en: 'Pan-fried Buns', zh: '生煎包' }, note: { en: 'Crispy bottoms', zh: '脆底多汁' } },
    { name: { en: 'Red-braised Pork', zh: '红烧肉' }, note: { en: 'Sweet & savory', zh: '浓油赤酱' } },
    { name: { en: 'Scallion Oil Noodles', zh: '葱油拌面' }, note: { en: 'Simple & fragrant', zh: '香气扑鼻' } },
    { name: { en: 'Hairy Crab', zh: '大闸蟹' }, note: { en: 'Seasonal treat', zh: '应季美味' } },
    { name: { en: 'Shanghai Wontons', zh: '上海馄饨' }, note: { en: 'Light & comforting', zh: '清淡暖胃' } },
    { name: { en: 'Sweet-and-sour Ribs', zh: '糖醋小排' }, note: { en: 'Tangy Shanghai classic', zh: '本帮酸甜' } },
  ],
  days: [
    day('Jul 29', 'Tue', 'Arrival & The Bund', '抵达与外滩', [
      item('16:00', 'transit', 'Hotel Check-in', '酒店入住', 'The Bund', '外滩', 'Bund Ave', '外滩大道', false, D, Dz, nb1),
      item('18:30', 'sight', 'Bund Waterfront', '外滩滨江', 'The Bund', '外滩', 'Riverfront', '滨江大道', false, D, Dz, nb2),
      item('20:00', 'meal', 'Riverside Dinner', '滨江晚餐', 'The Bund', '外滩', '5 Bund Ave', '外滩大道 5 号', true, D, Dz, nb3),
    ]),
    day('Jul 30', 'Wed', 'Old City & Gardens', '老城与园林', [
      item('09:30', 'sight', 'Classical Garden', '古典园林', 'Old City', '老城厢', 'Garden Rd', '豫园路', true, D, Dz, nb2),
      item('12:00', 'meal', 'Soup Dumpling Lunch', '小笼午餐', 'Old City', '老城厢', 'Bridge St', '九曲桥', false, D, Dz, nb3),
      item('15:00', 'activity', 'Bazaar Shopping', '老街购物', 'Old City', '老城厢', 'Market Alley', '商业街', false, D, Dz, nb1),
    ]),
    day('Jul 31', 'Thu', 'Modern Shanghai', '现代上海', [
      item('10:00', 'sight', 'Skyline Observation', '天际观光', 'Pudong', '浦东', 'Tower Deck', '观光层', true, D, Dz, nb2),
      item('13:00', 'meal', 'Rooftop Lunch', '天台午餐', 'Pudong', '浦东', '88F', '88 层', true, D, Dz, nb3),
      item('16:00', 'activity', 'Riverside Art Museum', '滨江美术馆', 'West Bund', '西岸', 'Art Ave', '龙腾大道', true, D, Dz, nb1),
    ]),
    day('Aug 1', 'Fri', 'Lanes & Cafes', '弄堂与咖啡', [
      item('10:00', 'activity', 'Plane-tree Lanes', '梧桐弄堂', 'Former Concession', '前租界', 'Leafy St', '法桐街', false, D, Dz, nb1),
      item('12:30', 'meal', 'Lane House Cafe', '老洋房咖啡', 'Former Concession', '前租界', 'Cafe Lane', '咖啡弄', false, D, Dz, nb2),
      item('19:30', 'meal', 'Farewell Feast', '告别晚宴', 'Downtown', '市中心', 'Grand Hall', '宴会厅', true, D, Dz, nb3),
    ]),
    day('Aug 2', 'Sat', 'Departure to Beijing', '前往北京', [
      item('10:00', 'meal', 'Quick Breakfast', '简单早餐', 'The Bund', '外滩', 'Hotel Cafe', '酒店咖啡厅', false, D, Dz, nb1),
      item('13:00', 'transit', 'High-speed Rail', '高铁', 'Station', '车站', 'Hongqiao', '虹桥', true, D, Dz, nb2),
    ]),
  ],
};

// ============================ BEIJING ============================
// Real finalized itinerary (source: FinalizedBeijing.md). Addresses & Amap links verbatim.

// stop factory with a real address + Amap URL
const itemB = (time, type, en, zh, hoodEn, hoodZh, addr, url, booking, descEn, descZh, nearby) => ({
  id: uid(),
  time,
  type,
  name: { en, zh },
  neighborhood: { en: hoodEn, zh: hoodZh },
  address: { text: addr, mapUrl: url },
  bookingRequired: !!booking,
  desc: { en: descEn, zh: descZh },
  nearby: nearby || [],
});
// nearby factory with a real address + Amap URL
const nearB = (type, en, zh, note_en, note_zh, addr, url) => ({
  type,
  name: { en, zh },
  distance: '',
  address: { text: addr, mapUrl: url },
  note: { en: note_en, zh: note_zh },
});

const BJ_HOTEL_ADDR = '北京市朝阳区工人体育场北路21号爱奇艺青春中心F5层';
const BJ_HOTEL_MAP = 'https://www.amap.com/place/B0K2HAEXUI';
const BJ_AIRPORT_ADDR = '北京市朝阳区首都机场路11号';
const BJ_AIRPORT_MAP = 'https://www.amap.com/place/B000A28DAE';
const nearTheBox = nearB('shopping', 'THE BOX Chaowai Young Power Center', 'THE BOX 朝外|年轻力中心',
  'About 10–15 min away; youth-culture retail, streetwear, exhibitions, and photogenic interiors.',
  '约10–15分钟路程；青年文化零售、街头潮牌、展览与出片的室内空间。',
  '北京市朝阳区朝外大街12号', 'https://www.amap.com/place/B0IRRUF3C1');
const nearXiadu = nearB('activity', 'Xiadu Park', '夏都公园',
  'About 20–30 minutes by car on the onward route; lakeside paths and public sculpture.',
  '顺路驾车约20–30分钟；湖畔步道与公共雕塑。',
  '北京市延庆区湖北西路2号', 'https://www.amap.com/place/B000A52109');

const beijing = {
  id: 'bj',
  name: { en: 'Beijing', zh: '北京' },
  dateRange: 'Aug 2 – 6',
  hotel: {
    name: { en: 'Miyue LOFT Duplex Homestay — Sanlitun Workers’ Stadium', zh: '复式|蜜悦民宿(三里屯·工人体育场地铁站店)' },
    address: { text: BJ_HOTEL_ADDR, mapUrl: BJ_HOTEL_MAP },
    phone: '+86 185 1111 1664', confirmation: '1227103978064815',
    checkIn: { time: '14:00', note: { en: 'Add the housekeeper’s WeChat (+86 185 1111 1664) for the host meet-up at Building 21.', zh: '请添加管家微信（+86 185 1111 1664），在21号楼与房东会合。' } },
    checkOut: { time: '12:00', note: { en: 'Confirm bag storage until 16:30.', zh: '确认行李可寄存至16:30。' } },
    wifi: { en: 'Premium Wi-Fi included, no password', zh: '包含高级 Wi-Fi，无需密码' },
    notes: [
      { en: 'See the Check-In Guide for directions to the entrance', zh: '入口路线请参见入住指南' },
      { en: 'Confirm overnight parking for the rental car', zh: '确认租车的过夜停车安排' },
      { en: 'Massage booking', zh: '预约按摩' },
    ],
    nearby: [
      nearTheBox,
      nearB('sight', 'Beijing Dongyue Temple', '北京东岳庙',
        'About 10 minutes by transit; a distinctive Taoist temple complex with folk-culture displays.',
        '乘车约10分钟；独具特色的道教庙宇建筑群，设有民俗文化展。',
        '北京市朝阳区朝阳门外大街141号', 'https://www.amap.com/place/B000A7HEUS'),
      nearB('sight', 'Beijing Workers’ Stadium', '北京工人体育场',
        'About 5–10 minutes on foot; circle the rebuilt stadium exterior and check event-day access before setting out.',
        '步行约5–10分钟；可绕行新工体外围，出发前请确认赛事日的通行安排。',
        '北京市朝阳区工人体育场北路1号', 'https://www.amap.com/place/B000A7CJLQ'),
      nearB('shopping', 'Sanlitun SOHO Centre', '三里屯SOHO商场',
        'About 10–15 minutes on foot; use the plaza for casual food, convenience shopping, and a low-commitment evening wander.',
        '步行约10–15分钟；广场适合简餐、便利购物和轻松的夜间闲逛。',
        '北京市朝阳区工人体育场北路8号三里屯soho', 'https://www.amap.com/place/B0LRN6L0H1'),
    ],
  },
  mustEats: [
    { name: { en: 'Peking Duck', zh: '北京烤鸭' }, note: { en: 'Crisp & carved tableside', zh: '脆皮现片' } },
    { name: { en: 'Zhajiangmian', zh: '炸酱面' }, note: { en: 'Savory bean-paste noodles', zh: '酱香拌面' } },
    { name: { en: 'Jianbing', zh: '煎饼' }, note: { en: 'Breakfast crepe', zh: '街头早餐' } },
    { name: { en: 'Copper-pot Hot Pot', zh: '铜锅涮肉' }, note: { en: 'Lamb & sesame sauce', zh: '涮羊配麻酱' } },
    { name: { en: 'Douzhi', zh: '豆汁' }, note: { en: 'For the adventurous', zh: '老北京风味' } },
    { name: { en: 'Candied Hawthorn', zh: '冰糖葫芦' }, note: { en: 'Sweet-tart skewer', zh: '酸甜串子' } },
    { name: { en: 'Fried Liver Stew', zh: '炒肝' }, note: { en: 'Garlicky classic breakfast', zh: '蒜香浓稠，老北京早点' } },
  ],
  days: [
    day('Aug 2', 'Sun', 'Arrival, Sanlitun, Peking Duck, Rest', '抵达·三里屯·烤鸭·休整', [
      itemB('12:00', 'transit', 'Arrival — Beijing Capital International Airport', '抵达·北京首都国际机场', 'Shunyi', '顺义区',
        BJ_AIRPORT_ADDR, BJ_AIRPORT_MAP, false,
        'Domestic flight from Shanghai; compare taxi vs transit price and time. No rush today.',
        '从上海乘国内航班抵达；比较打车与公共交通的价格和时间。今天不赶时间。'),
      itemB('13:30', 'admin', 'Check in to Hotel', '办理酒店入住', 'Chaoyang', '朝阳区',
        BJ_HOTEL_ADDR, BJ_HOTEL_MAP, false,
        'Check in, and drop bags at the room if it isn’t ready yet.',
        '办理入住；如房间尚未备好，先寄存行李。'),
      itemB('15:00', 'shopping', 'Explore Taikoo Li Sanlitun Mall', '三里屯太古里', 'Chaoyang', '朝阳区',
        '北京市朝阳区三里屯路11、19号院(工人体育场地铁站D口步行240米)', 'https://www.amap.com/place/B0FFFT5A1C', false,
        'Browse the open-air fashion district, have some snacks, get ready for dinner, chill.',
        '逛逛露天时尚街区，吃点小食，为晚餐做准备，放松一下。', [
        nearB('shopping', 'POP MART Global Flagship Store', 'POP MART泡泡玛特(三里屯太古里南区店)',
          'About 2–5 minutes on foot; Beijing releases, large figures, and blind-box displays.',
          '步行约2–5分钟；北京限定、大型手办与盲盒陈列。',
          '北京市朝阳区三里屯路19号院三里屯太古里南区LG层SLG58', 'https://www.amap.com/place/B0FFH7RFH4'),
        nearB('activity', 'GENTLE MONSTER BEIJING', 'GENTLE MONSTER(北京SKP-S店)',
          'About 5–10 minutes on foot; surreal retail installations.',
          '步行约5–10分钟；超现实零售艺术装置。',
          '北京市朝阳区建国路86号SKP-S南馆3层D3009', 'https://www.amap.com/place/B0H6YS82L0'),
        nearB('shopping', 'Page One Bookstore', '中信书店(北京朝悦店)',
          'About 5–10 minutes on foot; design books, magazines.',
          '步行约5–10分钟；设计类书籍与杂志。',
          '北京市朝阳区北京城区朝阳北路101号朝阳大悦城9层中信书店(6号/4号电梯直达)', 'https://www.amap.com/place/B0MR6L15D6'),
        nearB('shopping', 'Sanlitun 3.3 Building', '三里屯3.3大厦',
          'About 5–10 minutes on foot; independent fashion stalls and compact local-label browsing.',
          '步行约5–10分钟；独立时装摊位与本土品牌小店。',
          '北京市朝阳区三里屯路33号', 'https://www.amap.com/place/B000A80TPS'),
      ]),
      itemB('18:00', 'meal', 'Siji Minfu Roast Duck (Dongsi Shitiao Branch)', '四季民福烤鸭店（东四十条店）', 'Dongcheng', '东城区',
        '北京市东城区东四街道平安大街东四十条21号', 'https://www.amap.com/place/B000A8WB65', true,
        'Online queue number for seven, or drop by to pick up a physical waitlist card; confirm details about reservations.',
        '线上取七人的排队号，或到店领取实体等位卡；确认预订相关细节。', [
        nearB('sight', 'Nanxincang Cultural and Leisure Street', '南新仓文化休闲街',
          'Located at the same address; preserved 600-year-old Ming–Qing imperial granaries converted into a street.',
          '就在同一地址；由600年历史的明清皇家粮仓改建而成的文化休闲街。',
          '北京市东城区东四十条22号(近东门仓胡同)', 'https://www.amap.com/place/B000A87GGJ'),
        nearB('sight', 'Longfusi Cultural District', '隆福寺街区',
          'Short Didi ride west; a fashionable old-Beijing renewal district mixing design shops, outdoor brands, collectibles, creative food and rooftop city views.',
          '向西打车片刻即到；时髦的老北京更新街区，汇集设计小店、户外品牌、潮玩、创意美食与天台城景。',
          '北京市东城区隆福寺街95号(东四地铁站E西北口步行210米)', 'https://www.amap.com/place/B0L2U9FKU9'),
      ]),
      itemB('20:30', 'wellness', 'Zhengyuan Blind Massage', '正元盲人按摩(东直门南大街2号院店)', 'Dongzhimenwai', '东直门',
        '北京市东城区东直门南大街甲2号(东直门地铁站C东南口步行330米)', 'https://www.amap.com/place/B0HRPY3B7T', true,
        'Approximately 104–114 CNY per person; can look at alternatives or Dianping for coupons.',
        '约每人104–114元；也可比较其他店，或在大众点评找优惠券。', [
        nearB('wellness', 'Foot Massage Liangzi (Sanlitun–Dongzhimen Branch)', '良子头等舱(三里屯东直门工体店)',
          'Request one 60–90 minute session in one big room; check for coupons on Dianping, reservations required.',
          '要求安排在同一间大房做60–90分钟；在大众点评查优惠券，需预约。',
          '北京市朝阳区北京城区东直门外大街23号', 'https://www.amap.com/place/B000A7Z4K7'),
        nearB('wellness', 'Juxin Conditioning Massage', '聚鑫调理按摩（北京站朝内南小街店）',
          '98–100 CNY per person; check for coupons on Dianping, reservations recommended.',
          '每人98–100元；在大众点评查优惠券，建议预约。',
          '北京市东城区朝内南小街22号楼首层1号', 'https://www.amap.com/place/B0LR275NET'),
      ]),
    ]),
    day('Aug 3', 'Mon', 'Badaling, Yanqing Road Trip', '八达岭·延庆自驾', [
      itemB('06:00', 'admin', 'Rental Car Drop-off at Our Hotel', '租车送至酒店', 'Chaoyang', '朝阳区',
        BJ_HOTEL_ADDR, BJ_HOTEL_MAP, true,
        'Rent on Dianping. Arrange for hotel drop-off. Confirm driving restrictions.',
        '在大众点评租车，安排送车到酒店，确认限行规定。'),
      itemB('06:15–07:30', 'transit', 'Drive to Badaling', '驾车前往八达岭长城地面停车场', 'Yanqing District', '延庆区',
        '北京市延庆区G6京藏高速58号出口', 'https://www.amap.com/place/B000A8WDPU', false,
        'Use Amap routing and the assigned parking / shuttle plan.',
        '使用高德导航，按指定的停车与接驳方案前往。'),
      itemB('08:00–11:30', 'sight', 'Badaling Great Wall', '八达岭长城', 'Badaling', '八达岭',
        '北京市延庆区G6京藏高速58号出口', 'https://www.amap.com/place/B000A45467', true,
        'Take the North cableway to N7, climb through N8, regroup beyond the N9–N10 chokepoints, descend near N11, and exit via Bear Park. Expect moderate-to-hard uneven stairs, almost no shade, and exposed weather: carry 0.75–1 L water each, wear grippy shoes, and leave for lightning, high wind, or an official closure. To add route / visit plan information here.',
        '乘北线索道至北7楼，徒步经北8楼，过北9–北10楼拥堵点后集合，在北11楼附近下城，经熊乐园出口离开。台阶高低不平、难度中上，几乎无遮阴且天气多变：每人携带0.75–1升水，穿防滑鞋；遇雷电、大风或官方关闭须撤离。路线/游览计划信息待补充。'),
      itemB('12:00–13:00', 'meal', 'Lunch: Fudoutang No. 69, Liugou', '柳沟豆腐宴69号福豆堂', 'Yanqing', '延庆区',
        '北京市延庆区胡柳路', 'https://www.amap.com/place/B0FFFADEPQ', true,
        'Request one table for seven and the Yanqing fire-basin tofu banquet; confirm Monday opening, exact entrance, meal timing, price.',
        '订一桌七人的延庆火盆锅豆腐宴；确认周一是否营业、准确入口、用餐时间和价格。'),
      itemB('13:15–14:00', 'sight', 'Yongning Ancient Town', '永宁古城', 'Yanqing', '延庆区',
        '北京市延庆区昌赤路', 'https://www.amap.com/place/B0FFH6KSNT', false,
        'Navigate to Yuhuang Pavilion, walk one market-street loop, maybe buy a fresh Yongning huoshao; leave on time for the gorge boat.',
        '导航至玉皇阁，沿市集街走一圈，可买个现做的永宁火烧；按时出发去龙庆峡乘船。', [
        nearB('sight', 'Yuhuang Pavilion', '玉皇阁',
          'About 2–5 minutes on foot; use the pavilion at Gongchen Street 100 as the navigation pin.',
          '步行约2–5分钟；以拱辰街100号的玉皇阁作为导航定位点。',
          '北京市延庆区拱辰街100号', 'https://www.amap.com/place/B000A9LFRK'),
        nearB('restaurant', 'Yongning Tofu (Gongchen St)', '永宁豆腐(拱辰街店)',
          'About 5–10 minutes on foot; Yongning’s sour-pulp tofu tradition.',
          '步行约5–10分钟；永宁传统酸浆豆腐。',
          '北京市延庆区永宁镇拱辰街60号', 'https://www.amap.com/place/B0FFLJ5OUB'),
      ]),
      itemB('14:30', 'sight', 'Longqing Gorge', '龙庆峡风景区', 'Jiuxian', '延庆区',
        '北京市延庆区旧县镇古城村北', 'https://www.amap.com/place/B000A02891', true,
        'Head straight for the main gorge boat ride — closes at 4pm and the last ride is 4:30pm. Can be more relaxed after that; maybe the Shenxianyuan cableway if the weather is good.',
        '直奔主峡谷游船——下午4点停止入场，末班船4点半。之后可以放松些；天气好的话可考虑神仙院索道。', [
        nearXiadu,
        nearB('sight', 'Sanlihe Wetland Park', '三里河湿地公园',
          'About 20–30 minutes by car; choose a brief boardwalk section.',
          '驾车约20–30分钟；选一小段木栈道走走即可。',
          '北京市延庆区庆园街与玉皇阁大街交叉口西', 'https://www.amap.com/place/B000A9JSXN'),
      ]),
      itemB('17:00–18:00', 'meal', 'Ta Hou Meat Pie', '太后肉饼', 'Longqing Gorge–Jiuxian', '延庆·龙庆峡—旧县',
        '北京市延庆区旧县镇古城村昊龙宾馆北50米', 'https://www.amap.com/place/B0J6458YA9', true,
        'Order the signature layered meat pie.',
        '点招牌千层肉饼。', [
        nearXiadu,
      ]),
      itemB('18:30–19:00', 'activity', 'Guishui Park', '妫水公园', 'Yanqing Town–Gui River', '延庆·延庆城区—妫河',
        '北京市延庆区延庆镇东外小区', 'https://www.amap.com/place/B0J3M7GF4C', false,
        'Golden-hour walk, group photographs, drinks, toilets; the August 3 sunset reference is about 19:26. Delay getting into Beijing during rush hour.',
        '黄金时段散步、合影、买水、上洗手间；8月3日日落参考时间约19:26。避开晚高峰再返回北京。'),
      itemB('19:00–22:00', 'transit', 'Return to Hotel', '返回酒店', 'Beijing', '北京',
        '北京市西城区', 'https://www.amap.com/place/B000A8VITQ', false,
        'Flex time; open to any spots along the way or a drive around town.',
        '弹性时间；可顺路停靠任意地点，或在城里兜兜风。'),
    ]),
    day('Aug 4', 'Tue', 'Central Axis, Palace, Jingshan, Acrobat Show', '中轴线·故宫·景山·杂技', [
      itemB('07:00–07:10', 'admin', 'Rental Car Return from Hotel', '酒店门口还车', 'Chaoyang', '朝阳区',
        BJ_HOTEL_ADDR, BJ_HOTEL_MAP, true,
        'Arrange with the rental car company for pickup.',
        '与租车公司约好上门取车。'),
      itemB('07:10–07:30', 'transit', 'Didi to Tian’anmen Security Entrance', '打车前往天安门安检口', 'Dongcheng', '东城区',
        '北京市东城区东长安街', 'https://www.amap.com/place/B000A83C1S', false,
        'Use two cars to the permitted drop-off area, then walk to the checkpoint on the reservation.',
        '分乘两辆车到允许落客的区域，再步行前往预约对应的安检口。'),
      itemB('07:30–08:00', 'sight', 'Tian’anmen Square', '天安门广场', 'Dongcheng', '东城区',
        '北京市东城区东长安街', 'https://www.amap.com/place/B000A83C1S', true,
        'Clear security checkpoints; consider bringing items in a clear plastic bag to speed up security. Notable: Monument to the People’s Heroes, the Tian’anmen façade and Palace.',
        '通过安检；可将随身物品装入透明塑料袋加快过检。看点：人民英雄纪念碑、天安门城楼。'),
      itemB('08:30–12:00', 'sight', 'Forbidden City — Palace Museum', '紫禁城·故宫博物院', 'Dongcheng', '东城区-故宫—东华门',
        '北京市东城区景山前街4号', 'https://www.amap.com/place/B000A8UIN8', true,
        'Enter only at Meridian Gate. Follow through the Three Great Halls, Gate of Heavenly Purity, and the Imperial Garden. Exit only at Shenwu Gate. Route information to be added.',
        '仅从午门进入。依次游览三大殿、乾清门与御花园。仅从神武门出。路线信息待补充。'),
      itemB('12:00–13:00', 'activity', 'Jingshan Park Hike', '景山公园', 'Xicheng', '西城区',
        '北京市西城区景山西街44号', 'https://www.amap.com/place/B000A7I1OL', true,
        'Enter at the South Gate, cross the Qiwang Tower forecourt, climb to Wanchun Pavilion for the palace panorama view, then leave on the east side through the East Gate for lunch.',
        '从南门进入，经绮望楼前庭，登万春亭俯瞰故宫全景，然后从东门出去吃午餐。'),
      itemB('13:00–15:00', 'meal', 'Lunch & Casual Walk: Yu’er–Mao’er–Ju’er Hutongs', '雨儿·帽儿·菊儿胡同', 'Dongcheng', '东城区',
        '雨儿胡同', 'https://www.amap.com/place/B0FFGQ4RSW', false,
        'Fangzhuanchang No. 69 Zhajiangmian (Fangzhuanchang Hutong branch) is an option — grab a physical queue ticket and walk around while waiting.',
        '可在方砖厂69号炸酱面（方砖厂胡同店）用餐——需现场取号，等位时四处逛逛。', [
        nearB('shopping', 'Nanluoguxiang', '南锣鼓巷',
          'About 2–5 minutes on foot; easy tea, dessert, and design-retail browsing.',
          '步行约2–5分钟；喝茶、吃甜品、逛设计小店都很方便。',
          '北京市东城区交道口街道南大街(南锣鼓巷地铁站E西北口旁)', 'https://www.amap.com/place/B0FFFAH7I9'),
        nearB('shopping', 'Gulou East Street', '鼓楼东大街',
          'About 5–10 minutes by car or 10–15 minutes on foot; local shops, cafés, desserts, and street life.',
          '驾车约5–10分钟或步行10–15分钟；本地小店、咖啡馆、甜品与街头生活。',
          '北京市西城区', 'https://www.amap.com/place/B0J3M9IB7X'),
      ]),
      itemB('15:00–16:30', 'rest', 'Return to Hotel & Recharge', '返回住处休整', 'Chaoyang', '朝阳区',
        BJ_HOTEL_ADDR, BJ_HOTEL_MAP, false,
        'Cool down, shower, change, and get ready for tonight’s show.',
        '降降温、冲个澡、换身衣服，准备看今晚的演出。'),
      itemB('17:30–19:00', 'show', 'Flying Acrobatic Show', '飞翔杂技(北京朝阳剧场)', 'Chaoyang', '朝阳区',
        '北京市朝阳区呼家楼街道东三环北路36号', 'https://www.amap.com/place/B0G2C57HTG', true,
        'Acrobatics; showtimes at 16:00, 17:30, and 19:00.',
        '杂技表演；场次为16:00、17:30和19:00。', [
        nearB('restaurant', 'Hu Da Restaurant (Guijie Main Branch)', '胡大饭馆24h(簋街总店)',
          'Queue remotely or on site; allow for peak waits that can exceed three hours.',
          '可线上或到店排队；高峰等位可能超过三小时。',
          '北京市东城区东直门内大街233号', 'https://www.amap.com/place/B0FFF9XSVV'),
        nearTheBox,
      ]),
    ]),
    day('Aug 5', 'Wed', 'Temple of Heaven, Tufting, Departure', '天坛·簇绒·启程', [
      itemB('06:30–10:00', 'sight', 'Temple of Heaven', '天坛公园', 'Dongcheng', '东城区',
        '北京市东城区天坛东里甲1号', 'https://www.amap.com/place/B000A81CB2', true,
        'Enter at the East Gate, follow the one-way monument sequence through the Hall of Prayer, Danbi Bridge, Imperial Vault and Echo Wall, and Circular Mound, then leave at the South Gate.',
        '从东门进入，按单向顺序游览祈年殿、丹陛桥、皇穹宇与回音壁、圜丘，最后从南门离开。', [
        nearB('restaurant', 'Tiantan Coffee Shop Fuyin (East Second Gate)', '天坛福饮咖啡店',
          'Route-side drink option.',
          '顺路的饮品选择。',
          '北京市东城区天坛公园东门(天坛东门地铁站A2西北口步行340米)', 'https://www.amap.com/place/B0HU1DCGOE'),
        nearB('shopping', 'Temple of Heaven Cultural & Creative Store', '天坛文创店（丹陛桥西侧）',
          'Small souvenir stop.',
          '小型文创纪念品店。',
          '北京市东城区天坛东里甲1号天坛公园', 'https://www.amap.com/place/B0LAARJJQ8'),
      ]),
      itemB('10:30–11:00', 'admin', 'Check Out of Apartment', '民宿退房', 'Chaoyang', '朝阳区',
        BJ_HOTEL_ADDR, BJ_HOTEL_MAP, true,
        'Check out of the apartment; figure out bag storage with the host.',
        '办理退房，并与房东确认行李寄存。'),
      itemB('11:00–12:30', 'rest', 'Flex Time for Lunch or Departure Prep', '弹性时间·午餐或行前准备', 'Chaoyang Joy City–Qingnian Road', '朝阳·朝阳大悦城—青年路',
        '北京市朝阳区朝阳北路101号朝阳大悦城B1层', 'https://www.amap.com/place/B0LUU5PXF7', false,
        'Lunch TBD; just take it chill before we go tufting — free time.',
        '午餐待定；簇绒前放松一下——自由活动。'),
      itemB('12:30–16:00', 'craft', 'Tufting at TuTu Cat DIY', 'TuTu猫DIY·手工毛线（珠江罗马嘉园西区店）', 'Chaoyang', '朝阳区',
        '北京市朝阳区北京城区朝阳北路青年汇104楼610室', 'https://www.amap.com/place/B0K3SMNLRU', true,
        'Call ahead to schedule a session; they also have another branch we could go to.',
        '提前致电预约场次；他们还有另一家分店可选。'),
      itemB('21:00', 'transit', 'Steven’s Departure to SYD — Beijing Capital International Airport', '北京首都国际机场·飞往悉尼', 'Shunyi', '顺义区',
        BJ_AIRPORT_ADDR, BJ_AIRPORT_MAP, false,
        'Depart Beijing.',
        '离开北京。'),
    ]),
  ],
};

const TRIP = {
  title: { en: 'Family China Trip', zh: '家庭中国之旅' },
  dates: { en: 'Jul 26 – Aug 6, 2026', zh: '2026 年 7 月 26 日 – 8 月 6 日' },
  cities: [guangzhou, shanghai, beijing],
};

const I18N = {
  tripTitle: { en: 'Family China Trip', zh: '家庭中国之旅' },
  subtitle: { en: '3 cities · 12 days', zh: '3 座城市 · 12 天' },
  schedule: { en: 'Schedule', zh: '行程' },
  hotel: { en: 'Hotel', zh: '住宿' },
  address: { en: 'Address', zh: '地址' },
  openMaps: { en: 'Open in Maps', zh: '在地图中打开' },
  booking: { en: 'Booking', zh: '需预订' },
  bookingRequired: { en: 'Booking required', zh: '需提前预订' },
  noBooking: { en: 'Walk-in · no booking', zh: '无需预订' },
  nearby: { en: 'Nearby', zh: '附近' },
  nearbyHint: { en: 'Sights, food & things to do around here', zh: '周边的景点、美食与活动' },
  mustEatTitle: { en: 'Taste of', zh: '风味' },
  mustEat: { en: 'Must-eat', zh: '必吃' },
  overview: { en: 'Overview', zh: '概览' },
  about: { en: 'About this stop', zh: '关于此行程' },
  type_activity: { en: 'Activity', zh: '活动' },
  type_meal: { en: 'Food', zh: '美食' },
  type_sight: { en: 'Sight', zh: '景点' },
  type_transit: { en: 'Transit', zh: '交通' },
  type_admin: { en: 'Admin', zh: '事务' },
  type_shopping: { en: 'Shopping', zh: '购物' },
  type_wellness: { en: 'Wellness', zh: '养生' },
  type_show: { en: 'Show', zh: '演出' },
  type_craft: { en: 'Craft', zh: '手作' },
  type_rest: { en: 'Rest', zh: '休整' },
  cat_sight: { en: 'Sight', zh: '景点' },
  cat_restaurant: { en: 'Food', zh: '美食' },
  cat_activity: { en: 'Activity', zh: '活动' },
  cat_shopping: { en: 'Shopping', zh: '购物' },
  cat_wellness: { en: 'Wellness', zh: '养生' },
  nearbyHotel: { en: 'Around the hotel', zh: '酒店周边' },
  close: { en: 'Close', zh: '关闭' },
  today: { en: 'Days', zh: '每日行程' },
  checkIn: { en: 'Check-in', zh: '入住' },
  checkOut: { en: 'Check-out', zh: '退房' },
  phone: { en: 'Phone', zh: '电话' },
  wifi: { en: 'Wi-Fi', zh: '无线网络' },
  confirmation: { en: 'Confirmation', zh: '确认号' },
  stay: { en: 'Your stay', zh: '入住信息' },
  goodToKnow: { en: 'Good to know', zh: '温馨提示' },
  hotelDetails: { en: 'Hotel details', zh: '酒店详情' },
  directions: { en: 'Directions', zh: '导航' },
};

module.exports = { TRIP, I18N };
