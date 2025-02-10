import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ViewAllMaterial = () => {
  const [materials, setMaterials] = useState([]);

  // Fetch materials on component mount
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(
          "https://learn-bridge-server-two.vercel.app/materials"
        );
        setMaterials(response.data);
      } catch (error) {
        console.error("Failed to fetch materials:", error);
      }
    };
    fetchMaterials();
  }, []);

  // Delete material
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://learn-bridge-server-two.vercel.app/materials/${id}`
          );
          setMaterials((prev) =>
            prev.filter((material) => material._id !== id)
          );
          Swal.fire("Deleted!", "The material has been removed.", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete the material.", "error");
        }
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">View All Materials</h1>
      {materials.length === 0 ? (
        <p>No materials found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">Session ID</th>
                <th className="border border-gray-300 px-4 py-2">
                  Tutor Email
                </th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material._id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {material.title}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {material.sessionId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {material.tutorEmail}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDelete(material._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewAllMaterial;
