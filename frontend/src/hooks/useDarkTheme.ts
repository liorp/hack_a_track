import useLocalForage from "hooks/useLocalForage"

export const useDarkMode = () => {
  const [theme, setTheme] = useLocalForage("theme", 'dark')

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  return [theme, toggleTheme]
}

export default useDarkMode
