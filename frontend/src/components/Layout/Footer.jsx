/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaXTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function Footer() {
    const { darkMode } = useDarkMode();

    return (
        <footer className={`bg-gradient-to-b from-white to-emerald-50 dark:from-gray-900 dark:to-gray-800 border-t border-emerald-200 dark:border-gray-700 transition-colors duration-300`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <Link to="/" className="flex items-center space-x-3">
                            <div className="h-12 w-12 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-emerald-600 via-emerald-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <span className="text-white text-2xl font-bold">M</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                                Medora
                            </span>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed transition-colors duration-300">
                            Revolutionizing healthcare through seamless doctor-patient connections with cutting-edge technology.
                        </p>

                        <div className="flex space-x-4">
                            {[
                                { icon: <FaXTwitter className="w-4 h-4" />, name: 'x' },
                                { icon: <FaFacebookF className="w-4 h-4" />, name: 'facebook' },
                                { icon: <FaInstagram className="w-4 h-4" />, name: 'instagram' },
                                { icon: <FaLinkedinIn className="w-4 h-4" />, name: 'linkedin' }
                            ].map((social) => (
                                <motion.div
                                    key={social.name}
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                    className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-gray-700 border border-emerald-200 dark:border-gray-600 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:text-white dark:hover:text-white cursor-pointer hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:shadow-[0_0_10px_-3px_rgba(16,185,129,0.3)] transition-colors duration-300"
                                >
                                    {social.icon}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Links sections */}
                    {[
                        {
                            title: "Navigation",
                            links: [
                                { name: "Home", to: "/" },
                                { name: "About Us", to: "/about" },
                            ]
                        },
                        {
                            title: "Support",
                            links: [
                                { name: "Contact Us", to: "/contact" },
                                { name: "FAQs", to: "#" },
                                { name: "Privacy Policy", to: "#" },
                                { name: "Terms", to: "#" },
                            ]
                        },
                        {
                            title: "Resources",
                            links: [
                                { name: "Health Tips", to: "#" },
                            ]
                        }
                    ].map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="space-y-5"
                        >
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link, linkIndex) => (
                                    <motion.li
                                        key={linkIndex}
                                        whileHover={{ x: 5 }}
                                        className="group"
                                    >
                                        <Link
                                            to={link.to}
                                            className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm transition-colors duration-300 flex items-center"
                                        >
                                            <span className="w-2 h-0.5 bg-emerald-400 dark:bg-emerald-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                                            {link.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="mt-16 pt-8 border-t border-emerald-200 dark:border-gray-700 text-center transition-colors duration-300"
                >
                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        &copy; {new Date().getFullYear()} Medora Health. All rights reserved.
                        <span className="block mt-1 text-emerald-600/80 dark:text-emerald-400/80 transition-colors duration-300">
                            Powered by cutting-edge healthcare technology
                        </span>
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}