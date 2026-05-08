import { useEffect, useState, useCallback } from "react";
import { getAllBusinesses } from "../../services/adminService";
import MainLayout from "../../components/layouts/MainLayout";

const BusinessOversight = () => {
    const [businesses, setBusinesses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchBusinesses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllBusinesses();
            setBusinesses(response.data);
        } catch (error) {
            console.error("Error fetching businesses:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBusinesses();
    }, [fetchBusinesses]);

    // Filter logic for search bar
    const filteredBusinesses = businesses.filter(b => 
        b.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.businessGstNumber.includes(searchTerm)
    );

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            Business Oversight
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Monitor all registered businesses and their CA assignments.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search by name or GST..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-black outline-none w-full md:w-64 transition-all"
                        />
                    </div>
                </header>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-400">Company Details</th>
                                    <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-400">Registration</th>
                                    <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-400 text-center">CA Status</th>
                                    <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan="4" className="p-8 bg-gray-50/10"></td>
                                        </tr>
                                    ))
                                ) : filteredBusinesses.length > 0 ? (
                                    filteredBusinesses.map((business) => (
                                        <tr key={business.businessId} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-xs">
                                                        {business.businessName.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <p className="font-extrabold text-gray-800">{business.businessName}</p>
                                                </div>
                                            </td>
                                            <td className="p-5 text-sm">
                                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-tighter">GSTIN</p>
                                                <p className="font-mono font-bold text-gray-700">{business.businessGstNumber}</p>
                                            </td>
                                            <td className="p-5 text-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                                                    business.caAssignmentStatus === 'ASSIGNED' 
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                    : 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse'
                                                }`}>
                                                    {business.caAssignmentStatus}
                                                </span>
                                            </td>
                                            <td className="p-5 text-right">
                                                <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-20 text-center text-gray-400">
                                            No businesses found matching your search.
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

export default BusinessOversight;