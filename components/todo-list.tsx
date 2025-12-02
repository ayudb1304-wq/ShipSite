"use client"

/**
 * Todo List Component
 * 
 * Example feature component demonstrating CRUD operations with Server Actions.
 * This shows how to:
 * - Display data from the database
 * - Create new items
 * - Update existing items
 * - Delete items
 * - Handle loading and error states
 */

import { useState, useTransition } from "react"
import { createTodo, toggleTodo, deleteTodo } from "@/actions/todos"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Todo } from "@/db/schema"

interface TodoListProps {
  initialTodos: Todo[]
}

export function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState(initialTodos)
  const [newTodoTitle, setNewTodoTitle] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodoTitle.trim()) return

    setError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.append("title", newTodoTitle)

      const result = await createTodo(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setNewTodoTitle("")
        // Optimistically update UI - in production, you might want to refetch
        // For now, we'll rely on revalidation from the server action
        window.location.reload()
      }
    })
  }

  const handleToggle = async (id: string) => {
    setError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.append("id", id)

      const result = await toggleTodo(formData)

      if (result.error) {
        setError(result.error)
      } else {
        // Optimistically update UI
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          )
        )
      }
    })
  }

  const handleDelete = async (id: string) => {
    setError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.append("id", id)

      const result = await deleteTodo(formData)

      if (result.error) {
        setError(result.error)
      } else {
        // Optimistically update UI
        setTodos((prev) => prev.filter((todo) => todo.id !== id))
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Example: Todo List</CardTitle>
        <CardDescription>
          This is a working example of CRUD operations using Server Actions. Try adding, completing, or deleting todos!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="flex gap-2">
          <Input
            type="text"
            placeholder="Add a new todo..."
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            disabled={isPending}
            className="flex-1"
          />
          <Button type="submit" disabled={isPending || !newTodoTitle.trim()}>
            {isPending ? "Adding..." : "Add"}
          </Button>
        </form>

        {todos.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No todos yet. Create your first one above!
          </p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo.id)}
                  disabled={isPending}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span
                  className={`flex-1 ${
                    todo.completed
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {todo.title}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(todo.id)}
                  disabled={isPending}
                  className="text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}

        <div className="pt-4 border-t text-xs text-muted-foreground">
          <p className="font-semibold mb-1">This example demonstrates:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Creating records with Server Actions</li>
            <li>Reading data from the database</li>
            <li>Updating records (toggle completion)</li>
            <li>Deleting records</li>
            <li>Optimistic UI updates</li>
            <li>Error handling</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
