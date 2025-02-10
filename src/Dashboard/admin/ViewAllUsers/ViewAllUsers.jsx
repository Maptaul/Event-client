import React, { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import Swal from "sweetalert2";

const ViewAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // Fetch users from the backend
  const fetchUsers = async (query = "") => {
    try {
      const response = await fetch(
        `https://learn-bridge-server-two.vercel.app/users${
          query ? `?searchQuery=${query}` : ""
        }`
      );
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle search query input
  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(searchQuery);
  };

  // Update user role
  const updateRole = async (id, newRole) => {
    try {
      const response = await fetch(
        `https://learn-bridge-server-two.vercel.app/users/update-role/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update role");
      }

      // Success Alert
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User role updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchUsers(); // Refresh user list
    } catch (err) {
      // Error Alert
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen rounded-md">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold mb-4">
          All Users: {users.length}
        </h1>
        <form onSubmit={handleSearch} className="mb-6 flex items-center gap-3">
          <input
            type="text"
            placeholder="Search User Name/Email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full md:w-1/2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
        </form>
      </div>
      {users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <table className="table-auto w-auto bg-white text-sm shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-4 text-left">Image-Name</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Email Address</th>
              <th className="p-4 text-left">Update Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 font-bold rounded-full flex items-center justify-center">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="capitalize">{user.name || "No Name"}</span>
                </td>
                <td className="p-4 capitalize">{user.role || "No Role"}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 flex items-center gap-2">
                  <select
                    value={user.role || ""}
                    onChange={(e) => updateRole(user._id, e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                    <option value="tutor">Tutor</option>
                  </select>
                  <button
                    onClick={() => updateRole(user._id, user.role)}
                    className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    <FaPen />
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewAllUsers;
