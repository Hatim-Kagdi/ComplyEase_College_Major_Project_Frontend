import api from "./api";

export const getUserNotifications = () => {
    return api.get("/user/notification");
};