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