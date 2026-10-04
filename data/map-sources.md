# 地図の位置情報（2026-10-04確認）

画像上の割合指定と地域内の仮配置を廃止し、Leafletの同一投影で日本の輪郭と全ピンを描画する。

- 国土地理院「日本の主な山岳標高（1003山）」2026-03-31版のGeoJSONから、山名と都道府県が一致する地点を取得。連峰は、山岳一覧の名前・標高との整合を確認した代表峰を選択し、ポップアップで表示地点を明記。
- 一覧にない山や湿原は国土地理院の地名検索の地名データから取得。住所の中心位置は採用していない。同名の天狗山は川上村側、飯盛山は南牧村、日倉山は五泉市の山を照合。
- 葦毛湿原は弓張山地の訪問記録として扱う既存の方針を維持し、湿原の地名位置を表示する。
- 既存100地点を保持。別の記録地として飯盛山・富士山を追加する。100地点の達成数と、訪問記録の件数は分けて表示。
- 確認済み94地点と100選外の2地点を表示。浅間高原、北信五岳、小松原湿原、大杉谷、熊野路、阿蘇高原は位置確認中。表示地点が未確定の名称に仮座標を割り当てない。
- `map-sources.json` に各地点の出典URLと表示地点名を保存。描画時の出典注記は `map-locations.js` に収録。
- 山の標高、花、見頃、訪問状態、既存の記録URLはこの作業で変更していない。国土地理院の標高値と一致しない既存値は別途確認が必要。

## 出典

- 国土地理院の山岳一覧: https://web1.gsi.go.jp/kihonjohochousa/kihonjohochousa41139.html
- 同GeoJSON: https://www.gsi.go.jp/KOKUJYOHO/MOUNTAIN/1003zan20260331.zip
- 国土地理院の地名検索: https://msearch.gsi.go.jp/address-search/AddressSearch （各検索URLはJSONに保存）
- 天狗山の名称照合（長野県）: https://www.pref.nagano.lg.jp/shizenhogo/kurashi/shizen/koen/sizenkankyotiiki/documents/siteisyo6.pdf
- 飯盛山の名称照合（南牧村）: https://www.minamimakimura.jp/content/files/sangyoukensetsu/mesimorievomise2019.pdf
- 日本の輪郭: Natural Earth 1:50m Admin 0 Countries、public domain。https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-countries-2/
- 輪郭データの配布元: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson
- Leaflet 1.9.4: https://leafletjs.com/ （BSD-2-Clauseライセンスを同梱）

地図ライブラリと輪郭はローカルファイルとして同梱。地図表示には外部タイルの通信やAPIキーは不要。地理院地図へ移動するリンクのみ外部サイトを開く。
