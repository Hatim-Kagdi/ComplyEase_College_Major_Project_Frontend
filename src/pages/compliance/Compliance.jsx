import { useEffect, useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import {
    createCompliance,
    getCompliances,
    deleteCompliance,
    updateCompliance,
    updateComplianceStatus
} from "../../services/complianceService";
import { getBusinesses } from "../../services/businessService";

const Compliance = () => {
    const [compliances, setCompliances] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        businessId: "",
        complianceType: "",
        dueDate: ""
    });

    // FETCH DATA ON LOAD
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [compRes, busRes] = await Promise.all([
                    getCompliances(),
                    getBusinesses()
                ]);
                setCompliances(compRes.data);
                setBusinesses(busRes.data);
            } catch (error) {
                console.error("Initialization error:", error);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const fetchCompliances = async () => {
        try {
            const response = await getCompliances();
            setCompliances(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateCompliance(editingId, formData);
                alert("✅ Compliance Updated");
                setEditingId(null);
            } else {
                await createCompliance(formData);
                alert("✅ Compliance Created");
            }
            setFormData({ businessId: "", complianceType: "", dueDate: "" });
            fetchCompliances();
        } catch (error) {
            alert("❌ Operation Failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                await deleteCompliance(id);
                fetchCompliances();
            } catch (error) {
                alert("Delete Failed");
            }
        }
    };

    const handleEdit = (comp) => {
        setEditingId(comp.complianceId);
        setFormData({
            businessId: comp.businessId,
            complianceType: comp.complianceType,
            dueDate: comp.dueDate
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleStatusChange = async (id, status) => {
        try {
            await updateComplianceStatus(id, status);
            fetchCompliances();
        } catch (error) {
            alert("Status Update Failed");
        }
    };

    // Helper for status styling
    const getStatusStyle = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
            case 'OVERDUE': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    if (loading) return <MainLayout><div className="p-10">Loading...</div></MainLayout>;

    return (
        <MainLayout>
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Compliance Tracking</h1>

                {/* FORM CARD */}
                <div className="bg-white border shadow-sm rounded-xl p-6 mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        {editingId ? "Modify Compliance Record" : "Add New Compliance Item"}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-600">Business</label>
                            <select
                                name="businessId"
                                value={formData.businessId}
                                onChange={handleChange}
                                className="border p-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black outline-none"
                                required
                            >
                                <option value="">Select Business</option>
                                {businesses.map((b) => (
                                    <option key={b.businessId} value={b.businessId}>{b.businessName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-600">Type</label>
                            <select
                                name="complianceType"
                                value={formData.complianceType}
                                onChange={handleChange}
                                className="border p-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black outline-none"
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="GST_RETURN">GST RETURN</option>
                                <option value="TDS">TDS</option>
                                <option value="INCOME_TAX">INCOME TAX</option>
                                <option value="PF">PF</option>
                                <option value="ESI">ESI</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-600">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="border p-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black outline-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`p-2 rounded-lg text-white font-bold transition duration-200 ${
                                editingId ? "bg-blue-600 hover:bg-blue-700" : "bg-black hover:bg-gray-800"
                            }`}
                        >
                            {editingId ? "Update Record" : "Add Record"}
                        </button>
                    </form>
                    {editingId && (
                        <button 
                            onClick={() => {setEditingId(null); setFormData({businessId:"", complianceType:"", dueDate:""})}}
                            className="text-sm text-red-500 mt-2 underline"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>

                {/* COMPLIANCE LIST */}
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Compliance Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {compliances.length > 0 ? (
                        compliances.map((comp) => (
                            <div key={comp.complianceId} className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
                                <div className={`p-1 text-center text-[10px] font-bold tracking-widest border-b ${getStatusStyle(comp.status)}`}>
                                    {comp.status}
                                </div>
                                <div className="p-5 flex-grow">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-lg font-bold text-gray-900">{comp.complianceType.replace('_', ' ')}</h3>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p className="flex justify-between">
                                            <span>Business:</span> 
                                            <span className="font-semibold text-gray-800">{comp.businessName}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span>Due Date:</span> 
                                            <span className="font-semibold text-gray-800">{comp.dueDate}</span>
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-4 border-t">
                                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Update Status</label>
                                        <select
                                            value={comp.status}
                                            onChange={(e) => handleStatusChange(comp.complianceId, e.target.value)}
                                            className="w-full border rounded-md p-1.5 text-sm bg-gray-50 focus:ring-1 focus:ring-black outline-none"
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="COMPLETED">COMPLETED</option>
                                            <option value="OVERDUE">OVERDUE</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-3 flex gap-2 border-t">
                                    <button
                                        onClick={() => handleEdit(comp)}
                                        className="flex-1 bg-white border border-blue-500 text-blue-600 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(comp.complianceId)}
                                        className="flex-1 bg-white border border-red-500 text-red-600 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-50 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed">
                            <p className="text-gray-500">No compliance records found. Use the form above to start tracking.</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Compliance;