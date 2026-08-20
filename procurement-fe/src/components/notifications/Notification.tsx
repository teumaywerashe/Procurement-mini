/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";

 interface NotificationProp{
  notificationsOpen:boolean;
  unreadCount:number;
  markNotificationRead:(id:number) => void;
  setNotificationsOpen:(open:boolean) => void;
  notificationsLoading:boolean;
  notifications:Array<any>;

}

function Notification({notificationsOpen,unreadCount,markNotificationRead,setNotificationsOpen,notificationsLoading,notifications}:NotificationProp) {
  const router=useRouter()
  return (
    <aside
      className={`fixed right-0 top-0 z-50 flex h-full w-[min(24rem,100vw)] flex-col border-l border-(--border) bg-(--bg-base) shadow-2xl transition-transform duration-300 ease-out ${
        notificationsOpen ? "translate-x-0" : "translate-x-full"
      }`}
      aria-label="Notifications panel"
    >
      <div className="flex items-center justify-between border-b border-(--border) px-4 py-4">
        <div>
          <p className="text-sm font-semibold text-(--text-primary)">
            Notifications
          </p>
          {unreadCount > 0 && (
            <p className="mt-0.5 text-[11px] text-(--text-faint)">
              {unreadCount} unread
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setNotificationsOpen(false)}
          className="rounded-md cursor-pointer p-2 text-(--text-subtle) transition-colors hover:bg-black/5 hover:text-(--text-primary) dark:hover:bg-white/5"
          aria-label="Close notifications"
        >
          <IconX size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {notificationsLoading ? (
          <p className="px-4 py-8 text-center text-xs text-(--text-faint)">
            Loading notifications...
          </p>
        ) : notifications.length === 0 ? (
          <p className="px-4 py-8 text-center text-xs text-(--text-faint)">
            You have no notifications.
          </p>
        ) : (
          notifications.map((notification) => (
            <button
              type="button"
              key={notification.id}
              onClick={() => {
                if (!notification.isRead) {
                  void markNotificationRead(notification.id);
                }

                router.push(`/bids/${notification.bidId}`);
              }}
              className={`block w-full border-b border-(--border) px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5 ${
                notification.isRead ? "opacity-70" : "bg-indigo-500/5"
              }`}
            >
              <div className="flex gap-3 cursor-pointer items-start">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.isRead ? "bg-(--border-strong)" : "bg-indigo-500"}`}
                />
                <div className="min-w-0">
                  <p className="text-xs leading-5 text-(--text-primary)">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-[10px] text-(--text-faint)">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}

export default Notification;
