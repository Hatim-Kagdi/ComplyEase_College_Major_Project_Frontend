import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { reapplyCA } from "../../services/caService";
import { useState } from "react";

const PendingApproval = () => {
    const { user, login, logout } = useAuth();
    const [isReapplying, setIsReapplying] = useState(false);
    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    const isRejected = user?.approvalStatus === "REJECTED";

    const handleReapply = async () => {
        setIsReapplying(true);
        try {
            const response = await reapplyCA(email);
            // Update local state so the UI switches back to "Pending"
            login(response.data);
            alert("Re-application submitted successfully!");
        } catch (error) {
            alert("Failed to re-apply. Please try again.");
        } finally {
            setIsReapplying(false);
        }
    };


    const handleSignOut = async () => {
        localStorage.clear();
        navigate("/");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center p-10 bg-white shadow-xl rounded-3xl border border-gray-100">

                <div className="mb-6 flex justify-center">
                    {isRejected ? (
                        <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center">
                            <span className="text-4xl">❌</span>
                        </div>
                    ) : (
                        <div className="h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center text-4xl animate-pulse">⏳</div>
                    )}
                </div>

                <h1 className={`text-2xl font-black tracking-tight ${isRejected ? "text-red-600" : "text-amber-600"}`}>
                    {isRejected ? "Registration Rejected" : "Approval Pending"}
                </h1>

                <p className="mt-4 text-gray-600 font-medium">
                    {isRejected
                        ? "We regret to inform you that your profile could not be verified."
                        : "Your profile is currently being verified by our administrators."}
                </p>

                <div className="mt-8 flex flex-col gap-3">
                    {isRejected && (
                        <button
                            onClick={handleReapply}
                            disabled={isReapplying}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-blue-300"
                        >
                            {isReapplying ? "Submitting..." : "Re-apply for Verification"}
                        </button>
                    )}

                    <Link to="/" className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all">
                        Go Back Home
                    </Link>

                    <button onClick={handleSignOut} className="text-sm text-red-500 font-bold hover:underline mt-2">
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PendingApproval;