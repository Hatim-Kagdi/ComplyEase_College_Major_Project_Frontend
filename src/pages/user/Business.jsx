import { useEffect, useState } from "react";
import {
    createBusiness,
    getBusinesses,
    deleteBusiness,
    updateBusiness,
    requestCA // Ensure this is exported in your businessService.js
} from "../../services/businessService";
import MainLayout from "../../components/layouts/MainLayout";

const Business = () => {
    const [businesses, setBusinesses] = useState([]);
    const [formData, setFormData] = useState({
        businessName: "",
        businessGstNumber: ""
    });
    const [editingId, setEditingId] = useState(null);

    // FETCH ALL BUSINESSES
    const fetchBusinesses = async () => {
        try {
            const response = await getBusinesses();
            setBusinesses(response.data);
        } catch (error) {
            console.error("Error fetching businesses:", error);
        }
    };

    useEffect(() => {
        fetchBusinesses();
    }, []);

    // HANDLE INPUT CHANGE
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // CREATE OR UPDATE BUSINESS
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateBusiness(editingId, formData);
                alert("Business details updated successfully!");
                setEditingId(null);
            } else {
                await createBusiness(formData);
                alert("New business registered!");
            }
            setFormData({ businessName: "", businessGstNumber: "" });
            fetchBusinesses();
        } catch (error) {
            console.error(error);
            alert("Operation failed. Please check your data.");
        }
    };

    // DELETE BUSINESS
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this business?")) {
            try {
                await deleteBusiness(id);
                fetchBusinesses();
            } catch (error) {
                alert("Delete failed.");
            }
        }
    };

    // PRE-FILL FORM FOR EDITING
    const handleEdit = (business) => {
        setEditingId(business.businessId);
        setFormData({
            businessName: business.businessName,
            businessGstNumber: business.businessGstNumber
        });
    };

    // REQUEST CA FUNCTIONALITY (MOVED FROM DASHBOARD)
    const handleRequestCA = async (businessId) => {
        try {
            await requestCA(businessId);
            alert("Request sent to Admin for CA assignment.");
            fetchBusinesses(); // Refresh to update status to 'REQUESTED'
        } catch (error) {
            alert("Failed to send CA request.");
        }
    };

    return (
        <MainLayout>
            <div className="p-8 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Business Management</h1>

                {/* FORM SECTION */}
                <div className="bg-white p-6 rounded-xl shadow-sm border mb-10">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingId ? "Edit Business" : "Register New Business"}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            name="businessName"
                            placeholder="Business Name"
                            value={formData.businessName}
                            onChange={handleChange}
                            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        <input
                            type="text"
                            name="businessGstNumber"
                            placeholder="GST Number"
                            value={formData.businessGstNumber}
                            onChange={handleChange}
                            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        <button
                            type="submit"
                            className={`p-2 rounded text-white font-medium transition ${
                                editingId ? "bg-blue-600" : "bg-black"
                            }`}
                        >
                            {editingId ? "Update Details" : "Add Business"}
                        </button>
                    </form>
                    {editingId && (
                        <button 
                            onClick={() => { setEditingId(null); setFormData({businessName: "", businessGstNumber: ""}); }}
                            className="mt-2 text-sm text-gray-500 underline"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>

                {/* BUSINESS LIST SECTION */}
                <div className="grid gap-6">
                    <h2 className="text-2xl font-semibold">Your Registered Businesses</h2>
                    {businesses.length === 0 ? (
                        <p className="text-gray-500">No businesses found. Add your first one above!</p>
                    ) : (
                        businesses.map((business) => (
                            <div key={business.businessId} className="bg-white border p-5 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{business.businessName}</h3>
                                    <p className="text-gray-600">GST: {business.businessGstNumber}</p>
                                    
                                    {/* STATUS BADGE */}
                                    <div className="mt-2">
                                        {business.caAssignmentStatus === "NO_CA" && (
                                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">No CA Assigned</span>
                                        )}
                                        {business.caAssignmentStatus === "REQUESTED" && (
                                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Request Pending</span>
                                        )}
                                        {business.caAssignmentStatus === "ASSIGNED" && (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">CA Assigned</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {/* REQUEST CA BUTTON - Only shows if NO_CA */}
                                    {business.caAssignmentStatus === "NO_CA" && (
                                        <button
                                            onClick={() => handleRequestCA(business.businessId)}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium"
                                        >
                                            Request CA
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleEdit(business)}
                                        className="border border-blue-500 text-blue-500 hover:bg-blue-50 px-4 py-2 rounded text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(business.businessId)}
                                        className="border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Business;