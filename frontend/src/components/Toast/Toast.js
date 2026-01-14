import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Toast.module.css";

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function onToast(event) {
      const { type = "info", message = "", duration = 3000 } = event.detail || {};
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const toast = { id, type, message };
      setToasts((prev) => [...prev, toast]);
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, Math.max(1500, duration));
      return () => clearTimeout(timer);
    }
    window.addEventListener("app:toast", onToast);
    return () => window.removeEventListener("app:toast", onToast);
  }, []);

  const dismiss = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className={styles.toastContainer}>
      {toasts.map((t) => (
        <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
          <span className={styles.message}>{t.message}</span>
          <button className={styles.close} onClick={() => dismiss(t.id)} aria-label="Close">×</button>
        </div>
      ))}
    </div>,
    document.body
  );
}

export default ToastContainer;

