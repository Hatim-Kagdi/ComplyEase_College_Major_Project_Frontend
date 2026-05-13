import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { getAssignedBusinesses } from "../../services/businessService";
import MainLayout from "../../components/layouts/MainLayout";

// 2. Pass navigate as a prop to the card
const BusinessCard = ({ business, onViewCompliances }) => (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <span className="text-2xl">🏢</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                business.caAssignmentStatus === 'ASSIGNED' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-amber-100 text-amber-700'
            }`}>
                {business.caAssignmentStatus}
            </span>
        </div>
        
        <h2 className="text-xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">
            {business.businessName}
        </h2>
        
        <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">GST Number</span>
                <span className="text-gray-900 font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                    {business.businessGstNumber}
                </span>
            </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-50 flex gap-3">
            {/* 3. Call the navigation function on click */}
            <button 
                onClick={() => onViewCompliances(business.businessId, business.businessName)}
                className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition shadow-sm"
            >
                View Compliances
            </button>
        </div>
    </div>
);

const AssignedBusinesses = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // 4. Initialize navigate

    const fetchBusinesses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAssignedBusinesses();
            setBusinesses(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching assigned businesses:", err);
            setError("Failed to load your assigned clients. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBusinesses();
    }, [fetchBusinesses]);

    // 5. Navigation Handler logic
    const handleViewCompliances = (id, name) => {
        // Navigates to the compliance page with query parameters
        navigate(`/ca/compliances?businessId=${id}&name=${encodeURIComponent(name)}`);
    };

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Assigned Businesses
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage and oversee your connected client portfolios.
                        </p>
                    </div>
                    <button 
                        onClick={fetchBusinesses}
                        className="px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition shadow-sm"
                    >
                        🔄 Refresh List
                    </button>
                </header>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-2xl"></div>
                        ))}
                    </div>
                ) : businesses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {businesses.map((business) => (
                            <BusinessCard 
                                key={business.businessId} 
                                business={business} 
                                onViewCompliances={handleViewCompliances} // 6. Pass the function
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white border border-dashed rounded-3xl">
                        <span className="text-5xl mb-4 block">📁</span>
                        <h3 className="text-lg font-bold text-gray-900">No Clients Assigned</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mt-2">
                            Once the admin assigns businesses to you, they will appear here for management.
                        </p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default AssignedBusinesses;