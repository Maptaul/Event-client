import { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Providers/AuthProvider";

const CreateStudySession = () => {
  const { user } = useContext(AuthContext); // Access logged-in user details
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    registrationStartDate: "",
    registrationEndDate: "",
    classStartDate: "",
    classEndDate: "",
    duration: "",
    registrationFee: 120, // Default registration fee
    status: "approved", // Default status
    averageRating: 4.8, // Default average rating
    image: "", // Image URL input
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const sessionData = {
      ...formData,
      tutorName: user?.displayName || "David Wilson",
      tutorEmail: user?.email || "david@example.com",
    };

    fetch("https://learn-bridge-server-two.vercel.app/studysessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.insertedId) {
          Swal.fire(
            "Success",
            "Study session created successfully!",
            "success"
          );
          setFormData({
            title: "",
            description: "",
            registrationStartDate: "",
            registrationEndDate: "",
            classStartDate: "",
            classEndDate: "",
            duration: "",
            registrationFee: 120,
            status: "approved",
            averageRating: 4.8,
            image: "",
          });
        }
      })
      .catch((error) =>
        Swal.fire("Error", "Failed to create session", "error")
      );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Study Session</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700">Session Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        {/* Tutor Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Tutor Name</label>
          <input
            type="text"
            value={user?.displayName || "David Wilson"}
            readOnly
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>
        {/* Tutor Email */}
        <div className="mb-4">
          <label className="block text-gray-700">Tutor Email</label>
          <input
            type="email"
            value={user?.email || "david@example.com"}
            readOnly
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>
        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700">Session Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          ></textarea>
        </div>
        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">
              Registration Start Date
            </label>
            <input
              type="date"
              name="registrationStartDate"
              value={formData.registrationStartDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Registration End Date</label>
            <input
              type="date"
              name="registrationEndDate"
              value={formData.registrationEndDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">Class Start Date</label>
            <input
              type="date"
              name="classStartDate"
              value={formData.classStartDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Class End Date</label>
            <input
              type="date"
              name="classEndDate"
              value={formData.classEndDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>
        {/* Duration */}
        <div className="mb-4">
          <label className="block text-gray-700">
            Session Duration (in hours)
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        {/* Registration Fee */}
        <div className="mb-4">
          <label className="block text-gray-700">Registration Fee</label>
          <input
            type="number"
            name="registrationFee"
            value={formData.registrationFee}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        {/* Average Rating */}
        <div className="mb-4">
          <label className="block text-gray-700">Average Rating</label>
          <input
            type="number"
            step="0.1"
            name="averageRating"
            value={formData.averageRating}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        {/* Image URL */}
        <div className="mb-4">
          <label className="block text-gray-700">Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Session
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStudySession;
