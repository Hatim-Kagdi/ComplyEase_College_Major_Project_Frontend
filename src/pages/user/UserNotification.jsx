import { useEffect, useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { getUserNotifications } from "../../services/notificationService";

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getUserNotifications();
      
      // Ensure we are setting an array and sorting by newest first
      const data = Array.isArray(response.data) ? response.data : [];
      const sortedData = data.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
      
      setNotifications(sortedData);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {notifications.length} Total
          </span>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 text-gray-500 italic">Loading updates...</div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.notificationId}
                className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl p-5 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">
                      {notification.businessName}
                    </h2>
                    <p className="text-xs text-gray-400">
                      ID: #{notification.businessId}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      notification.status === "SENT"
                        ? "bg-green-100 text-green-700"
                        : notification.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {notification.status}
                  </span>
                </div>

                <p className="text-gray-600 leading-relaxed mb-4">
                  {notification.message}
                </p>

                <div className="flex items-center text-sm text-gray-400 border-t pt-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(notification.sentAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg font-medium">No notifications found.</p>
              <p className="text-gray-400 text-sm">We'll notify you when there's an update on your compliance.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default UserNotifications;