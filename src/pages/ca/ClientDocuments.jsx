import { useEffect, useState, useMemo } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { getCADocuments } from "../../services/caService";

const CADocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const response = await getCADocuments();
            setDocuments(response.data);
        } catch (error) {
            console.error("Error fetching client documents:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    // Filter documents based on business name or file name
    const filteredDocuments = useMemo(() => {
        return documents.filter(doc => 
            doc.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [documents, searchTerm]);

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            Client Document Vault
                        </h1>
                        <p className="text-gray-500 mt-1">Access and review all files uploaded by your assigned businesses.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <input 
                            type="text"
                            placeholder="Search business or file..."
                            className="w-full md:w-80 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-black outline-none transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute left-3 top-3 text-gray-400">🔍</span>
                    </div>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(n => <div key={n} className="h-48 bg-gray-100 animate-pulse rounded-2xl" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDocuments.length > 0 ? (
                            filteredDocuments.map((doc) => (
                                <div
                                    key={doc.documentId}
                                    className="group bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-xl hover:border-black transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:bg-black group-hover:text-white transition-colors">
                                            📄
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-900 truncate mb-1" title={doc.fileName}>
                                            {doc.fileName}
                                        </h2>
                                        <div className="space-y-1.5 mb-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Business</span>
                                                <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md truncate max-w-[120px]">
                                                    {doc.businessName}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Type</span>
                                                <span className="text-xs text-gray-600 font-medium">
                                                    {doc.documentType.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <a
                                        href={doc.fileUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full text-center bg-gray-900 text-white py-2 rounded-xl text-sm font-bold hover:bg-black transition-colors"
                                    >
                                        View File
                                    </a>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 font-medium">
                                    {searchTerm ? "No documents match your search." : "No documents available for review."}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default CADocuments;