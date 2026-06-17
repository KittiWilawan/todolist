const todoInput = document.getElementById("todo-input");
const endDateInput = document.getElementById("end-date");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const darkThemeBtn = document.getElementById("darktheme");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark") {
  document.body.classList.add("darkmode");
} else {
  document.body.classList.remove("darkmode");
}

let todos = JSON.parse(localStorage.getItem("myTodos")) || [];

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo, index) => {
    if (!todo.subTasks) todo.subTasks = [];
    if (todo.isExpanded === undefined) todo.isExpanded = false;

    const li = document.createElement("li");
    li.style.flexDirection = "column";
    li.style.alignItems = "stretch";

    if (todo.completed) {
      li.classList.add("completed");
    }

    const createdTime = todo.createdAt || new Date().toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'medium' });
    const eDateStr = todo.endDate ? new Date(todo.endDate).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'medium' }) : "";

    let subTasksHtml = "";
    todo.subTasks.forEach((sub, sIndex) => {
      subTasksHtml += `
          <div class="subtask-item" style="display:flex; align-items:center; gap: 10px; margin-top: 5px; padding-left: 20px;">
            <input type="checkbox" ${sub.completed ? "checked" : ""} onclick="event.stopPropagation(); toggleSubTodo(${index}, ${sIndex})">
            <span style="flex:1; text-decoration: ${sub.completed ? 'line-through' : 'none'};">${sub.text}</span>
            <button class="delete-btn" onclick="event.stopPropagation(); deleteSubTodo(${index}, ${sIndex})">🗑️</button>
          </div>
        `;
    });

    li.innerHTML = `
      <div class="todo-main" style="display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 10px; cursor: pointer;" onclick="toggleDropdown(${index})">
        <span class="dropdown-arrow" style="font-size: 0.8em;">${todo.isExpanded ? '▼' : '▶'}</span>
        <input type="checkbox" ${todo.completed ? "checked" : ""} onclick="event.stopPropagation(); toggleTodo(${index})">
        <span class="todo-text" style="flex:1; text-decoration: ${todo.completed ? 'line-through' : 'none'};">${todo.text}</span>
        <span class="date-text" style="font-size: 0.85em; color: var(--text-color);">สร้าง: ${createdTime} ${eDateStr ? `- สิ้นสุด: ${eDateStr}` : ''}</span>
        <div class="actions">
          <button class="edit-btn" onclick="event.stopPropagation(); editTodo(${index})">✏️</button>
          <button class="delete-btn" onclick="event.stopPropagation(); deleteTodo(${index})">🗑️</button>
        </div>
      </div>
      <div class="subtasks-container" id="subtasks-${index}" style="display: ${todo.isExpanded ? 'block' : 'none'}; width: 100%; margin-top: 10px; border-top: 1px dashed var(--text-color); padding-top: 10px;" onclick="event.stopPropagation();">
        <div style="display:flex; gap: 5px; margin-bottom: 10px;">
          <input type="text" id="sub-input-${index}" placeholder="เพิ่มงานย่อย..." onkeypress="if(event.key==='Enter') addSubTodo(${index})" style="flex:1; padding:5px; border: 1px solid var(--text-color); border-radius: 3px; background-color: transparent; color: var(--text-color);">
          <button class="edit-btn" onclick="addSubTodo(${index})">เพิ่ม</button>
        </div>
        ${subTasksHtml}
      </div>
    `;
    todoList.appendChild(li);
  });

  localStorage.setItem("myTodos", JSON.stringify(todos));
  filterTodos();
}

function addTodo() {
  const todoText = todoInput.value.trim();
  const endDate = endDateInput.value;

  if (todoText !== "") {
    todos.push({
      text: todoText,
      completed: false,
      endDate: endDate,
      createdAt: new Date().toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'medium' }),
      subTasks: [],
      isExpanded: false
    });
    todoInput.value = "";
    endDateInput.value = "";
    renderTodos();
  } else {
    alert("กรุณาใส่ข้อมูล");
  }
}

function deleteTodo(index) {
  todos.splice(index, 1);
  renderTodos();
}

function editTodo(index) {
  const newText = prompt("แก้ไขกิจกรรม:", todos[index].text);
  if (newText !== null && newText.trim() !== "") {
    todos[index].text = newText.trim();
    renderTodos();
  }
}

function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  renderTodos();
}

function toggleDropdown(index) {
  todos[index].isExpanded = !todos[index].isExpanded;
  renderTodos();
}

function addSubTodo(index) {
  const input = document.getElementById(`sub-input-${index}`);
  const text = input.value.trim();
  if (text !== "") {
    if (!todos[index].subTasks) todos[index].subTasks = [];
    todos[index].subTasks.push({ text: text, completed: false });
    renderTodos();
  }
}

function toggleSubTodo(index, sIndex) {
  todos[index].subTasks[sIndex].completed = !todos[index].subTasks[sIndex].completed;
  renderTodos();
}

function deleteSubTodo(index, sIndex) {
  todos[index].subTasks.splice(sIndex, 1);
  renderTodos();
}

function filterTodos() {
  const searchInput = document.getElementById("search-input").value.toLowerCase();
  const items = document.querySelectorAll("#todo-list li");
  items.forEach(item => {
    const text = item.querySelector(".todo-text").textContent.toLowerCase();
    item.style.display = text.includes(searchInput) ? "flex" : "none";
  });
}
document.getElementById("search").addEventListener("click", filterTodos);
document.getElementById("search-input").addEventListener("input", filterTodos);

darkThemeBtn.textContent = document.body.classList.contains("darkmode") ? "⏾" : "☀︎";

darkThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("darkmode");
  const isDarkMode = document.body.classList.contains("darkmode");
  darkThemeBtn.textContent = isDarkMode ? "⏾" : "☀︎";
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
});

addBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});

renderTodos(); 