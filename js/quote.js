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

const quoteEl = document.querySelector("#quote span:first-child");
const authorEl = document.querySelector("#quote span:last-child");
const quoteBtn = document.querySelector("#btn-quote");

function renderRandomQuote(){
  const todaysQuote = quotes[Math.floor(Math.random() * quotes.length)];
  if (quoteEl) quoteEl.innerText = todaysQuote.quote;
  if (authorEl) authorEl.innerText = `— ${todaysQuote.author}`;
}

renderRandomQuote();

if (quoteBtn) {
  quoteBtn.addEventListener("click", renderRandomQuote);
}