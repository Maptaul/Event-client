import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../Providers/AuthProviderNew";

const Events = () => {
  const { user, getAuthToken } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/events");
        const data = await response.json();

        if (response.ok) {
          const sortedEvents = data.sort((a, b) => {
            const dateTimeA = new Date(`${a.date} ${a.time}`);
            const dateTimeB = new Date(`${b.date} ${b.time}`);
            return dateTimeB - dateTimeA; // Descending order
          });

          setEvents(sortedEvents);
          setFilteredEvents(sortedEvents);
        } else {
          console.error("Error fetching events:", data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search term and filter option
  useEffect(() => {
    let filtered = events;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    const today = new Date();
    const currentWeekStart = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const currentWeekEnd = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    );
    const lastWeekStart = new Date(
      today.setDate(today.getDate() - today.getDay() - 7)
    );
    const lastWeekEnd = new Date(
      today.setDate(today.getDate() - today.getDay() - 1)
    );
    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    const currentMonthEnd = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    const lastMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    switch (filterOption) {
      case "today":
        const todayStr = new Date().toISOString().split("T")[0];
        filtered = filtered.filter((event) => event.date === todayStr);
        break;
      case "currentWeek":
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= currentWeekStart && eventDate <= currentWeekEnd;
        });
        break;
      case "lastWeek":
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= lastWeekStart && eventDate <= lastWeekEnd;
        });
        break;
      case "currentMonth":
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= currentMonthStart && eventDate <= currentMonthEnd;
        });
        break;
      case "lastMonth":
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= lastMonthStart && eventDate <= lastMonthEnd;
        });
        break;
      default:
        break;
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, filterOption]);

  // Handle joining an event
  const handleJoinEvent = async (eventId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `http://localhost:5000/events/${eventId}/join`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user.uid }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Successfully joined the event!",
          timer: 2000,
          showConfirmButton: false,
        });

        // Refresh events list
        const eventsResponse = await fetch("http://localhost:5000/events");
        const eventsData = await eventsResponse.json();

        if (eventsResponse.ok) {
          const sortedEvents = eventsData.sort((a, b) => {
            const dateTimeA = new Date(`${a.date} ${a.time}`);
            const dateTimeB = new Date(`${b.date} ${b.time}`);
            return dateTimeB - dateTimeA;
          });
          setEvents(sortedEvents);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Join Failed",
          text: data.message || "Failed to join event",
        });
      }
    } catch (error) {
      console.error("Error joining event:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to join event. Please try again.",
      });
    }
  };

  // Check if user has already joined an event
  const hasJoinedEvent = (event) => {
    return event.attendees && event.attendees.includes(user.uid);
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
      <h1 className="text-4xl font-bold text-center mb-8">All Events</h1>

      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search events by title..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter */}
        <div className="lg:w-64">
          <select
            className="select select-bordered w-full"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="all">All Events</option>
            <option value="today">Today</option>
            <option value="currentWeek">Current Week</option>
            <option value="lastWeek">Last Week</option>
            <option value="currentMonth">Current Month</option>
            <option value="lastMonth">Last Month</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600">
            No events found
          </h2>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
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

                <div className="card-actions justify-end mt-4">
                  {hasJoinedEvent(event) ? (
                    <button className="btn btn-success btn-disabled">
                      Already Joined
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleJoinEvent(event._id)}
                    >
                      Join Event
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
