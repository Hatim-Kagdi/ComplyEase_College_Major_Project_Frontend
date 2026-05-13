import { useEffect, useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { createDocument, getDocuments, deleteDocument } from "../../services/documentService";
import { getBusinesses } from "../../services/businessService";
import { getCompliancesByBusiness } from "../../services/complianceService";

const Document = () => {
    const [documents, setDocuments] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [compliances, setCompliances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        businessId: "",
        complianceId: "",
        fileName: "",
        fileUrl: "",
        documentType: "GST_INVOICE"
    });

    // Helper for Badge Styles
    const getDocTypeBadge = (type) => {
        const styles = {
            GST_INVOICE: "bg-blue-100 text-blue-700",
            TAX_RECEIPT: "bg-purple-100 text-purple-700",
            BALANCE_SHEET: "bg-emerald-100 text-emerald-700",
            OTHER: "bg-gray-100 text-gray-700"
        };
        return styles[type] || styles.OTHER;
    };

    // 1. Initial Load of Documents and Businesses
    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [docRes, busRes] = await Promise.all([
                getDocuments(),
                getBusinesses()
            ]);
            setDocuments(docRes.data || []);
            setBusinesses(busRes.data || []);
        } catch (error) {
            console.error("Load error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    // 2. Fetch Compliances when Business is selected
    useEffect(() => {
        const fetchBusinessCompliances = async () => {
            if (!formData.businessId) {
                setCompliances([]);
                return;
            }

            try {
                console.log("Fetching for business:", formData.businessId);
                const res = await getCompliancesByBusiness(formData.businessId);

                // Check if res.data is actually an array
                if (res.data && Array.isArray(res.data)) {
                    setCompliances(res.data);
                } else if (res.data && typeof res.data === 'object') {
                    // If it's a single object, wrap it in an array so .map() works
                    setCompliances([res.data]);
                } else {
                    setCompliances([]);
                }
            } catch (error) {
                console.error("Error fetching compliances:", error);
                setCompliances([]);
            }
        };

        fetchBusinessCompliances();
    }, [formData.businessId]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({
                ...prev,
                fileUrl: reader.result,
                fileName: prev.fileName || file.name
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fileUrl) return alert("Please select a file first");
        if (!formData.complianceId) return alert("Please select a compliance task");

        setIsSubmitting(true);
        try {
            await createDocument(formData);
            alert("✅ Document saved to vault!");
            setFormData({
                businessId: "",
                complianceId: "",
                fileName: "",
                fileUrl: "",
                documentType: "GST_INVOICE"
            });
            // Refresh list
            const docRes = await getDocuments();
            setDocuments(docRes.data || []);
        } catch (error) {
            alert("❌ Upload failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this document?")) {
            try {
                await deleteDocument(id);
                setDocuments(prev => prev.filter(doc => doc.documentId !== id));
            } catch (error) {
                alert("Delete Failed");
            }
        }
    };

    if (loading) return <MainLayout><div className="p-10 text-center">Loading Vault...</div></MainLayout>;

    return (
        <MainLayout>
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Document Vault</h1>
                    <p className="text-gray-500">Manage evidence for your compliance tasks.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* LEFT COLUMN: UPLOAD FORM */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border rounded-2xl p-6 shadow-sm sticky top-8">
                            <h2 className="text-lg font-bold mb-4">📤 Upload</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400">BUSINESS</label>
                                    <select
                                        name="businessId"
                                        value={formData.businessId}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2.5 bg-gray-50 outline-none"
                                        required
                                    >
                                        <option value="">Select Business</option>
                                        {businesses.map((b) => (
                                            <option key={b.businessId} value={b.businessId}>{b.businessName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">2. Select Compliance Task</label>
                                    <select
                                        name="complianceId"
                                        value={formData.complianceId}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2.5 bg-gray-50 focus:ring-2 focus:ring-black outline-none transition disabled:opacity-50"
                                        required
                                        disabled={!formData.businessId || compliances.length === 0}
                                    >
                                        <option value="">
                                            {!formData.businessId
                                                ? "Select Business First"
                                                : compliances.length === 0
                                                    ? "No Tasks Found"
                                                    : "Choose Task..."}
                                        </option>

                                        {compliances.map((c) => {
                                            // This log will show in your browser console (F12) 
                                            // to verify the object matches your JSON snippet
                                            console.log("Mapping compliance item:", c);

                                            return (
                                                <option key={c.complianceId} value={c.complianceId}>
                                                    {/* Explicitly using the names from your JSON */}
                                                    {c.complianceType.replace('_', ' ')} (Due: {c.dueDate})
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400">FILE</label>
                                    <input type="file" onChange={handleFileChange} className="w-full text-sm" required />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400">DISPLAY NAME</label>
                                    <input
                                        type="text"
                                        name="fileName"
                                        value={formData.fileName}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2.5 bg-gray-50"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 rounded-lg text-white font-bold bg-black hover:bg-gray-800 transition disabled:bg-gray-400"
                                >
                                    {isSubmitting ? "Uploading..." : "Save to Vault"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: DOCUMENT LIST (The missing part) */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {documents.length > 0 ? (
                                documents.map((doc) => (
                                    <div key={doc.documentId} className="bg-white border rounded-xl p-5 hover:shadow-md transition flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getDocTypeBadge(doc.documentType)}`}>
                                                    {doc.documentType.replace('_', ' ')}
                                                </div>
                                                <button onClick={() => handleDelete(doc.documentId)} className="text-gray-300 hover:text-red-500">×</button>
                                            </div>
                                            <h3 className="font-bold text-gray-800 truncate">{doc.fileName}</h3>
                                            <p className="text-sm text-gray-500 mt-1">🏢 {doc.businessName}</p>
                                        </div>
                                        <div className="mt-6">
                                            <a
                                                href={doc.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block w-full text-center bg-gray-50 border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100"
                                            >
                                                View File
                                            </a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 bg-gray-50 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-gray-400">
                                    <p className="text-lg font-medium">No documents found in vault.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Document;