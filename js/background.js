const images = ["0.jpg", "1.jpg"]; // 자유롭게 추가
let currentBgImg;

// 배경 적용
function applyBackground(src){
  if (currentBgImg) currentBgImg.remove();
  const img = document.createElement("img");
  img.src = `img/${src}`;
  document.body.appendChild(img);
  currentBgImg = img;
}

// 초기 로드
function setRandomBackground(){
  const chosen = images[Math.floor(Math.random() * images.length)];
  applyBackground(chosen);
}
setRandomBackground();

// 버튼 연동
const bgBtn = document.querySelector("#btn-bg");

if (bgBtn) {
  bgBtn.addEventListener("click", setRandomBackground);
}
