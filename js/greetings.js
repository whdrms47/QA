const loginForm = document.querySelector("#login-form");
const loginInput = document.querySelector("#login-form input");
const greeting = document.querySelector("#greeting");
const logoutBtn = document.querySelector("#btn-logout"); // 로그아웃 버튼 가져오기

const HIDDEN_CLASSNAME = "hidden";
const USERNAME_KEY = "username";

function onLoginSubmit(event) {
  event.preventDefault();
  loginForm.classList.add(HIDDEN_CLASSNAME);
  const username = loginInput.value.trim();
  localStorage.setItem(USERNAME_KEY, username);
  paintGreetings(username);

  // 🚀 로그인 이벤트 전파 (todo.js에서 받을 수 있게)
  window.dispatchEvent(new Event("user:login"));
}

function paintGreetings(username) {
  greeting.innerText = `Hello ${username}`;
  greeting.classList.remove(HIDDEN_CLASSNAME);
  if (logoutBtn) logoutBtn.classList.remove(HIDDEN_CLASSNAME);
}

function doLogout() {
  localStorage.removeItem(USERNAME_KEY);
  greeting.classList.add(HIDDEN_CLASSNAME);
  loginInput.value = "";
  loginForm.classList.remove(HIDDEN_CLASSNAME);
  loginInput.focus();
  if (logoutBtn) logoutBtn.classList.add(HIDDEN_CLASSNAME);

  // 🚀 로그아웃 이벤트 전파
  window.dispatchEvent(new Event("user:logout"));
}

const savedUsername = localStorage.getItem(USERNAME_KEY);

if (savedUsername === null) {
  loginForm.classList.remove(HIDDEN_CLASSNAME);
  loginForm.addEventListener("submit", onLoginSubmit);
  if (logoutBtn) logoutBtn.classList.add(HIDDEN_CLASSNAME);
} else {
  paintGreetings(savedUsername);
  // 새로고침 시 로그인 상태 유지 알림
  window.dispatchEvent(new Event("user:login"));
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", doLogout);
}