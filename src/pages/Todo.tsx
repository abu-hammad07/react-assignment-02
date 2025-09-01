import { useState, type ChangeEvent, type FormEvent } from "react";
import "./todo.css";
import Header from "../components/Header";

interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
}

const Todo = () => {
    const [todos, setTodos] = useState<TodoItem[]>([
        { id: 1, text: "Go to gym", completed: false },
        { id: 2, text: "Finish React Assignments", completed: false },
        { id: 3, text: "Purchase groceries", completed: false },
    ]);

    const [newTask, setNewTask] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    // Handle input change
    const handleNewTask = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTask(e.target.value);
    };

    // Add or Update Todo
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!newTask.trim()) {
            alert("Input cannot be empty");
            return;
        }

        if (isEditing && editId !== null) {
            // Update existing todo
            setTodos(
                todos.map((todo) =>
                    todo.id === editId ? { ...todo, text: newTask } : todo
                )
            );
            setIsEditing(false);
            setEditId(null);
        } else {
            // Add new todo
            const newTodo: TodoItem = {
                id: Date.now(),
                text: newTask,
                completed: false,
            };
            setTodos([newTodo, ...todos]);
        }
        setNewTask("");
    };

    // Delete Todo
    const handleDeleteTodo = (id: number) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    // Enter Edit Mode
    const handleEditTodo = (id: number, text: string) => {
        setIsEditing(true);
        setEditId(id);
        setNewTask(text);
    };

    // Toggle Completed Status
    const toggleCompleted = (id: number) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    return (
        <>
            <Header />
            <div className="todo-container mt-60">
                <form className="todo-form mt-10" onSubmit={handleSubmit}>
                    <label htmlFor="todo">What do you want to do?</label>
                    <input
                        type="text"
                        value={newTask}
                        onChange={handleNewTask}
                        id="todo"
                        placeholder="Type your todo"
                    />
                    <button type="submit">{isEditing ? "Update Todo" : "Add Todo"}</button>
                </form>

                {todos.length > 0 ? (
                    <ul className="todo-list">
                        {todos.map((todo) => (
                            <li key={todo.id} className="todo-item">
                                <span
                                    onClick={() => toggleCompleted(todo.id)}
                                    className={todo.completed ? "completed" : ""}
                                >
                                    {todo.text}
                                </span>
                                <div className="actions">
                                    <button onClick={() => handleEditTodo(todo.id, todo.text)}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteTodo(todo.id)}>
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You don't have any todos</p>
                )}
            </div>
        </>
    );
};

export default Todo;
