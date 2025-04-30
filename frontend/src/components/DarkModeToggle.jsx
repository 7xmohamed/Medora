import { useDarkMode } from '../contexts/DarkModeContext';
import { FiMoon, FiSun } from 'react-icons/fi';

export default function DarkModeToggle() {
    const { darkMode, toggleDarkMode } = useDarkMode();

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full focus:outline-none"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {darkMode ? (
                <FiSun className="w-5 h-5 text-yellow-300" />
            ) : (
                <FiMoon className="w-5 h-5 text-gray-600" />
            )}
        </button>
    );
}