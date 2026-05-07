import API from "./api"

// CREATE BUSINESS
export const createBusiness = async (data) => {
    return await API.post("/user/business", data)
}

// GET ALL BUSINESSES
export const getBusinesses = async () => {
    return await API.get("/user/business")
}

// GET BUSINESS BY ID
export const getBusinessById = async (id) => {
    return await API.get(`/user/business/${id}`)
}

// UPDATE BUSINESS
export const updateBusiness = async (id, data) => {
    return await API.put(`/user/business/${id}`, data)
}

// DELETE BUSINESS
export const deleteBusiness = async (id) => {
    return await API.delete(`/user/business/${id}`)
}

export const requestCA = async (id) => {
    return await API.patch(`/user/business/${id}/request-ca`)
}

export const getAssignedBusinesses = async () => {
    return await API.get("/ca/business")
}