import { useEffect, useState, useCallback } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { getDashboardStats } from "../../services/userDashboardService";

// 1. Reusable StatCard Component for better maintainability
const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {title}
                </p>
                <p className="text-3xl font-bold mt-2 text-gray-900">
                    {value.toLocaleString()}
                </p>
            </div>
            <div className={`p-3 rounded-xl ${colorClass}`}>
                <span className="text-2xl">{icon}</span>
            </div>
        </div>
    </div>
);

const UserDashboard = () => {
    const [stats, setStats] = useState({
        totalBusinesses: 0,
        pendingCompliances: 0,
        completedCompliances: 0,
        upcomingDueDates: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Memoized fetch function to prevent unnecessary re-renders
    const fetchDashboardStats = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getDashboardStats();
            setStats(response.data);
            setError(null);
        } catch (err) {
            console.error("Dashboard Stats Error:", err);
            setError("Failed to load dashboard metrics. Please refresh.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            User Dashboard
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Overview of your business compliance status.
                        </p>
                    </div>
                    <button 
                        onClick={fetchDashboardStats}
                        className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition shadow-sm"
                    >
                        Refresh Data
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {/* 3. Grid with Skeleton Loading State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        // Mock Skeletons
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-2xl"></div>
                        ))
                    ) : (
                        <>
                            <StatCard 
                                title="Total Businesses" 
                                value={stats.totalBusinesses} 
                                icon="🏢" 
                                colorClass="bg-blue-50 text-blue-600"
                            />
                            <StatCard 
                                title="Pending" 
                                value={stats.pendingCompliances} 
                                icon="⏳" 
                                colorClass="bg-amber-50 text-amber-600"
                            />
                            <StatCard 
                                title="Completed" 
                                value={stats.completedCompliances} 
                                icon="✅" 
                                colorClass="bg-emerald-50 text-emerald-600"
                            />
                            <StatCard 
                                title="Due Soon" 
                                value={stats.upcomingDueDates} 
                                icon="📅" 
                                colorClass="bg-purple-50 text-purple-600"
                            />
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default UserDashboard;