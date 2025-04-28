/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaXTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa6";



export default function Footer() {
    return (
        <footer className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black border-t border-cyan-500/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <Link to="/" className="flex items-center space-x-3">
                            <div className="h-12 w-12 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-violet-600 via-cyan-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <span className="text-white text-2xl font-bold">M</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                                Medora
                            </span>
                        </Link>
                        <p className="text-cyan-100/80 text-sm leading-relaxed">
                            Revolutionizing healthcare through seamless doctor-patient connections with cutting-edge technology.
                        </p>

                        <div className="flex space-x-4">
                            {[
                                { icon: <FaXTwitter className="w-4 h-4" />, name: 'x-twitter' },
                                { icon: <FaFacebookF className="w-4 h-4" />, name: 'facebook' },
                                { icon: <FaInstagram className="w-4 h-4" />, name: 'instagram' },
                                { icon: <FaLinkedinIn className="w-4 h-4" />, name: 'linkedin' }
                            ].map((social) => (
                                <motion.div
                                    key={social.name}
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                    className="h-9 w-9 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center text-cyan-300 hover:text-white cursor-pointer hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_0_10px_-3px_rgba(34,211,238,0.3)]"
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
                                { name: "Blog", to: "#" },
                                { name: "Health Tips", to: "#" },
                                { name: "Research", to: "#" },
                                { name: "Webinars", to: "#" },
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
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
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
                                            className="text-cyan-100/80 hover:text-white text-sm transition-colors flex items-center"
                                        >
                                            <span className="w-2 h-0.5 bg-cyan-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                                            {link.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Copyright */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="mt-20 pt-8 border-t border-cyan-500/20 text-center"
                >
                    <p className="text-xs text-cyan-300/50">
                        &copy; {new Date().getFullYear()} Medora Health. All rights reserved.
                        <span className="block mt-1 text-cyan-400/60">Powered by cutting-edge healthcare technology</span>
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}