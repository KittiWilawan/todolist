const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

let todos = JSON.parse(localStorage.getItem("myTodos")) || [];

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    if (todo.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <input type="checkbox" ${todo.completed ? "checked" : ""} onclick="toggleTodo(${index})">
      <span class="todo-text">${todo.text}</span>
      <button class="delete-btn" onclick="deleteTodo(${index})">🗑️</button>
    `;
    todoList.appendChild(li);
  });

  localStorage.setItem("myTodos", JSON.stringify(todos));
}

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText !== "") {
    todos.push({ text: todoText, completed: false });
    todoInput.value = "";
    renderTodos();
  } else {
    alert("กรุณาใส่ข้อมูล");
  }
}

function deleteTodo(index) {
  todos.splice(index, 1);
  renderTodos();
}

function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  renderTodos();
}


addBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});

renderTodos();