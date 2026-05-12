import { useEffect, useState, useCallback } from "react";
import { getPendingCAs, approveCA, rejectCA } from "../../services/adminService";
import MainLayout from "../../components/layouts/MainLayout";

const CAManagement = () => {
    const [caUsers, setCaUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null); // Track which CA is being approved

    const fetchPendingCAs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getPendingCAs();
            setCaUsers(response.data);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPendingCAs();
    }, [fetchPendingCAs]);

    const handleApprove = async (id) => {
        setActionId(id);
        try {
            await approveCA(id);
            // Optimistic UI: Filter out the approved CA from the pending list
            setCaUsers(prev => prev.filter(ca => ca.id !== id));
            // You can replace browser alert with a toast notification if available
            console.log("CA Approved successfully");
        } catch (error) {
            alert("Approval Failed. Please check network.");
        } finally {
            setActionId(null);
        }
    };

    const handleReject = async (id) => {
        console.log("Starting rejection process for ID:", id);
        setActionId(id);

        try {
            // Force the call and log the result
            const response = await rejectCA(id);
            console.log("Success Response:", response);

            setCaUsers(prev => prev.filter(ca => ca.id !== id));
        } catch (err) {
            // This will print the ACTUAL backend error (404, 500, etc.)
            console.error("ACTUAL BACKEND ERROR:", err.response?.data || err.message);
            alert(`Failed: ${err.response?.data?.message || "Check Console"}`);
        } finally {
            setActionId(null);
        }
    };

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            CA Verification
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Review and approve registration requests from Chartered Accountants.</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-2xl flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </span>
                        <span className="text-sm font-bold text-amber-700">{caUsers.length} Pending Requests</span>
                    </div>
                </header>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-400">Accountant Details</th>
                                    <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-400">System Role</th>
                                    <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    [...Array(3)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan="4" className="p-8 bg-gray-50/10"></td>
                                        </tr>
                                    ))
                                ) : caUsers.length > 0 ? (
                                    caUsers.map((ca) => (
                                        <tr key={ca.id} className="hover:bg-gray-50/30 transition-colors group">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                                        {ca.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{ca.name}</p>
                                                        <p className="text-sm text-gray-400 font-medium">{ca.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black tracking-widest uppercase">
                                                    {ca.role.split('_')[1]}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <span className={`flex items-center gap-2 text-sm font-bold ${ca.approvalStatus === "APPROVED"
                                                    ? "text-emerald-600"
                                                    : ca.approvalStatus === "REJECTED"
                                                        ? "text-red-600"
                                                        : "text-amber-500"
                                                    }`}>
                                                    <span className={`h-2 w-2 rounded-full ${ca.approvalStatus === "APPROVED"
                                                        ? "bg-emerald-500"
                                                        : ca.approvalStatus === "REJECTED"
                                                            ? "bg-red-500"
                                                            : "bg-amber-500"
                                                        }`}></span>
                                                    {ca.approvalStatus || "PENDING"}
                                                </span>
                                            </td>
                                            <td className="p-5 text-right">
                                                {ca.approvalStatus === "PENDING" && (
                                                    <div className="flex justify-end gap-3">

                                                        <button
                                                            onClick={() => handleApprove(ca.id)}
                                                            disabled={actionId === ca.id}
                                                            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all disabled:opacity-50"
                                                        >
                                                            {actionId === ca.id ? "Processing..." : "Approve"}
                                                        </button>

                                                        <button
                                                            onClick={() => handleReject(ca.id)}
                                                            disabled={actionId === ca.id}
                                                            className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-red-700 transition-all disabled:opacity-50"
                                                        >
                                                            Reject
                                                        </button>

                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-4xl mb-4">✅</span>
                                                <h3 className="text-lg font-bold text-gray-900">Queue is empty</h3>
                                                <p className="text-gray-400 text-sm">No new CA registrations to approve at this time.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default CAManagement;