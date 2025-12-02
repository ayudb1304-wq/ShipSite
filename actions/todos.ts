"use server"

/**
 * Todo List Server Actions
 * 
 * Example CRUD operations using Server Actions architecture.
 * This demonstrates how to:
 * - Create records
 * - Read/fetch records
 * - Update records
 * - Delete records
 */

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getUser } from "@/actions/auth"
import { db } from "@/db"
import { todos } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
})

const updateTodoSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200).optional(),
  completed: z.boolean().optional(),
})

/**
 * Create a new todo
 */
export async function createTodo(formData: FormData) {
  const user = await getUser()

  if (!user) {
    return {
      error: "Unauthorized",
    }
  }

  const result = createTodoSchema.safeParse({
    title: formData.get("title"),
  })

  if (!result.success) {
    return {
      error: result.error.errors[0]?.message || "Invalid input",
    }
  }

  try {
    await db.insert(todos).values({
      userId: user.id,
      title: result.data.title,
      completed: false,
    })

    revalidatePath("/dashboard")
    return {
      success: true,
      message: "Todo created successfully",
    }
  } catch (error) {
    console.error("Error creating todo:", error)
    return {
      error: "Failed to create todo",
    }
  }
}

/**
 * Get all todos for the current user
 */
export async function getTodos() {
  const user = await getUser()

  if (!user) {
    return []
  }

  try {
    const userTodos = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, user.id))
      .orderBy(desc(todos.createdAt))

    return userTodos
  } catch (error) {
    console.error("Error fetching todos:", error)
    return []
  }
}

/**
 * Update a todo
 */
export async function updateTodo(formData: FormData) {
  const user = await getUser()

  if (!user) {
    return {
      error: "Unauthorized",
    }
  }

  const result = updateTodoSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title") || undefined,
    completed: formData.get("completed") === "true" ? true : formData.get("completed") === "false" ? false : undefined,
  })

  if (!result.success) {
    return {
      error: result.error.errors[0]?.message || "Invalid input",
    }
  }

  try {
    // Verify todo belongs to user
    const [todo] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, result.data.id))
      .limit(1)

    if (!todo || todo.userId !== user.id) {
      return {
        error: "Todo not found or unauthorized",
      }
    }

    await db
      .update(todos)
      .set({
        title: result.data.title ?? todo.title,
        completed: result.data.completed ?? todo.completed,
        updatedAt: new Date(),
      })
      .where(eq(todos.id, result.data.id))

    revalidatePath("/dashboard")
    return {
      success: true,
      message: "Todo updated successfully",
    }
  } catch (error) {
    console.error("Error updating todo:", error)
    return {
      error: "Failed to update todo",
    }
  }
}

/**
 * Delete a todo
 */
export async function deleteTodo(formData: FormData) {
  const user = await getUser()

  if (!user) {
    return {
      error: "Unauthorized",
    }
  }

  const todoId = formData.get("id")

  if (!todoId || typeof todoId !== "string") {
    return {
      error: "Todo ID is required",
    }
  }

  try {
    // Verify todo belongs to user
    const [todo] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, todoId))
      .limit(1)

    if (!todo || todo.userId !== user.id) {
      return {
        error: "Todo not found or unauthorized",
      }
    }

    await db.delete(todos).where(eq(todos.id, todoId))

    revalidatePath("/dashboard")
    return {
      success: true,
      message: "Todo deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting todo:", error)
    return {
      error: "Failed to delete todo",
    }
  }
}

/**
 * Toggle todo completion status
 */
export async function toggleTodo(formData: FormData) {
  const user = await getUser()

  if (!user) {
    return {
      error: "Unauthorized",
    }
  }

  const todoId = formData.get("id")

  if (!todoId || typeof todoId !== "string") {
    return {
      error: "Todo ID is required",
    }
  }

  try {
    // Verify todo belongs to user
    const [todo] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, todoId))
      .limit(1)

    if (!todo || todo.userId !== user.id) {
      return {
        error: "Todo not found or unauthorized",
      }
    }

    await db
      .update(todos)
      .set({
        completed: !todo.completed,
        updatedAt: new Date(),
      })
      .where(eq(todos.id, todoId))

    revalidatePath("/dashboard")
    return {
      success: true,
      message: "Todo updated successfully",
    }
  } catch (error) {
    console.error("Error toggling todo:", error)
    return {
      error: "Failed to update todo",
    }
  }
}
