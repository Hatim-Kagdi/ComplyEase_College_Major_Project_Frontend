import API from "./api"

export const getDashboardStats = async () => {
    return await API.get("/user/dashboard/stats")
}