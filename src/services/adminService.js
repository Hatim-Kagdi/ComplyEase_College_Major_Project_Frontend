import API from "./api"

export const getRequestedBusinesses = async () => {
    return await API.get("/admin/business/requested")
}

export const getAllCAUsers = async () => {
    return await API.get("/admin/ca")
}

export const assignCA = async (businessId, caId) => {
    return await API.patch(
        `/admin/business/${businessId}/assign-ca/${caId}`
    )
}

export const getAllUsers = async () => {
    return await API.get("/admin/users")
}

export const toggleUserStatus = async (id) => {
    return await API.patch(
        `/admin/users/${id}/toggle-status`
    )
}

export const deleteUser = async (id) => {
    return await API.delete(`/admin/users/${id}`)
}

export const getPendingCAs = async () => {
    return await API.get("/admin/ca/pending")
}

export const approveCA = async (id) => {
    return await API.patch(
        `/admin/ca/${id}/approve`
    )
}

export const getAllBusinesses = async () => {
    return await API.get("/admin/business")
}

export const getPlatformStats = async () => {
    return await API.get("/admin/dashboard/stats")
}