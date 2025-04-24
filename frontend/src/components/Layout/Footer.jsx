export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
                    {/* Medora Healthcare */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span className="ml-2 text-xl font-semibold text-gray-900">Medora</span>
                        </div>
                        <p className="text-sm text-gray-500">
                            Secure healthcare server management for modern medical infrastructure.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-700 transition-colors">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Solutions */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Solutions</h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Hospital Systems</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Clinic Management</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Medical Research</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Telehealth Platforms</a>
                            </li>
                        </ul>
                    </div>

                    {/* Compliance */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Compliance</h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">HIPAA</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">GDPR</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">HITRUST</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">SOC 2</a>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Resources</h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Documentation</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">API Reference</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Healthcare Blog</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Support Center</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="border-t border-gray-200 py-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex space-x-6">
                        <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Privacy</a>
                        <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Terms</a>
                        <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Security</a>
                        <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Status</a>
                    </div>
                    <p className="mt-4 md:mt-0 text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Medora Health Systems. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}