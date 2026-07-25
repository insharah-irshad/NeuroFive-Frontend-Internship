
let tasks = [];
let nextId = 1;
let currentFilter = "all"; // "all" | "active" | "completed"

//  Element references 
const form = document.querySelector("#entry-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const counter = document.querySelector("#counter");
const filtersNav = document.querySelector("#filters");
const clearCompletedBtn = document.querySelector("#clear-completed");

//  Event listeners
form.addEventListener("submit", handleAddTask);
filtersNav.addEventListener("click", handleFilterClick);
list.addEventListener("click", handleListClick); // event delegation for checkbox + delete
clearCompletedBtn.addEventListener("click", handleClearCompleted);

// Handlers 
function handleAddTask(event) {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.push({ id: nextId++, text, completed: false });
  input.value = "";
  input.focus();
  render();
}

function handleFilterClick(event) {
  const btn = event.target.closest(".filter-btn");
  if (!btn) return;

  currentFilter = btn.dataset.filter;

  filtersNav.querySelectorAll(".filter-btn").forEach((el) => {
    el.classList.toggle("is-active", el === btn);
  });

  render();
}

function handleListClick(event) {
  const item = event.target.closest(".task-item");
  if (!item) return;
  const id = Number(item.dataset.id);

  if (event.target.matches(".task-item__checkbox")) {
    toggleTask(id);
  } else if (event.target.closest(".task-item__delete")) {
    deleteTask(id);
  }
}

function handleClearCompleted() {
  tasks = tasks.filter((task) => !task.completed);
  render();
}

// State mutators 
function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.completed = !task.completed;
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  render();
}

//  Derived data 
function getVisibleTasks() {
  if (currentFilter === "active") return tasks.filter((t) => !t.completed);
  if (currentFilter === "completed") return tasks.filter((t) => t.completed);
  return tasks;
}

// Rendering 
function render() {
  list.textContent = ""; // clear previous nodes

  const visible = getVisibleTasks();
  emptyState.hidden = visible.length !== 0;

  visible.forEach((task, index) => {
    list.appendChild(buildTaskElement(task, index));
  });

  const remaining = tasks.filter((t) => !t.completed).length;
  counter.textContent = `${remaining} task${remaining === 1 ? "" : "s"} remaining`;
}

function buildTaskElement(task, index) {
  const li = document.createElement("li");
  li.className = "task-item" + (task.completed ? " is-complete" : "");
  li.dataset.id = task.id;

  const indexEl = document.createElement("span");
  indexEl.className = "task-item__index";
  indexEl.textContent = String(index + 1).padStart(2, "0");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-item__checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", `Mark "${task.text}" as complete`);

  const textEl = document.createElement("span");
  textEl.className = "task-item__text";
  textEl.textContent = task.text; // textContent, never innerHTML — safe from injection

  const stamp = document.createElement("span");
  stamp.className = "stamp";
  stamp.textContent = "DONE";

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "task-item__delete";
  deleteBtn.textContent = "void";
  deleteBtn.setAttribute("aria-label", `Delete "${task.text}"`);

  li.append(indexEl, checkbox, textEl, stamp, deleteBtn);
  return li;
}

// Initial render 
render();