import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {

    const { user, loading } = useAuth();

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // src/routes/ProtectedRoutes.jsx

    // CA Approval check using Enum values
    if (user.role === "ROLE_CA" && user.approvalStatus !== "APPROVED") {
        // If they were rejected, maybe send them to a different page
        if (user.approvalStatus === "REJECTED") {
            return <Navigate to="/account-rejected" replace />;
        }
        // Otherwise, assume PENDING and send to the waiting page
        return <Navigate to="/ca/pending-approval" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;