import { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(false);

    // Initialize dark mode from localStorage or user preference
    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode !== null) {
            setDarkMode(savedMode === 'true');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
        }
    }, []);

    // Apply dark mode class to document
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
}

// Disabling 'react-refresh/only-export-components' because this hook is intentionally exported for external usage.

// eslint-disable-next-line react-refresh/only-export-components
export const useDarkMode = () => useContext(DarkModeContext);