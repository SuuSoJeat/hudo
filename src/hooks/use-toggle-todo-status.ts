import { toggleTodoStatus } from "@/services/todo-service";
import type { ToDo } from "@/types/todo";
import { handleError } from "@/utils/error-handler";
import confetti from "canvas-confetti";
import { useState } from "react";
import { toast } from "sonner";

export function useToggleTodoStatus() {
  const [isToggling, setIsToggling] = useState(false);

  async function toggleStatus(todo: ToDo) {
    if (isToggling) return;

    setIsToggling(true);
    try {
      const newStatus = await updateTodoStatus(todo);
      showStatusChangeEffects(newStatus);
      return newStatus;
    } catch (error) {
      handleError(error);
    } finally {
      setIsToggling(false);
    }
  }

  async function updateTodoStatus(
    todo: ToDo,
  ): Promise<"completed" | "incomplete"> {
    await toggleTodoStatus(todo.id, todo.status);
    return todo.status === "completed" ? "incomplete" : "completed";
  }

  function showStatusChangeEffects(newStatus: "completed" | "incomplete") {
    if (newStatus === "completed") {
      showCompletionConfetti();
    }
    showStatusChangeToast(newStatus);
  }

  function showCompletionConfetti() {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;
      launchConfetti(60, { x: 0, y: 0.5 }, colors);
      launchConfetti(120, { x: 1, y: 0.5 }, colors);
      requestAnimationFrame(frame);
    };

    frame();
  }

  function launchConfetti(
    angle: number,
    origin: { x: number; y: number },
    colors: string[],
  ) {
    confetti({
      particleCount: 2,
      angle,
      spread: 55,
      startVelocity: 60,
      origin,
      colors,
    });
  }

  function showStatusChangeToast(newStatus: "completed" | "incomplete") {
    const message =
      newStatus === "completed"
        ? "Great job! Task completed."
        : "Task marked as incomplete. Keep going!";
    toast.success(message);
  }

  return { toggleStatus, isToggling };
}
