import { useEffect, useState, useCallback } from "react";
import { getAllUsers, toggleUserStatus, deleteUser } from "../../services/adminService";
import MainLayout from "../../components/layouts/MainLayout";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllUsers();
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleToggleStatus = async (id) => {
        try {
            await toggleUserStatus(id);
            // Optimistic local update
            setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
        } catch (error) {
            console.error(error);
            fetchUsers();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await deleteUser(id);
                setUsers(prev => prev.filter(u => u.id !== id));
            } catch (error) {
                console.error(error);
                alert("Failed to delete user.");
            }
        }
    };

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            User Management
                        </h1>
                        <p className="text-gray-500 font-medium">Control platform access and manage account roles.</p>
                    </div>
                    <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-bold text-gray-600">
                        Total Users: {users.length}
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-400">User Identity</th>
                                    <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-400">Role</th>
                                    <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-400">Account Status</th>
                                    <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-400 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan="4" className="p-6 bg-gray-50/20"></td>
                                        </tr>
                                    ))
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                                                    user.role === 'ROLE_CA' 
                                                    ? 'border-purple-200 bg-purple-50 text-purple-600' 
                                                    : 'border-blue-200 bg-blue-50 text-blue-600'
                                                }`}>
                                                    {user.role.replace('ROLE_', '')}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${user.active ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                                    <span className={`text-sm font-bold ${user.active ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                        {user.active ? 'Active' : 'Suspended'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={() => handleToggleStatus(user.id)}
                                                        className={`text-xs font-black px-4 py-2 rounded-xl border transition-all ${
                                                            user.active 
                                                            ? 'border-amber-200 text-amber-600 hover:bg-amber-50' 
                                                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                                                        }`}
                                                    >
                                                        {user.active ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Delete User"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default UserManagement;