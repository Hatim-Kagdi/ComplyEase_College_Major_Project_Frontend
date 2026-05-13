import { useEffect, useState, useCallback } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { getAssignedCompliances } from "../../services/caService";
import { updateComplianceStatusByCA } from "../../services/complianceService";
import { useLocation } from "react-router-dom";

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
    const [updatingId, setUpdatingId] = useState(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const filterBusinessId = queryParams.get("businessId");
    const filterBusinessName = queryParams.get("name");

    const fetchCompliances = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAssignedCompliances();

            console.log("URL Filter ID:", filterBusinessId); // Debugging
            console.log("First Compliance Item:", response.data[0]); // Debugging

            if (filterBusinessId) {
                const filteredData = response.data.filter(item => {
                    // Use String() to ensure we aren't failing due to type (Number vs String)
                    return String(item.businessId) === String(filterBusinessId);
                });
                setCompliances(filteredData);
            } else {
                setCompliances(response.data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, [filterBusinessId]);

    useEffect(() => {
        fetchCompliances();
    }, [fetchCompliances]);

    const handleStatusUpdate = async (complianceId, status) => {
        setUpdatingId(complianceId);
        try {
            await updateComplianceStatusByCA(complianceId, status);
            setCompliances(prev => prev.map(item =>
                item.complianceId === complianceId ? { ...item, status } : item
            ));
        } catch (error) {
            console.error("Update error:", error);
            alert("⚠️ Failed to update status. Please try again.");
            fetchCompliances();
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
                    <p className="text-gray-500 mt-1">Review client evidence and update regulatory status for assigned businesses.</p>
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
                                className={`relative bg-white border rounded-2xl p-6 shadow-sm transition-all hover:shadow-md flex flex-col ${updatingId === compliance.complianceId ? "opacity-60 pointer-events-none" : "opacity-100"
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

                                <div className="mt-4 space-y-3 flex-grow">
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

                                    {/* ATTACHED DOCUMENTS - THE CA REVIEW SECTION */}
                                    <div className="mt-6">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Client Evidence</h4>
                                        <div className="space-y-2">
                                            {compliance.documents && compliance.documents.length > 0 ? (
                                                compliance.documents.map((doc) => (
                                                    <a
                                                        key={doc.documentId}
                                                        href={doc.fileUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-700 text-xs font-bold hover:bg-black hover:text-white transition-all group truncate"
                                                    >
                                                        <span className="group-hover:scale-110 transition-transform">📄</span>
                                                        {doc.fileName}
                                                    </a>
                                                ))
                                            ) : (
                                                <div className="text-xs text-amber-500 bg-amber-50 p-2.5 rounded-xl border border-amber-100 italic">
                                                    No documents uploaded by client yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Status Selector */}
                                <div className="mt-6 pt-4 border-t border-gray-50">
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">
                                        Compliance Action
                                    </label>
                                    <select
                                        value={compliance.status}
                                        onChange={(e) => handleStatusUpdate(compliance.complianceId, e.target.value)}
                                        className="w-full bg-gray-900 text-white py-2.5 px-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-400 outline-none transition cursor-pointer hover:bg-black"
                                    >
                                        <option value="PENDING">🕒 Keep as Pending</option>
                                        <option value="COMPLETED">✅ Verify & Complete</option>
                                        <option value="OVERDUE">🚨 Mark as Overdue</option>
                                    </select>
                                </div>

                                {/* Loading Overlay */}
                                {updatingId === compliance.complianceId && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 rounded-2xl backdrop-blur-[1px]">
                                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {!loading && compliances.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">No active compliances to review.</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default ClientCompliances;