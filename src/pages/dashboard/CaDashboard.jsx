import { useEffect, useState, useCallback } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { getCADashboardStats } from "../../services/caService";
import { Link } from "react-router-dom";

// 1. Specialized Stat Card for CA Overview
const DashboardCard = ({ title, value, icon, colorClass, subtitle }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
                <p className="text-3xl font-black mt-2 text-gray-900">{value.toLocaleString()}</p>
                {subtitle && <p className="text-xs text-gray-500 mt-1 font-medium">{subtitle}</p>}
            </div>
            <div className={`p-3 rounded-xl ${colorClass}`}>
                <span className="text-2xl">{icon}</span>
            </div>
        </div>
    </div>
);

const CaDashboard = () => {
    const [stats, setStats] = useState({
        totalAssignedClients: 0,
        pendingCompliances: 0,
        overdueCompliances: 0,
        upcomingDeadlines: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getCADashboardStats();
            setStats(response.data);
        } catch (error) {
            console.error("Failed to load CA stats:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header with Greeting */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            CA Dashboard
                        </h1>
                        <p className="text-gray-500 mt-1 font-medium">
                            Welcome back. Here is what needs your attention today.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={fetchStats}
                            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                        >
                            🔄
                        </button>
                    </div>
                </header>

                {/* 2. Main Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl" />
                        ))
                    ) : (
                        <>
                            <DashboardCard 
                                title="Active Clients" 
                                value={stats.totalAssignedClients} 
                                icon="👥" 
                                colorClass="bg-blue-50 text-blue-600"
                                subtitle="Assigned businesses"
                            />
                            <DashboardCard 
                                title="Pending Tasks" 
                                value={stats.pendingCompliances} 
                                icon="⏳" 
                                colorClass="bg-amber-50 text-amber-600"
                                subtitle="Awaiting verification"
                            />
                            <DashboardCard 
                                title="Overdue" 
                                value={stats.overdueCompliances} 
                                icon="🚨" 
                                colorClass="bg-red-50 text-red-600"
                                subtitle="Needs immediate action"
                            />
                            <DashboardCard 
                                title="Due Soon" 
                                value={stats.upcomingDeadlines} 
                                icon="📅" 
                                colorClass="bg-purple-50 text-purple-600"
                                subtitle="Next 7 days"
                            />
                        </>
                    )}
                </div>

                {/* 3. Quick Actions Section */}
                <section>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link 
                            to="/ca/businesses"
                            className="flex items-center p-4 bg-black text-white rounded-2xl hover:bg-gray-800 transition shadow-lg shadow-gray-200"
                        >
                            <span className="text-2xl mr-4">🏢</span>
                            <div>
                                <p className="font-bold">Review Clients</p>
                                <p className="text-xs text-gray-400">View all businesses assigned to you</p>
                            </div>
                        </Link>
                        <Link 
                            to="/ca/compliances"
                            className="flex items-center p-4 bg-white border border-gray-200 rounded-2xl hover:border-black transition"
                        >
                            <span className="text-2xl mr-4">📋</span>
                            <div>
                                <p className="font-bold text-gray-900">Manage Compliances</p>
                                <p className="text-xs text-gray-500">Update status and check deadlines</p>
                            </div>
                        </Link>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};

export default CaDashboard;