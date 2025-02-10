import axios from "axios";
import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";

const ViewAllMaterials = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");

  const tutorEmail = user?.email;

  useEffect(() => {
    axios
      .get(
        `https://learn-bridge-server-two.vercel.app/materials/tutor/${tutorEmail}`
      )
      .then((response) => {
        setMaterials(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch materials:", error);
        setLoading(false);
      });
  }, [tutorEmail]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      axios
        .delete(`https://learn-bridge-server-two.vercel.app/materials/${id}`)
        .then(() => {
          setMaterials((prev) =>
            prev.filter((material) => material._id !== id)
          );
        })
        .catch((error) => {
          console.error("Failed to delete material:", error);
        });
    }
  };

  const openUpdateModal = (material) => {
    setSelectedMaterial(material);
    setUpdatedTitle(material.title);
  };

  const handleUpdate = () => {
    if (updatedTitle) {
      axios
        .put(
          `https://learn-bridge-server-two.vercel.app/materials/${selectedMaterial._id}`,
          {
            title: updatedTitle,
          }
        )
        .then(() => {
          setMaterials((prev) =>
            prev.map((material) =>
              material._id === selectedMaterial._id
                ? { ...material, title: updatedTitle }
                : material
            )
          );
          closeModal();
        })
        .catch((error) => {
          console.error("Failed to update material:", error);
        });
    }
  };

  const closeModal = () => {
    setSelectedMaterial(null);
    setUpdatedTitle("");
  };

  if (loading) {
    return <div className="text-center py-10">Loading materials...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Uploaded Materials
      </h1>
      {materials.length === 0 ? (
        <p className="text-center text-gray-500">No materials found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <div
              key={material._id}
              className="card w-full bg-base-100 shadow-xl border"
            >
              <figure>
                <img
                  src={material.image}
                  alt={material.title}
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{material.title}</h2>
                <p>
                  <a
                    href={material.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Material
                  </a>
                </p>
                <div className="card-actions justify-end mt-4">
                  <button
                    onClick={() => openUpdateModal(material)}
                    className="btn btn-sm btn-warning"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(material._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedMaterial && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Update Material</h3>
            <label className="block mb-2 text-sm font-medium">New Title:</label>
            <input
              type="text"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              className="input input-bordered w-full mb-4"
            />
            <div className="modal-action">
              <button onClick={handleUpdate} className="btn btn-success">
                Save
              </button>
              <button onClick={closeModal} className="btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllMaterials;
