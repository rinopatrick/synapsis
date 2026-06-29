"use client";

import { useIDEStore } from "@/hooks/use-ide-store";
import { cn } from "@/lib/utils";

export function NotificationToast() {
  const { notifications, removeNotification } = useIDEStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-10 right-4 z-50 flex flex-col gap-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={cn(
            "px-4 py-3 rounded-lg shadow-lg border text-sm flex items-center gap-2 animate-in slide-in-from-right",
            notif.type === "info" && "bg-blue-900/90 border-blue-700 text-blue-200",
            notif.type === "success" && "bg-green-900/90 border-green-700 text-green-200",
            notif.type === "warning" && "bg-yellow-900/90 border-yellow-700 text-yellow-200",
            notif.type === "error" && "bg-red-900/90 border-red-700 text-red-200"
          )}
          onClick={() => removeNotification(notif.id)}
        >
          <span>
            {notif.type === "info" && "ℹ️"}
            {notif.type === "success" && "✅"}
            {notif.type === "warning" && "⚠️"}
            {notif.type === "error" && "❌"}
          </span>
          <span>{notif.message}</span>
        </div>
      ))}
    </div>
  );
}
