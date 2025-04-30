import { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

// Initialize dark mode value from localStorage or system preference
const getInitialDarkMode = () => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
        return savedMode === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export function DarkModeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(getInitialDarkMode);


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



// eslint-disable-next-line react-refresh/only-export-components
export const useDarkMode = () => useContext(DarkModeContext);