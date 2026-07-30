import api from "../api/api";

export async function subscribeToPush() {
  const register = await navigator.serviceWorker.register("/sw.js");
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),
  });

  try {
    await api.post("/admin/notifications/subscribe",   { subscription });
  } catch (err) {
    console.log(err.response?.data);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}