import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../Providers/AuthProviderNew";
import { API_BASE_URL } from "../../utils/api";

const AddEvent = () => {
  const { user, getAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    creatorName: user?.displayName || user?.email || "",
    date: "",
    time: "",
    location: "",
    description: "",
    attendeeCount: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = {
        ...formData,
        creatorId: user.uid,
        creatorEmail: user.email,
        attendeeCount: parseInt(formData.attendeeCount) || 0,
        attendees: [],
      };

      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      if (data.success) {
        Swal.fire({
          title: "Success!",
          text: "Event added successfully!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/events");
      } else {
        throw new Error(data.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      Swal.fire({
        title: "Error!",
        text: `Failed to add event: ${error.message}`,
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      creatorName: user?.displayName || user?.email || "",
      date: "",
      time: "",
      location: "",
      description: "",
      attendeeCount: 0,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Add New Event</h1>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Title */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Event Title *
                  </span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Creator Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Name (Event Creator) *
                  </span>
                </label>
                <input
                  type="text"
                  name="creatorName"
                  value={formData.creatorName}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Date *</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Time *</span>
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Location *</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Event location or venue"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Attendee Count */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Attendee Count
                  </span>
                </label>
                <input
                  type="number"
                  name="attendeeCount"
                  value={formData.attendeeCount}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="input input-bordered w-full"
                />
                <label className="label">
                  <span className="label-text-alt">
                    Default: 0 (will increase when users join)
                  </span>
                </label>
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Description *
                  </span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event..."
                  className="textarea textarea-bordered h-32 w-full"
                  required
                ></textarea>
              </div>

              {/* Form Actions */}
              <div className="form-control mt-8">
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-outline btn-secondary"
                    disabled={loading}
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-primary px-8 ${
                      loading ? "loading" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Adding Event..." : "Add Event"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
