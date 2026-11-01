export function readDemoData(key, fallback) {
  if (typeof localStorage === "undefined") return fallback;

  try {
    const storedValue = localStorage.getItem(key);
    return storedValue === null ? fallback : JSON.parse(storedValue);
  } catch (error) {
    console.error(`Unable to read demo data for "${key}".`, error);
    return fallback;
  }
}

export function writeDemoData(key, value) {
  if (typeof localStorage === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to save demo data for "${key}".`, error);
  }
}
