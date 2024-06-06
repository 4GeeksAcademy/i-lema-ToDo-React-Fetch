import React, { useState, useEffect } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ToDoList = () => {
  const API_USERS_URL = "https://playground.4geeks.com/todo/users/IagoLema";
  const API_TODO_URL = "https://playground.4geeks.com/todo/todos";

  // Crear usuario (POST)
  const createUser = async () => {
    try {
      const response = await fetch(`${API_USERS_URL}`, {
        method: "POST",
        headers: {
          "accept": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed creating user");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // Traer lista de tareas (GET)
  const getTasks = async () => {
    try {
      const response = await fetch(`${API_USERS_URL}`, {
        method: "GET",
        headers: {
          "accept": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed getting tasks");
      const data = await response.json();
      if (Array.isArray(data.todos)) {
        setTasks(data.todos);
      } else {
        setTasks([]);
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error getting tasks:", error);
    }
  };

  // Añadir tarea (POST)
  const addTaskToServer = async (task) => {
    try {
      const response = await fetch(`${API_TODO_URL}/IagoLema`, {
        method: "POST",
        body: JSON.stringify({ label: task, is_done: false }),
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to add task");
      const data = await response.json();
      return { label: data.label, id: data.id, is_done: data.is_done };
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Eliminar tarea (DELETE)
  const deleteTaskFromServer = async (taskId) => {
    try {
      const response = await fetch(`${API_TODO_URL}/${taskId}`, {
        method: "DELETE",
        headers: {
          "accept": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to delete task");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Actualizar tarea (PUT)
  const updateTaskOnServer = async (taskId, updatedTask) => {
    try {
      const response = await fetch(`${API_TODO_URL}/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(updatedTask),
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to update task");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const initializeUserAndTasks = async () => {
      await createUser();
      await getTasks();
    };
    initializeUserAndTasks();
  }, []);

  const addValue = (event) => {
    setInputValue(event.target.value);
  };

  const addList = async (event) => {
    event.preventDefault();
    if (inputValue.trim() !== "") {
      const addedTask = await addTaskToServer(inputValue);
      if (addedTask) {
        setTasks([...tasks, addedTask]);
        setInputValue("");
      }
    }
  };

  const deleteTask = async (taskId) => {
    await deleteTaskFromServer(taskId);
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleTaskCompletion = async (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    const updatedTask = { ...task, is_done: !task.is_done };
    const updatedTaskFromServer = await updateTaskOnServer(taskId, updatedTask);
    if (updatedTaskFromServer) {
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTaskFromServer : t)));
    }
  };

  return (
    <>
      <div
        id="container"
        className="d-flex flex-column justify-content-center align-items-center"
      >
        <h1 className="display-1">todos</h1>

        <ul className="list-group" id="lista">
          <form className="list-group-item" onSubmit={addList}>
            <input
              value={inputValue}
              onChange={addValue}
              name="data"
              className="border-0 text-secondary"
              type="text"
              id="añadirTarea"
              placeholder="What needs to be done?"
            />
          </form>
          {tasks.map((task, index) => (
            <li key={task.id} className="list-group-item text-secondary">
              <input
                type="checkbox"
                checked={task.is_done}
                onChange={() => toggleTaskCompletion(task.id)}
                className="me-2"
              />
              {task.label}
              <span onClick={() => deleteTask(task.id)}>
                <FontAwesomeIcon icon={faXmark} />
              </span>
            </li>
          ))}
          <li className="list-group-item text-secondary" id="itemsLeft">
            {tasks.length} item(s) left
          </li>
        </ul>
      </div>
      <div id="final1"></div>
      <div id="final2"></div>
    </>
  );
};

export default ToDoList;
