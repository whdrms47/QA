const API_KEY = "84f32b3938a94ffb9858d8e83a928878";

const UNIT_KEY = "weather_unit";       // "metric" | "imperial"
const COORDS_KEY = "last_coords";      // {"lat":number,"lon":number}
const unitBtn = document.querySelector("#btn-unit");

function getSavedUnit(){
  return localStorage.getItem(UNIT_KEY) || "metric"; // 기본 ℃
}
function saveUnit(u){
  localStorage.setItem(UNIT_KEY, u);
}

function getSavedCoords(){
  try {
    const raw = localStorage.getItem(COORDS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function saveCoords(lat, lon){
  try {
    localStorage.setItem(COORDS_KEY, JSON.stringify({ lat, lon }));
  } catch { /* ignore */ }
}

function setUnitButtonLabel(){
  const u = getSavedUnit();
  if (unitBtn) unitBtn.textContent = (u === "metric") ? "℃" : "℉";
}

/** 공통: 날씨 호출 + 렌더 */
function fetchWeather(lat, lon, unit){
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
  return fetch(url)
    .then(r => r.json())
    .then(data => {
      const weather = document.querySelector("#weather span:first-child");
      const city = document.querySelector("#weather span:last-child");
      const tempUnit = unit === "metric" ? "°C" : "°F";
      if (city)   city.innerText   = data?.name ?? "";
      if (weather) weather.innerText = `${data?.weather?.[0]?.main ?? ""} / ${data?.main?.temp ?? ""}${tempUnit}`;
    })
    .catch(()=>{ /* 네트워크 에러 무시 */ });
}

/** 최초 좌표 획득(한 번만) */
function onGeoOk(position){
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  saveCoords(lat, lon);                         // ✅ 좌표 저장
  fetchWeather(lat, lon, getSavedUnit());
}
function onGeoError() {
  alert("Can't find you. No weather for you.");
}

/** 초기 로드:
 *  1) 저장된 좌표가 있으면 → 권한 재요청 없이 바로 호출
 *  2) 없으면 → 단 한 번만 geolocation 요청
 */
(function initWeather(){
  setUnitButtonLabel();

  const cached = getSavedCoords();
  if (cached && typeof cached.lat === "number" && typeof cached.lon === "number") {
    fetchWeather(cached.lat, cached.lon, getSavedUnit());
  } else {
    navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
  }
})();

/** 단위 전환:
 *  좌표는 저장본 사용 → 권한 재요청 없음
 *  좌표가 없다면(아직 승인 전) 그때만 한 번 요청
 */
function toggleUnit(){
  const now = getSavedUnit();
  const next = now === "metric" ? "imperial" : "metric";
  saveUnit(next);
  setUnitButtonLabel();

  const cached = getSavedCoords();
  if (cached && typeof cached.lat === "number" && typeof cached.lon === "number") {
    fetchWeather(cached.lat, cached.lon, next);           // ✅ 권한 재요청 없이 갱신
  } else {
    navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError); // 최초 1회만
  }
}
if (unitBtn) unitBtn.addEventListener("click", toggleUnit);