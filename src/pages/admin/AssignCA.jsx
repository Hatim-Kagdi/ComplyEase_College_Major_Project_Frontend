import { useEffect, useState, useCallback } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import {
    getRequestedBusinesses,
    getAllCAUsers,
    assignCA
} from "../../services/adminService";

const AssignCA = () => {
    const [businesses, setBusinesses] = useState([]);
    const [caUsers, setCaUsers] = useState([]);
    const [selectedCA, setSelectedCA] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(null); // Track which business is being assigned

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [businessRes, caRes] = await Promise.all([
                getRequestedBusinesses(),
                getAllCAUsers()
            ]);
            setBusinesses(businessRes.data);
            setCaUsers(caRes.data);
        } catch (error) {
            console.error("Data fetch failed:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSelectCA = (businessId, caId) => {
        setSelectedCA(prev => ({
            ...prev,
            [businessId]: caId
        }));
    };

    const handleAssignCA = async (businessId) => {
        const caId = selectedCA[businessId];
        if (!caId) {
            alert("Please select a CA from the dropdown first.");
            return;
        }

        try {
            setSubmitting(businessId);
            await assignCA(businessId, caId);
            
            // Success: Remove assigned business from local state
            setBusinesses(prev => prev.filter(b => b.businessId !== businessId));
            console.log("Assignment successful");
        } catch (error) {
            alert("Assignment failed. Please try again.");
        } finally {
            setSubmitting(null);
        }
    };

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            Assign Professionals
                        </h1>
                        <p className="text-gray-500 font-medium">Match pending business requests with verified Chartered Accountants.</p>
                    </div>
                    <div className="px-4 py-2 bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-widest">
                        {businesses.length} Requests Pending
                    </div>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-3xl" />
                        ))}
                    </div>
                ) : businesses.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center">
                        <span className="text-4xl mb-4 block">🎉</span>
                        <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
                        <p className="text-gray-400">No businesses are currently awaiting CA assignment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {businesses.map((business) => (
                            <div
                                key={business.businessId}
                                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                                            {business.businessName.charAt(0)}
                                        </div>
                                        <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded-md uppercase tracking-tighter">
                                            ID: {business.businessId}
                                        </span>
                                    </div>
                                    
                                    <h2 className="text-lg font-black text-gray-900 leading-tight mb-1">
                                        {business.businessName}
                                    </h2>
                                    <p className="text-sm font-mono text-gray-400 mb-6">
                                        GST: {business.businessGstNumber}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                        Assign to Expert
                                    </label>
                                    <select
                                        value={selectedCA[business.businessId] || ""}
                                        onChange={(e) => handleSelectCA(business.businessId, e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 p-3 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all appearance-none cursor-pointer"
                                        style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                                    >
                                        <option value="">Select a Professional</option>
                                        {caUsers.map((ca) => (
                                            <option key={ca.id} value={ca.id}>
                                                {ca.name} ({ca.email.split('@')[0]})
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={() => handleAssignCA(business.businessId)}
                                        disabled={submitting === business.businessId}
                                        className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                            selectedCA[business.businessId] 
                                            ? 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-gray-200' 
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        } disabled:opacity-50`}
                                    >
                                        {submitting === business.businessId ? "Assigning..." : "Confirm Assignment"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default AssignCA;