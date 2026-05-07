import API from "./api"

// GET ASSIGNED BUSINESS COMPLIANCES
export const getAssignedCompliances = async () => {
    return await API.get("/ca/compliance")
}

// UPDATE COMPLIANCE STATUS
export const updateComplianceStatus = async (
    complianceId,
    status
) => {

    return await API.patch(
        `/user/compliance/${complianceId}/status?status=${status}`
    )
}

// GET ASSIGNED BUSINESS DOCUMENTS
export const getCADocuments = async () => {
    return await API.get("/ca/document")
}

export const getCADashboardStats = async () => {
    return await API.get("/ca/dashboard/stats")
}