export function showToast(type, message, duration = 3000) {
  try {
    const detail = { type, message, duration };
    const event = new CustomEvent("app:toast", { detail });
    window.dispatchEvent(event);
  } catch (err) {
    // Fallback
    // console.log(`${type?.toUpperCase() || "INFO"}: ${message}`);
  }
}
