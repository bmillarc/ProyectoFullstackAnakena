// Simple safe wrapper around localStorage to avoid SecurityError when
// running in restricted contexts (e.g., sandboxed iframe, blocked storage).
// Falls back to an in-memory map.
const memoryStore: Record<string, string> = {};

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__test_ls__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const hasLocalStorage = typeof window !== 'undefined' && isLocalStorageAvailable();

export function getItem(key: string): string | null {
  try {
    if (hasLocalStorage) return window.localStorage.getItem(key);
    return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null;
  } catch {
    return null;
  }
}

export function setItem(key: string, value: string): void {
  try {
    if (hasLocalStorage) {
      window.localStorage.setItem(key, value);
    } else {
      memoryStore[key] = value;
    }
  } catch {
    memoryStore[key] = value;
  }
}

export function removeItem(key: string): void {
  try {
    if (hasLocalStorage) {
      window.localStorage.removeItem(key);
    } else {
      delete memoryStore[key];
    }
  } catch {
    delete memoryStore[key];
  }
}

export function clear(): void {
  try {
    if (hasLocalStorage) {
      window.localStorage.clear();
    } else {
      Object.keys(memoryStore).forEach(k => delete memoryStore[k]);
    }
  } catch {
    Object.keys(memoryStore).forEach(k => delete memoryStore[k]);
  }
}

export const storageAvailable = hasLocalStorage;