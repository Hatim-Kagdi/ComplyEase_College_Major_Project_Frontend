import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 text-slate-900 font-sans scroll-smooth">

            {/* 1. Navbar - Responsive Optimized */}
            <nav className="flex flex-col md:flex-row justify-between items-center px-6 md:px-10 py-4 bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
                <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight mb-4 md:mb-0">ComplyEase</h1>
                <div className="flex items-center space-x-6 md:space-x-8 font-medium text-sm md:text-base">
                    <a href="#features" className="hover:text-blue-600 transition">Features</a>
                    <a href="#workflow" className="hover:text-blue-600 transition">Workflow</a>
                    <Link to="/login" className="text-slate-600 hover:text-blue-600">Login</Link>
                    <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-md">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* 2. Hero Section */}
            <header className="px-6 md:px-10 py-20 text-center max-w-5xl mx-auto">
                <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                    Enterprise Compliance Management
                </span>
                <h2 className="text-5xl md:text-7xl font-black mt-6 leading-tight">
                    Bridge the Gap Between <span className="text-blue-600">Businesses</span> & <span className="text-emerald-600">CAs</span>
                </h2>
                <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    Automate your compliance workflow. From document ingestion to professional audit tracking, stay ahead of every legal deadline.
                </p>
                <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
                    <Link to="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-xl">
                        Start Your Free Trial
                    </Link>
                    <a href="#features" className="px-8 py-4 border-2 border-slate-200 rounded-xl text-lg font-bold hover:bg-white hover:-translate-y-1 transition-all">
                        See Features
                    </a>
                </div>
            </header>

            {/* 3. Statistics Section - Added for Scale */}
            <section className="py-12">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6 md:px-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-slate-100">
                        <h3 className="text-3xl md:text-4xl font-black text-blue-600">100+</h3>
                        <p className="text-slate-500 text-sm mt-2">Businesses</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-slate-100">
                        <h3 className="text-3xl md:text-4xl font-black text-emerald-600">500+</h3>
                        <p className="text-slate-500 text-sm mt-2">Compliances</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-slate-100">
                        <h3 className="text-3xl md:text-4xl font-black text-red-600">50+</h3>
                        <p className="text-slate-500 text-sm mt-2">Verified CAs</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-slate-100">
                        <h3 className="text-3xl md:text-4xl font-black text-violet-600">24/7</h3>
                        <p className="text-slate-500 text-sm mt-2">Alerts</p>
                    </div>
                </div>
            </section>

            {/* 4. Workflow Section - Essential for Process Explanation */}
            <section id="workflow" className="py-20 bg-white">
                <div className="px-6 md:px-10 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl font-bold text-slate-800">The ComplyEase Journey</h3>
                        <p className="text-slate-500 mt-2">How we simplify professional collaboration.</p>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        {[
                            { step: "01", title: "Register", desc: "Set up your business entity profile." },
                            { step: "02", title: "Match", desc: "Admin assigns a verified CA to you." },
                            { step: "03", title: "Upload", desc: "Submit docs to your secure vault." },
                            { step: "04", title: "Review", desc: "CA audits and updates task status." },
                            { step: "05", title: "Success", desc: "Receive automated filing alerts." }
                        ].map((item, index) => (
                            <div key={index} className="flex-1 text-center group">
                                <div className="text-4xl font-black text-slate-500 group-hover:text-blue-500 transition mb-2">{item.step}</div>
                                <h4 className="text-lg font-bold text-slate-800">{item.title}</h4>
                                <p className="text-sm text-slate-500 mt-2 px-4">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Role Based Features with Hover Effects */}
            <section id="features" className="py-20">
                <div className="px-6 md:px-10 max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 bg-white border rounded-3xl hover:-translate-y-2 transition-all hover:shadow-xl group">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition">U</div>
                            <h4 className="text-xl font-bold mb-3">Business Owners</h4>
                            <ul className="text-slate-500 text-sm space-y-2">
                                <li>• Manage Entities</li>
                                <li>• GST/Tax Ingestion</li>
                                <li>• Request Expert CA</li>
                            </ul>
                        </div>

                        <div className="p-8 bg-white border rounded-3xl hover:-translate-y-2 transition-all hover:shadow-xl group">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 font-bold text-xl group-hover:bg-emerald-600 group-hover:text-white transition">CA</div>
                            <h4 className="text-xl font-bold mb-3">Chartered Accountants</h4>
                            <ul className="text-slate-500 text-sm space-y-2">
                                <li>• Portfolio Dashboard</li>
                                <li>• Compliance Verification</li>
                                <li>• Client Communication</li>
                            </ul>
                        </div>

                        <div className="p-8 bg-white border rounded-3xl hover:-translate-y-2 transition-all hover:shadow-xl group">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6 font-bold text-xl group-hover:bg-red-600 group-hover:text-white transition">A</div>
                            <h4 className="text-xl font-bold mb-3">Administrators</h4>
                            <ul className="text-slate-500 text-sm space-y-2">
                                <li>• User/CA Approval</li>
                                <li>• Resource Allocation</li>
                                <li>• Global Audit Trail</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Professional Footer */}
            <footer className="py-16 bg-slate-900 text-white text-center">
                <h2 className="text-2xl font-bold mb-4">ComplyEase</h2>
                <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                    Modernizing the relationship between professional accountants and business leaders through secure automation.
                </p>

                {/* Email Section */}
                <div className="mb-8">
                    <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Support & Inquiries</p>
                    <a
                        href="mailto:support@complyease.com"
                        className="text-blue-400 hover:text-blue-300 font-medium transition"
                    >
                        complyease.help@gmail.com
                    </a>
                </div>

                <div className="flex justify-center space-x-6 text-slate-500 mb-8">
                    <span className="hover:text-white cursor-pointer">Privacy</span>
                    <span className="hover:text-white cursor-pointer">Terms</span>
                    <span className="hover:text-white cursor-pointer">Security</span>
                </div>

                <div className="text-slate-600 text-xs">
                    &copy; {new Date().getFullYear()} ComplyEase. Built for Institutional Governance.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;