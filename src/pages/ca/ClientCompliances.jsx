import { useEffect, useState, useCallback } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { getAssignedCompliances } from "../../services/caService";
import { updateComplianceStatusByCA } from "../../services/complianceService";

// Helper for status styles
const getStatusStyles = (status) => {
    switch (status) {
        case "COMPLETED": return "bg-emerald-50 text-emerald-700 border-emerald-100";
        case "OVERDUE": return "bg-red-50 text-red-700 border-red-100";
        default: return "bg-amber-50 text-amber-700 border-amber-100";
    }
};

const ClientCompliances = () => {
    const [compliances, setCompliances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null); // Track which item is updating

    const fetchCompliances = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAssignedCompliances();
            setCompliances(response.data);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCompliances();
    }, [fetchCompliances]);

    const handleStatusUpdate = async (complianceId, status) => {
        setUpdatingId(complianceId);
        try {
            await updateComplianceStatusByCA(complianceId, status);
            // Instant local update (Optimistic UI)
            setCompliances(prev => prev.map(item => 
                item.complianceId === complianceId ? { ...item, status } : item
            ));
        } catch (error) {
            console.error("Update error:", error);
            alert("⚠️ Failed to update status. Please try again.");
            fetchCompliances(); // Refresh to sync with server
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        Client Compliances
                    </h1>
                    <p className="text-gray-500 mt-1">Manage regulatory deadlines and update status for your assigned businesses.</p>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(n => <div key={n} className="h-64 bg-gray-100 animate-pulse rounded-2xl" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {compliances.map((compliance) => (
                            <div
                                key={compliance.complianceId}
                                className={`relative bg-white border rounded-2xl p-6 shadow-sm transition-all hover:shadow-md ${
                                    updatingId === compliance.complianceId ? "opacity-60 pointer-events-none" : "opacity-100"
                                }`}
                            >
                                {/* Header Info */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyles(compliance.status)}`}>
                                        {compliance.status}
                                    </div>
                                    <span className="text-gray-300 text-xs font-mono">#{compliance.complianceId.toString().slice(-4)}</span>
                                </div>

                                <h2 className="text-xl font-extrabold text-gray-800 line-clamp-1">
                                    {compliance.businessName}
                                </h2>
                                
                                <div className="mt-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 font-medium uppercase text-[10px] tracking-wider">Type</span>
                                        <span className="text-gray-700 font-semibold">{compliance.complianceType.replace('_', ' ')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 font-medium uppercase text-[10px] tracking-wider">Due Date</span>
                                        <span className={`font-bold ${compliance.status === 'OVERDUE' ? 'text-red-600' : 'text-gray-700'}`}>
                                            {new Date(compliance.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>

                                {/* Status Selector */}
                                <div className="mt-6 pt-4 border-t border-gray-50">
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">
                                        Update Progress
                                    </label>
                                    <select
                                        value={compliance.status}
                                        onChange={(e) => handleStatusUpdate(compliance.complianceId, e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition cursor-pointer hover:bg-gray-100"
                                    >
                                        <option value="PENDING">🕒 Mark as Pending</option>
                                        <option value="COMPLETED">✅ Mark as Completed</option>
                                        <option value="OVERDUE">🚨 Mark as Overdue</option>
                                    </select>
                                </div>

                                {/* Loading Overlay for individual card */}
                                {updatingId === compliance.complianceId && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 rounded-2xl">
                                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {!loading && compliances.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">No compliances found for your assigned businesses.</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default ClientCompliances;