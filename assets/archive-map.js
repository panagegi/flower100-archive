(() => {
  'use strict';
  const allPlaces = [
    ...MOUNTAINS.map(place => ({ ...place, isListed: true })),
    ...EXTRA_RECORDS.map(place => ({ ...place, isListed: false }))
  ];
  const hasPosition = place => Number.isFinite(place.lat) && Number.isFinite(place.lng);
  const positioned = allPlaces.filter(hasPosition);
  const pending = MOUNTAINS.filter(place => !hasPosition(place));
  const seasonMonths = { spring: [3, 4, 5], summer: [6, 7, 8], autumn: [9, 10, 11], winter: [12, 1, 2] };
  const displayName = place => place.displayName || place.name;
  const count = document.getElementById('visited-count');
  const listedVisits = MOUNTAINS.filter(place => place.visited);
  const extraVisits = EXTRA_RECORDS.filter(place => place.visited);
  count.textContent = listedVisits.length + extraVisits.length;
  const breakdown = document.getElementById('record-count');
  breakdown.replaceChildren(
    document.createTextNode(`新・花の百名山：${listedVisits.length} / ${MOUNTAINS.length}`),
    document.createElement('br'),
    document.createTextNode(`100選外の訪問：${extraVisits.length}か所${extraVisits.length ? `（${extraVisits.map(displayName).join('・')}）` : ''}`)
  );
  document.getElementById('pending-summary').textContent = `位置の確認中 / ${pending.length}地点`;
  const pendingList = document.getElementById('pending-list');
  for (const place of pending) {
    const li = document.createElement('li');
    li.textContent = `${place.no}. ${place.name} / ${place.prefectures.join('・')}`;
    pendingList.appendChild(li);
  }
  document.getElementById('pending-places').hidden = pending.length === 0;
  const recordList = document.getElementById('record-list');
  for (const place of allPlaces.filter(place => place.recordUrl)) {
    const a = document.createElement('a');
    a.href = place.recordUrl;
    a.textContent = `${displayName(place)} / ${place.prefectures.join('・')} →`;
    recordList.appendChild(a);
  }
  const map = L.map('japan-map', {
    minZoom: 4, maxZoom: 11, zoomControl: true,
    scrollWheelZoom: false, keyboard: true, attributionControl: true
  });
  map.attributionControl.setPrefix('<a href="https://leafletjs.com/">Leaflet</a>');
  L.geoJSON(JAPAN_GEOGRAPHY, {
    interactive: false,
    style: { color: '#b4b7a6', weight: 1, opacity: 0.55, fillColor: '#79816e', fillOpacity: 0.25 }
  }).addTo(map);
  map.attributionControl.addAttribution('<a href="https://www.naturalearthdata.com/">Natural Earth</a> · 位置：<a href="https://web1.gsi.go.jp/kihonjohochousa/kihonjohochousa41139.html">国土地理院</a>');
  const fullBounds = L.latLngBounds(positioned.map(place => [place.lat, place.lng]));
  const resetView = () => map.fitBounds(fullBounds, { padding: [32, 32], animate: false });
  resetView();
  document.getElementById('reset-map').addEventListener('click', resetView);
  function seasonMatch(place, filter, key) {
    return (place[key] || []).some(month => (seasonMonths[filter] || []).includes(month));
  }
  function showPlace(place, filter) {
    if (filter === 'all') return true;
    if (filter === 'visited') return place.visited;
    return seasonMatch(place, filter, 'bestMonths') || seasonMatch(place, filter, 'goodMonths');
  }
  function pinIcon(place, filter) {
    const classes = ['map-pin'];
    if (place.visited) classes.push('visited');
    if (!place.isListed) classes.push('additional');
    if (seasonMatch(place, filter, 'bestMonths')) classes.push('best-season');
    else if (seasonMatch(place, filter, 'goodMonths')) classes.push('good-season');
    return L.divIcon({ className: classes.join(' '), iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -10] });
  }
  function popup(place) {
    const box = document.createElement('div');
    box.className = 'map-record';
    const label = document.createElement('div'); label.className = 'card-label';
    label.textContent = place.isListed ? `NO. ${place.no} / ${place.region}` : `FIELD RECORD / ${place.region}`;
    box.appendChild(label);
    const h2 = document.createElement('h2'); h2.textContent = displayName(place); box.appendChild(h2);
    const p = document.createElement('p'); p.textContent = place.prefectures.join('・'); box.appendChild(p);
    const location = MAP_LOCATIONS[place.id];
    if (location.kind === '代表峰' || location.label !== displayName(place) && location.label !== place.name) {
      const note = document.createElement('p'); note.className = 'point-note';
      note.textContent = `表示地点：${location.label}`; box.appendChild(note);
    }
    if (place.recordUrl) {
      const link = document.createElement('a');link.className = 'record-link';link.href = place.recordUrl;link.textContent = 'VIEW RECORD →';box.appendChild(link);
    }
    const geographic = document.createElement('a');geographic.className = 'coordinate-link';
    geographic.href = `https://maps.gsi.go.jp/#15/${place.lat}/${place.lng}/&base=std&ls=std&disp=1&vs=c1j0h0k0l0u0t0z0r0s0m0f1&d=m`;
    geographic.target = '_blank';geographic.rel = 'noopener noreferrer';
    geographic.textContent = '地理院地図で位置を見る ↗';box.appendChild(geographic);
    return box;
  }
  const markers = new Map();
  for (const place of positioned) {
    const marker = L.marker([place.lat, place.lng], {
      icon: pinIcon(place, 'all'), title: displayName(place), alt: displayName(place), keyboard: true,
      riseOnHover: true, zIndexOffset: place.visited ? 500 : 0
    }).bindTooltip(displayName(place), { direction: 'top', offset: [0, -12] })
      .bindPopup(() => popup(place), { maxWidth: 280, minWidth: 210, autoPanPadding: [20, 20] });
    marker.addTo(map);markers.set(place.id, marker);
  }
  const filterButtons = document.querySelectorAll('[data-filter]');
  function updateFilter(filter) {
    map.closePopup();
    for (const button of filterButtons) {
      const active = button.dataset.filter === filter;
      button.classList.toggle('active', active);button.setAttribute('aria-pressed', String(active));
    }
    let visibleCount = 0;
    for (const place of positioned) {
      const marker = markers.get(place.id);
      if (showPlace(place, filter)) {
        visibleCount++;marker.setIcon(pinIcon(place, filter));
        if (!map.hasLayer(marker)) marker.addTo(map);
      } else if (map.hasLayer(marker)) map.removeLayer(marker);
    }
    const listedCount = MOUNTAINS.filter(hasPosition).length;
    const message = filter === 'all' ? `${listedCount} / 100地点を表示 ＋ 記録地${EXTRA_RECORDS.length}地点` : `${visibleCount}地点を表示`;
    document.getElementById('map-status').textContent = message + (seasonMonths[filter] ? '（見頃の登録がある地点）' : '');
  }
  for (const button of filterButtons) button.addEventListener('click', () => updateFilter(button.dataset.filter));
  updateFilter('all');
  // Leaflet projects coastline and markers together, including after viewport changes.
  if (typeof ResizeObserver !== 'undefined') {
    let previousWidth = 0;
    new ResizeObserver(entries => {
      const width = entries[0].contentRect.width;
      if (width !== previousWidth) { previousWidth = width;map.invalidateSize({ pan: false }); }
    }).observe(document.getElementById('japan-map'));
  }
})();
