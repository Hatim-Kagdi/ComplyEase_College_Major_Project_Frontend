import API from "./api"

// CREATE DOCUMENT
export const createDocument = async (data) => {
    return await API.post("/user/document", data)
}

// GET ALL DOCUMENTS
export const getDocuments = async () => {
    return await API.get("/user/document")
}

// GET DOCUMENT BY ID
export const getDocumentById = async (id) => {
    return await API.get(`/user/document/${id}`)
}

// DELETE DOCUMENT
export const deleteDocument = async (id) => {
    return await API.delete(`/user/document/${id}`)
}