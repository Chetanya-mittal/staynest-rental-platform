import { useState, useEffect } from "react"

function useDebounce<T>(value: T, delayMs: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delayMs)

    // If value changes again before delay finishes, cancel the previous timer
    // clean up function
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debouncedValue
}

export default useDebounce
