import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../Providers/AuthProviderNew";

const MyEvents = () => {
  const { user, getAuthToken } = useContext(AuthContext);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    creatorName: "",
    date: "",
    time: "",
    location: "",
    description: "",
    attendeeCount: 0,
  });

  // Fetch user's events
  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/events/creator/${user.email}`
        );
        const data = await response.json();

        if (response.ok) {
          // Sort by creation date (most recent first)
          const sortedEvents = data.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });

          setMyEvents(sortedEvents);
        } else {
          console.error("Error fetching user events:", data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user events:", error);
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchMyEvents();
    }
  }, [user]);

  // Handle input changes for the update form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Open update modal
  const handleUpdate = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      creatorName: event.creatorName,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      attendeeCount: event.attendeeCount,
    });
    setShowModal(true);
  };

  // Handle update form submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAuthToken();
      const response = await fetch(
        `http://localhost:5000/events/${editingEvent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            attendeeCount: parseInt(formData.attendeeCount) || 0,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Refresh events list
        const eventsResponse = await fetch(
          `http://localhost:5000/events/creator/${user.email}`
        );
        const eventsData = await eventsResponse.json();

        if (eventsResponse.ok) {
          const sortedEvents = eventsData.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setMyEvents(sortedEvents);
        }

        setShowModal(false);
        setEditingEvent(null);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Event updated successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: data.message || "Failed to update event",
        });
      }
    } catch (error) {
      console.error("Error updating event:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update event. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete with confirmation
  const handleDelete = async (eventId, eventTitle) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete the event "${eventTitle}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Refresh events list
        const eventsResponse = await fetch(
          `http://localhost:5000/events/creator/${user.email}`
        );
        const eventsData = await eventsResponse.json();

        if (eventsResponse.ok) {
          const sortedEvents = eventsData.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setMyEvents(sortedEvents);
        }

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Event deleted successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: data.message || "Failed to delete event",
        });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete event. Please try again.",
      });
    }
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setFormData({
      title: "",
      creatorName: "",
      date: "",
      time: "",
      location: "",
      description: "",
      attendeeCount: 0,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">My Events</h1>

      {myEvents.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600">
            No events found
          </h2>
          <p className="text-gray-500 mt-2">
            You haven't created any events yet.
          </p>
          <button
            onClick={() => (window.location.href = "/add-event")}
            className="btn btn-primary mt-4"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myEvents.map((event) => (
            <div key={event._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl font-bold">{event.title}</h2>

                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Posted by:</span>{" "}
                    {event.creatorName}
                  </p>

                  <p className="text-sm">
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(event.date).toLocaleDateString()}
                  </p>

                  <p className="text-sm">
                    <span className="font-semibold">Time:</span> {event.time}
                  </p>

                  <p className="text-sm">
                    <span className="font-semibold">Location:</span>{" "}
                    {event.location}
                  </p>

                  <p className="text-sm">
                    <span className="font-semibold">Attendees:</span>{" "}
                    {event.attendeeCount || 0}
                  </p>
                </div>

                <p className="text-gray-700 mt-3">{event.description}</p>

                <div className="card-actions justify-end mt-4 space-x-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleUpdate(event)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleDelete(event._id, event.title)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Update Event</h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
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
                  min="0"
                  className="input input-bordered w-full"
                />
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
                  className="textarea textarea-bordered h-32 w-full"
                  required
                ></textarea>
              </div>

              {/* Modal Actions */}
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
