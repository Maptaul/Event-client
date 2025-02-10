import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../Providers/AuthProvider";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;

const UploadMaterials = () => {
  const { user } = useContext(AuthContext);
  const [approvedSessions, setApprovedSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    sessionId: "",
    tutorEmail: user?.email || "",
    image: null,
    link: "",
  });

  useEffect(() => {
    // Fetch approved sessions for the logged-in tutor
    if (user?.email) {
      axios
        .get(
          `https://learn-bridge-server-two.vercel.app/studysessions/${user.email}`
        )
        .then((response) => {
          const approved = response.data.filter(
            (session) => session.status === "success"
          );
          setApprovedSessions(approved);
        })
        .catch((error) => console.error("Error fetching sessions:", error));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.warning("Please upload an image");
      return;
    }

    try {
      // Step 1: Upload image to ImgBB
      const imgData = new FormData();
      imgData.append("image", formData.image);

      const imgResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${image_hosting_key}`,
        imgData
      );

      const imageUrl = imgResponse.data.data.display_url;

      // Step 2: Save material to the database
      const materialData = {
        title: formData.title,
        sessionId: formData.sessionId,
        tutorEmail: formData.tutorEmail,
        image: imageUrl,
        link: formData.link,
      };

      await axios.post(
        "https://learn-bridge-server-two.vercel.app/materials",
        materialData
      );

      toast.success("Material uploaded successfully!");
      setFormData({
        title: "",
        sessionId: "",
        tutorEmail: user?.email || "",
        image: null,
        link: "",
      });
    } catch (error) {
      console.error("Error uploading material:", error);
      alert("Failed to upload material");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-base-100 shadow rounded-md space-y-5">
      <h1 className="text-3xl font-bold mb-4 text-center">Upload Materials</h1>

      <div className="mb-4 ">
        <label className="block text-sm font-medium text-gray-700">
          Select a Study Session
        </label>
        <select
          value={selectedSessionId}
          onChange={(e) => {
            setSelectedSessionId(e.target.value);
            setFormData((prev) => ({
              ...prev,
              sessionId: e.target.value,
            }));
          }}
          className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">-- Select Session --</option>
          {approvedSessions.map((session) => (
            <option key={session._id} value={session._id}>
              {session.sessionData.title}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Tutor Email (Read-Only)
          </label>
          <input
            type="text"
            value={formData.tutorEmail}
            readOnly
            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm sm:text-sm bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="block w-full mt-1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Google Drive Link
          </label>
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className=" p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Upload Material
        </button>
      </form>
    </div>
  );
};

export default UploadMaterials;
