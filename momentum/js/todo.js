// DOM
const toDoForm = document.querySelector("#todo-form");
const toDoInput = toDoForm.querySelector("input");
const toDoList = document.querySelector("#todo-list");
const progressText = document.querySelector("#progress-text");
const progressFill = document.querySelector(".progress-fill");
const sortBtn = document.querySelector("#btn-sort");

const TODOS_KEY = "todos";
const SORT_KEY  = "todo_sort"; 

const MAX_TODOS = 10;
const MAX_TODO_LEN = 50;

let toDos = [];
let sortMode = localStorage.getItem(SORT_KEY) || "created"; 

function saveToDos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}
function toggleDone(id, checked) {
  toDos = toDos.map((t) => (t.id === id ? { ...t, done: checked } : t));
  saveToDos();
  render();
}
function removeToDo(id) {
  toDos = toDos.filter((t) => t.id !== id);
  saveToDos();
  render();
}
function makeItem(todo) {
  const isDone = !!todo.done;
  const li = document.createElement("li");
  li.id = String(todo.id);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isDone;
  checkbox.ariaLabel = "완료 표시";

  const span = document.createElement("span");
  span.textContent = todo.text;

  const applyStrike = (done) => {
    span.style.textDecoration = done ? "line-through" : "none";
    span.style.opacity = done ? "0.6" : "1";
  };
  applyStrike(isDone);

  checkbox.addEventListener("change", (e) => {
    const done = e.target.checked;
    applyStrike(done);
    toggleDone(todo.id, done);
  });

  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.ariaLabel = "삭제";
  delBtn.addEventListener("click", () => removeToDo(todo.id));

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(delBtn);
  return li;
}
function updateLimitUI() {
  if (toDos.length >= MAX_TODOS) {
    toDoInput.placeholder = "최대 10개입니다. 삭제 후 등록해주세요.";
  } else {
    toDoInput.placeholder = "할 일을 입력하고 Enter를 누르세요";
  }
}
function updateProgress() {
  const total = toDos.length;
  const done  = toDos.filter(t=>t.done).length;
  const pct = total === 0 ? 0 : Math.round((done/total)*100);
  if (progressText) progressText.textContent = `${done} / ${total} 완료`;
  if (progressFill) progressFill.style.width = `${pct}%`;
}
function sortTodos(list) {
  if (sortMode === "incompleteFirst") {
    return [...list].sort((a,b)=>{
      if (a.done !== b.done) return a.done ? 1 : -1;
      return a.id - b.id;
    });
  }
  return [...list].sort((a,b)=> a.id - b.id);
}
function render() {
  toDoList.innerHTML = "";
  const sorted = sortTodos(toDos);
  sorted.forEach((t)=> toDoList.appendChild(makeItem(t)));
  updateLimitUI();
  updateProgress();
}
function handleToDoSubmit(event) {
  event.preventDefault();
  const text = toDoInput.value.trim();
  if (!text) return;

  if (toDos.length >= MAX_TODOS) {
    alert("할 일은 최대 10개까지만 등록할 수 있어요.");
    toDoInput.value = "";
    toDoInput.focus();
    updateLimitUI();
    return;
  }
  if (text.length > MAX_TODO_LEN) {
    alert(`할 일은 최대 ${MAX_TODO_LEN}자까지 입력할 수 있어요. (현재 ${text.length}자)`);
    toDoInput.focus();
    return;
  }

  const newToDo = { id: Date.now(), text, done: false };
  toDos.push(newToDo);
  saveToDos();
  toDoInput.value = "";
  render();
}

// 🚀 로그인/로그아웃 연동
function setTodoEnabled(enabled){
  toDoForm.classList.toggle("hidden", !enabled);
  toDoInput.disabled = !enabled;
  if (!enabled) toDoInput.value = "";
}
function clearTodoAll(){
  localStorage.removeItem(TODOS_KEY);
  toDos = [];
  render();
}

(function init() {
  const saved = localStorage.getItem(TODOS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      toDos = parsed.map((t) => ({ id: t.id, text: t.text, done: !!t.done }));
    } catch {
      toDos = [];
    }
  }

  const savedSort = localStorage.getItem(SORT_KEY);
  if (savedSort) sortMode = savedSort;

  render();
  toDoForm.addEventListener("submit", handleToDoSubmit);

  if (sortBtn) {
    sortBtn.addEventListener("click", ()=>{
      sortMode = (sortMode === "created") ? "incompleteFirst" : "created";
      localStorage.setItem(SORT_KEY, sortMode);
      render();
    });
  }

  // 초기 상태: 로그인 여부 확인
  const isLoggedIn = !!localStorage.getItem("username");
  setTodoEnabled(isLoggedIn);
})();

// 이벤트 수신
window.addEventListener("user:login", ()=> setTodoEnabled(true));
window.addEventListener("user:logout", ()=> { clearTodoAll(); setTodoEnabled(false); });