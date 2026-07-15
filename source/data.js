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
const beijing = {
  id: 'bj',
  name: { en: 'Beijing', zh: '北京' },
  dateRange: 'Aug 2 – 6',
  hotel: {
    name: { en: 'Courtyard Residence', zh: '四合院居' },
    address: { text: '6 Hutong Ln  胡同巷 6 号', mapUrl: map('Courtyard Residence Beijing') },
    phone: '+86 10 6500 2333', confirmation: 'CYD-77640',
    checkIn: { time: '15:00', note: { en: 'Enter through the red courtyard gate; staff will meet you in the yard.', zh: '请从红色院门进入，工作人员将在院中迎接。' } },
    checkOut: { time: '11:00', note: { en: 'Airport transfer can be arranged at the front desk.', zh: '可在前台安排机场接送。' } },
    wifi: { en: 'Free Wi-Fi · “Courtyard” · no password', zh: '免费 Wi-Fi · “Courtyard” · 无需密码' },
    notes: [{ en: 'Courtyard tea service 8:00–11:00', zh: '庭院茶点 8:00–11:00' }, { en: 'Quiet hours after 22:00', zh: '22:00 后为安静时段' }],
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
    day('Aug 2', 'Sat', 'Arrival & Hutongs', '抵达与胡同', [
      item('17:00', 'transit', 'Hotel Check-in', '酒店入住', 'Hutong', '胡同', 'Hutong Ln', '胡同巷', false, D, Dz, nb1),
      item('18:30', 'activity', 'Hutong Walk', '胡同漫步', 'Hutong', '胡同', 'Bell Tower Ln', '钟楼巷', false, D, Dz, nb2),
      item('20:00', 'meal', 'Peking Duck Dinner', '烤鸭晚餐', 'Downtown', '市中心', '2 Duck St', '烤鸭街 2 号', true, D, Dz, nb3),
    ]),
    day('Aug 3', 'Sun', 'Imperial City', '皇城', [
      item('08:30', 'sight', 'Grand Square', '中央广场', 'City Center', '市中心', 'Central Sq', '中央广场', false, D, Dz, nb1),
      item('10:00', 'sight', 'Imperial Palace', '故宫', 'City Center', '市中心', 'Palace Gate', '午门', true, D, Dz, nb2),
      item('14:00', 'meal', 'Noodle Lunch', '面食午餐', 'City Center', '市中心', 'Old Noodle Rd', '老面路', false, D, Dz, nb3),
      item('16:00', 'sight', 'Hilltop Park', '景山公园', 'City Center', '市中心', 'Park Gate', '公园门', true, D, Dz, nb1),
    ]),
    day('Aug 4', 'Mon', 'The Great Wall', '长城', [
      item('08:00', 'transit', 'Drive to the Wall', '前往长城', 'Outskirts', '郊区', 'Mountain Rd', '山路', true, D, Dz, nb1),
      item('10:00', 'sight', 'Great Wall Hike', '长城徒步', 'Outskirts', '郊区', 'Wall Gate', '长城入口', true, D, Dz, nb3),
      item('14:00', 'meal', 'Countryside Lunch', '乡间午餐', 'Outskirts', '郊区', 'Village Rd', '村路', false, D, Dz, nb2),
    ]),
    day('Aug 5', 'Tue', 'Temples & Markets', '寺庙与市集', [
      item('09:30', 'sight', 'Temple of Prayer', '祈年寺庙', 'South', '南城', 'Temple Park', '天坛公园', true, D, Dz, nb2),
      item('12:30', 'meal', 'Hot Pot Lunch', '涮肉午餐', 'Downtown', '市中心', 'Copper Ln', '铜锅巷', false, D, Dz, nb3),
      item('18:00', 'activity', 'Night Market', '夜市', 'Downtown', '市中心', 'Snack St', '小吃街', false, D, Dz, nb1),
    ]),
    day('Aug 6', 'Wed', 'Departure', '返程', [
      item('09:00', 'meal', 'Last Jianbing', '最后的煎饼', 'Hutong', '胡同', 'Corner Stall', '街角摊', false, D, Dz, nb2),
      item('12:00', 'transit', 'Airport Transfer', '前往机场', 'Airport', '机场', 'Terminal 3', 'T3 航站楼', true, D, Dz, nb1),
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
  cat_sight: { en: 'Sight', zh: '景点' },
  cat_restaurant: { en: 'Food', zh: '美食' },
  cat_activity: { en: 'Activity', zh: '活动' },
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
