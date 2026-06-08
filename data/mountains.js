// data/mountains.js
// 新・花の百名山アーカイブ用データ
// lat / lng は実際の緯度経度。
// mapX / mapY は assets/japan-map.svg 上に表示するための手動調整位置。

const MOUNTAINS = [
  {
    no: 1,
    id: "rebun-dake",
    name: "礼文岳",
    reading: "れぶんだけ",
    prefectures: ["北海道"],
    region: "北海道",
    elevation: 490,
    flowers: ["オオカサモチ", "レブンソウ"],
    lat: 45.3819,
    lng: 141.0306,
    mapX: 56.6,
    mapY: 5.9,
    bestMonths: [6, 7],
    goodMonths: [6, 7, 8],
    seasons: ["summer"],
    visited: false,
    recordUrl: "",
    note: "新・花の百名山 No.1。花の島・礼文島の山。座標と見頃月は後で精査する。"
  },

  {
    no: 2,
    id: "rishiri-zan",
    name: "利尻山",
    reading: "りしりさん",
    prefectures: ["北海道"],
    region: "北海道",
    elevation: 1721,
    flowers: ["ボタンキンバイ", "シコタンハコベ"],
    lat: 45.1786,
    lng: 141.2419,
    mapX: 57.0,
    mapY: 6.8,
    bestMonths: [6, 7],
    goodMonths: [6, 7, 8],
    seasons: ["summer"],
    visited: false,
    recordUrl: "",
    note: "新・花の百名山 No.2。"
  },

  {
    no: 4,
    id: "daisetsu-zan",
    name: "大雪山",
    reading: "たいせつざん",
    prefectures: ["北海道"],
    region: "北海道",
    elevation: 2291,
    flowers: ["チョウノスケソウ", "ジンヨウキスミレ"],
    lat: 43.6636,
    lng: 142.8542,
    mapX: 61.2,
    mapY: 14.0,
    bestMonths: [7, 8],
    goodMonths: [6, 7, 8, 9],
    seasons: ["summer", "autumn"],
    visited: false,
    recordUrl: "",
    note: "新・花の百名山 No.4。ここでは最高峰の旭岳付近を代表点として扱う。"
  },

  {
    no: 9,
    id: "apoi-dake",
    name: "アポイ岳",
    reading: "あぽいだけ",
    prefectures: ["北海道"],
    region: "北海道",
    elevation: 811,
    flowers: ["ミヤマハンショウヅル", "アポイゼキショウ", "アポイマンテマ"],
    lat: 42.1078,
    lng: 143.0256,
    mapX: 61.8,
    mapY: 21.3,
    bestMonths: [5, 6],
    goodMonths: [5, 6, 7],
    seasons: ["spring", "summer"],
    visited: false,
    recordUrl: "",
    note: "新・花の百名山 No.9。固有植物・蛇紋岩植物の山。見頃月は後で精査する。"
  },

  {
    no: 81,
    id: "yumihari-sanchi",
    name: "弓張山地",
    displayName: "葦毛湿原",
    reading: "ゆみはりさんち",
    prefectures: ["愛知県", "静岡県"],
    region: "中部",
    elevation: 63,
    flowers: ["チゴユリ", "ミカワバイケイソウ", "キリンソウ"],
    lat: 34.7606,
    lng: 137.4554,
    mapX: 47.9,
    mapY: 52.5,
    bestMonths: [5, 6, 9],
    goodMonths: [3, 4, 5, 6, 7, 8, 9, 10],
    seasons: ["spring", "summer", "autumn"],
    visited: true,
    recordUrl: "records/Imo-wetland.html",
    note: "新・花の百名山 No.81。個人記録では葦毛湿原の訪問記録として扱う。"
  }
];