import { useState } from "react";

export default function useStorage<T>(
  keyName: string,
  defaultValue: T,
): [T, (newValue: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = localStorage.getItem(keyName);
    return item ? JSON.parse(item) : null;
  });

  const setValue = (newValue: T) => {
    try {
      localStorage.setItem(keyName, JSON.stringify(newValue));
      setStoredValue(newValue);
    } catch (error) {
      console.error({ description: `${keyName} 저장 실패: ${error}` });
    }
  };

  const clearValue = () => {
    try {
      localStorage.removeItem(keyName);
      setStoredValue(defaultValue);
    } catch (error) {
      console.error({ description: `${keyName} 저장 실패: ${error}` });
    }
  };

  return [storedValue, setValue, clearValue];
}
