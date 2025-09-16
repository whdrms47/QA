const THEME_KEY = "ui_theme"; // "dark" | "light"
const themeBtn = document.querySelector("#btn-theme");

function getTheme(){
  return localStorage.getItem(THEME_KEY) || "dark";
}
function applyTheme(theme){
  const root = document.documentElement; // :root
  if (theme === "light") {
    root.classList.add("light");
  } else {
    root.classList.remove("light");
  }
}
function toggleTheme(){
  const now = getTheme();
  const next = now === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

// 초기 적용
applyTheme(getTheme());

if (themeBtn) themeBtn.addEventListener("click", toggleTheme);