import { useEffect, useState, useCallback } from "react"
import { Link } from "react-router-dom"
import MainLayout from "../../components/layouts/MainLayout"
import { getPlatformStats } from "../../services/adminService"

// Reusable Stat Card
const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-hover hover:shadow-md">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{title}</p>
                <p className="text-3xl font-black mt-2 text-gray-900">{value.toLocaleString()}</p>
            </div>
            <div className={`p-3 rounded-2xl ${color}`}>
                <span className="text-xl">{icon}</span>
            </div>
        </div>
    </div>
)

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalBusinesses: 0,
        totalCompliances: 0,
        totalCAs: 0
    })
    const [loading, setLoading] = useState(true)

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getPlatformStats()
            setStats(response.data)
        } catch (error) {
            console.error("Failed to fetch admin stats:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-10">
                {/* Header */}
                <header>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Platform Overview
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">
                        High-level summary of system activity and user registrations.
                    </p>
                </header>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-3xl" />
                        ))
                    ) : (
                        <>
                            <StatCard 
                                title="Total Platform Users" 
                                value={stats.totalUsers} 
                                icon="👤" 
                                color="bg-blue-50 text-blue-600" 
                            />
                            <StatCard 
                                title="Registered Businesses" 
                                value={stats.totalBusinesses} 
                                icon="🏢" 
                                color="bg-indigo-50 text-indigo-600" 
                            />
                            <StatCard 
                                title="Total Compliances" 
                                value={stats.totalCompliances} 
                                icon="📜" 
                                color="bg-emerald-50 text-emerald-600" 
                            />
                            <StatCard 
                                title="Onboarded CAs" 
                                value={stats.totalCAs} 
                                icon="🎓" 
                                color="bg-purple-50 text-purple-600" 
                            />
                        </>
                    )}
                </div>

                {/* Quick Management Links */}
                <section className="space-y-4">
                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-tighter">
                        Management Hub
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link to="/admin/users" className="group p-6 bg-white border border-gray-200 rounded-3xl hover:border-black transition-all">
                            <span className="text-3xl block mb-4 group-hover:scale-110 transition-transform">⚙️</span>
                            <h3 className="font-bold text-gray-900">User Management</h3>
                            <p className="text-sm text-gray-400 mt-1">Activate, deactivate, or delete user accounts.</p>
                        </Link>

                        <Link to="/admin/ca-management" className="group p-6 bg-white border border-gray-200 rounded-3xl hover:border-black transition-all">
                            <span className="text-3xl block mb-4 group-hover:scale-110 transition-transform">✅</span>
                            <h3 className="font-bold text-gray-900">Verify CAs</h3>
                            <p className="text-sm text-gray-400 mt-1">Review and approve new CA registrations.</p>
                        </Link>

                        <Link to="/admin/business" className="group p-6 bg-white border border-gray-200 rounded-3xl hover:border-black transition-all">
                            <span className="text-3xl block mb-4 group-hover:scale-110 transition-transform">🔍</span>
                            <h3 className="font-bold text-gray-900">Business Oversight</h3>
                            <p className="text-sm text-gray-400 mt-1">Monitor all businesses and CA assignments.</p>
                        </Link>
                    </div>
                </section>
            </div>
        </MainLayout>
    )
}

export default AdminDashboard