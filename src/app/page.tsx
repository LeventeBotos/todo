"use client";

import { useState, useEffect } from "react";
import { SwipeEventData, useSwipeable } from "react-swipeable";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDsmFfgH6QCK0fXkTExpZHZ3AYcyUvizE",
  authDomain: "todo-leventebotos.firebaseapp.com",
  projectId: "todo-leventebotos",
  storageBucket: "todo-leventebotos.firebasestorage.app",
  messagingSenderId: "434304152394",
  appId: "1:434304152394:web:a10d1539636a300ea5c7b3",
  measurementId: "G-HDLDC7DLB4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function AdvancedTodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
      const updatedTodos = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Todo)
      );
      setTodos(updatedTodos);
    });

    return () => unsubscribe();
  }, []);

  const addTodo = async () => {
    if (newTodo.trim() !== "") {
      await addDoc(collection(db, "todos"), {
        text: newTodo,
        completed: false,
      });
      setNewTodo("");
    }
  };

  const toggleTodo = async (id: string) => {
    const todoRef = doc(db, "todos", id);
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      await updateDoc(todoRef, { completed: !todo.completed });
    }
  };

  const deleteTodo = async (id: string) => {
    await deleteDoc(doc(db, "todos", id));
  };

  const handlers = useSwipeable({
    onSwipedLeft: (eventData: SwipeEventData) => {
      const id = (eventData.event.target as HTMLElement)?.id;
      if (id) deleteTodo(id);
    },
    trackMouse: true,
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-[#1f1f1f] text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="max-w-md mx-auto pt-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Advanced Todo App</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-white/10 "
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
        </div>
        <div className="flex mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a new todo"
            className="flex-grow mr-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:border-white/5"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              {...handlers}
              id={todo.id}
              className="flex items-center justify-between bg-white dark:bg-white/10 p-4 rounded-lg shadow transition-transform duration-200 ease-in-out transform"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="mr-3 form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-blue-500 dark:bg-white/10"
                />
                <span
                  className={`${
                    todo.completed
                      ? "line-through text-gray-500 dark:text-gray-400"
                      : ""
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
                aria-label="Delete todo"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
        {/* <p className="mt-4 text-sm text-black/50 dark:text-white/50">
          Swipe left on a todo to delete it (on touch devices)
        </p> */}
      </div>
    </div>
  );
}
