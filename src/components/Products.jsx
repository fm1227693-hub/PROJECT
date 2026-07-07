import React from 'react'

export default function Products() {
  return (
<div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 mb-24 select-none font-sans transition-colors duration-200">
            
            {/* Sarlavha qismi */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full">
                    Feature Matrix
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-4 tracking-tight">
                    Compare our product capabilities in depth
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium text-sm md:text-base">
                    Choose the right level of analytics power. No hidden fees. Upgrade or downgrade anytime you need.
                </p>
            </div>

            {/* Chuqur Taqqoslash Jadvali (Responsive Table) */}
            <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        
                        {/* Jadval Sarlavhasi */}
                        <thead>
                            <tr className="bg-gray-950 dark:bg-gray-900 text-white">
                                <th className="p-5 text-sm font-bold tracking-wider">Core Features</th>
                                <th className="p-5 text-sm font-bold tracking-wider text-center bg-gray-900/50 dark:bg-gray-800/50">Lite</th>
                                <th className="p-5 text-sm font-bold tracking-wider text-center bg-blue-600 dark:bg-blue-600">Pro (Popular)</th>
                                <th className="p-5 text-sm font-bold tracking-wider text-center bg-gray-900/50 dark:bg-gray-800/50">Enterprise</th>
                            </tr>
                        </thead>
                        
                        {/* Jadval Tana Qismi (Features) */}
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            
                            {/* Guruh 1: Trafik va Ma'lumotlar */}
                            <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                                <td colSpan="4" className="p-4 text-xs font-black uppercase tracking-wider text-blue-500 dark:text-blue-400">Data & Volume</td>
                            </tr>
                            <tr className="hover:bg-gray-50/40 dark:hover:bg-gray-900/30 transition-colors">
                                <td className="p-5 text-gray-900 dark:text-white font-bold">Monthly Tracked Visits</td>
                                <td className="p-5 text-center text-gray-500 dark:text-gray-400">10,000</td>
                                <td className="p-5 text-center text-blue-600 dark:text-blue-400 font-extrabold">500,000</td>
                                <td className="p-5 text-center text-gray-900 dark:text-white">Unlimited</td>
                            </tr>
                            <tr className="hover:bg-gray-50/40 dark:hover:bg-gray-900/30 transition-colors">
                                <td className="p-5 text-gray-900 dark:text-white font-bold">Data Retention History</td>
                                <td className="p-5 text-center text-gray-500 dark:text-gray-400">30 Days</td>
                                <td className="p-5 text-center text-gray-900 dark:text-white">1 Year</td>
                                <td className="p-5 text-center text-emerald-500 font-extrabold">Lifetime</td>
                            </tr>

                            {/* Guruh 2: Analitika turlari */}
                            <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                                <td colSpan="4" className="p-4 text-xs font-black uppercase tracking-wider text-blue-500 dark:text-blue-400">Analytics Tools</td>
                            </tr>
                            <tr className="hover:bg-gray-50/40 dark:hover:bg-gray-900/30 transition-colors">
                                <td className="p-5 text-gray-900 dark:text-white font-bold">Real-time Dashboard</td>
                                <td className="p-5 text-center text-emerald-500">✅</td>
                                <td className="p-5 text-center text-emerald-500">✅</td>
                                <td className="p-5 text-center text-emerald-500">✅</td>
                            </tr>
                            <tr className="hover:bg-gray-50/40 dark:hover:bg-gray-900/30 transition-colors">
                                <td className="p-5 text-gray-900 dark:text-white font-bold">User Behavior Heatmaps</td>
                                <td className="p-5 text-center text-red-400 dark:text-red-400">❌ Basic Only</td>
                                <td className="p-5 text-center text-emerald-500">✅ Advanced</td>
                                <td className="p-5 text-center text-emerald-500">✅ Custom Config</td>
                            </tr>
                            <tr className="hover:bg-gray-50/40 dark:hover:bg-gray-900/30 transition-colors">
                                <td className="p-5 text-gray-900 dark:text-white font-bold">AI Growth Predictions</td>
                                <td className="p-5 text-center text-red-500">❌</td>
                                <td className="p-5 text-center text-emerald-500">✅ Smart AI</td>
                                <td className="p-5 text-center text-emerald-500">✅ Dedicated Model</td>
                            </tr>

                            {/* Guruh 3: Xavfsizlik va API */}
                            <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                                <td colSpan="4" className="p-4 text-xs font-black uppercase tracking-wider text-blue-500 dark:text-blue-400">Security & Integrations</td>
                            </tr>
                            <tr className="hover:bg-gray-50/40 dark:hover:bg-gray-900/30 transition-colors">
                                <td className="p-5 text-gray-900 dark:text-white font-bold">Custom Webhooks & API</td>
                                <td className="p-5 text-center text-red-500">❌</td>
                                <td className="p-5 text-center text-gray-400 dark:text-gray-500">Read-only</td>
                                <td className="p-5 text-center text-emerald-500 font-extrabold">Full Access ✅</td>
                            </tr>
                            <tr className="hover:bg-gray-50/40 dark:hover:bg-gray-900/30 transition-colors">
                                <td className="p-5 text-gray-900 dark:text-white font-bold">SLA Support Guarantee</td>
                                <td className="p-5 text-center text-gray-400 dark:text-gray-500">Email Only</td>
                                <td className="p-5 text-center text-gray-900 dark:text-white">24/7 Chat</td>
                                <td className="p-5 text-center text-blue-600 dark:text-blue-400 font-extrabold">Dedicated Manager (1h SLA)</td>
                            </tr>

                            {/* Narxlar va Harakat qatori (Footer of Table) */}
                            <tr className="bg-gray-50/30 dark:bg-gray-900/30">
                                <td className="p-6 text-gray-400 dark:text-gray-500 text-xs font-medium">Ready to start?</td>
                                
                                {/* Lite CTA */}
                                <td className="p-6 text-center bg-gray-50/50 dark:bg-gray-900/40">
                                    <span className="block text-xl font-black text-gray-900 dark:text-white">$19<span className="text-xs text-gray-400 dark:text-gray-500 font-normal">/mo</span></span>
                                    <button className="mt-3 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all w-full">
                                        Choose Lite
                                    </button>
                                </td>

                                {/* Pro CTA (Highlighted) */}
                                <td className="p-6 text-center bg-blue-50/30 dark:bg-blue-950/20 border-x-2 border-blue-500/20">
                                    <span className="block text-xl font-black text-blue-600 dark:text-blue-400">$49<span className="text-xs text-gray-400 dark:text-gray-500 font-normal">/mo</span></span>
                                    <button className="mt-3 px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md hover:bg-blue-600 shadow-blue-500/10 transition-all w-full">
                                        Get Pro Access
                                    </button>
                                </td>

                                {/* Enterprise CTA */}
                                <td className="p-6 text-center bg-gray-50/50 dark:bg-gray-900/40">
                                    <span className="block text-xl font-black text-gray-900 dark:text-white">$99<span className="text-xs text-gray-400 dark:text-gray-500 font-normal">/mo</span></span>
                                    <button className="mt-3 px-4 py-2 bg-gray-950 dark:bg-white text-white dark:text-gray-950 text-xs font-bold rounded-xl shadow-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-all w-full">
                                        Contact Sales
                                    </button>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>

        </div>  )
}
