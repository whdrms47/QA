const quotes = [
  {quote: "The only way to do great work is to love what you do.", author: "Steve Jobs"},
  {quote: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein"},
  {quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill"},
  {quote: "Happiness depends upon ourselves.", author: "Aristotle"},
  {quote: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt"},
  {quote: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu"},
  {quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt"},
  {quote: "It always seems impossible until it’s done.", author: "Nelson Mandela"},
  {quote: "Turn your wounds into wisdom.", author: "Oprah Winfrey"},
  {quote: "Don’t count the days, make the days count.", author: "Muhammad Ali"},
];

const quote = document.querySelector("#quote span:first-child");
const author = document.querySelector("#quote span:last-child");
const quoteBtn = document.querySelector("#btn-quote");

function renderRandomQuote(){
  const todaysQuote = quotes[Math.floor(Math.random() * quotes.length)];
  if (quote) quote.innerText = todaysQuote.quote;
  if (author) author.innerText = todaysQuote.author;
}

renderRandomQuote();

if (quoteBtn) {
  quoteBtn.addEventListener("click", renderRandomQuote);
}

 // 로그인 UI/로그아웃 UI 최소 변경 (원래 흐름 보존)
  function setLoginUI(isLoggedIn){
    if (loginFormEl) loginFormEl.classList.toggle("hidden", !!isLoggedIn);
    if (greetingEl)  greetingEl.classList.toggle("hidden", !isLoggedIn);
    if (logoutBtn)   logoutBtn.classList.toggle("hidden", !isLoggedIn);
  }

  // To-Do 쪽으로 로그인 이벤트 송신
  function broadcastLogin(){
    const name = localStorage.getItem(USERNAME_KEY);
    if (name){
      window.dispatchEvent(new CustomEvent("user:login", { detail: { username: name }}));
      if (logoutBtn) logoutBtn.classList.remove("hidden");
    }
  }

  // (핵심) 기존 submit 핸들러 뒤에 로그인 이벤트만 덧대기
  if (loginFormEl){
    loginFormEl.addEventListener("submit", () => {
      // 기존 코드가 localStorage.setItem 후 실행되도록 0ms 지연
      setTimeout(() => {
        broadcastLogin();
        setLoginUI(true);
      }, 0);
    });
  }

  // 로그아웃 버튼: username 제거 + 이벤트 발행 + UI 전환
  if (logoutBtn){
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem(USERNAME_KEY);
      window.dispatchEvent(new Event("user:logout"));
      setLoginUI(false);
    });
  }

  // 새로고침 시 이미 로그인 상태면 1회 알림 + UI 맞춤
  const already = localStorage.getItem(USERNAME_KEY);
  if (already){
    setLoginUI(true);
    broadcastLogin();
  }else{
    setLoginUI(false);
  }
})();