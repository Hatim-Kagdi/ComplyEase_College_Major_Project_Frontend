import API from "./api"

//USER API
export const createCompliance = async (data) => {
    return await API.post("/user/compliance", data)
}

export const getCompliances = async () => {
    return await API.get("/user/compliance")
}

export const getComplianceById = async (id) => {
    return await API.get(`/user/compliance/${id}`)
}

export const updateCompliance = async (id, data) => {
    return await API.put(`/user/compliance/${id}`, data)
}

export const updateComplianceStatus = async (id, status) => {
    return await API.patch(
        `/user/compliance/${id}/status?status=${status}`
    )
}

export const deleteCompliance = async (id) => {
    return await API.delete(`/user/compliance/${id}`)
}

export const getCompliancesByBusiness = async (businessId) => {
    return await API.get(`/user/compliance/business/${businessId}`); 
};

//CA API
export const updateComplianceStatusByCA = async (
    id,
    status
) => {

    return await API.patch(
        `/ca/compliance/${id}/status?status=${status}`
    )
}
