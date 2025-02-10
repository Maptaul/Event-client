import { useContext, useState } from "react";
import { Fade, Slide } from "react-awesome-reveal";
import { Helmet } from "react-helmet-async";

import { useNavigate } from "react-router-dom";
import Loading from "../../../Components/Loading.jsx";
import SectionTitle from "../../../Components/SectionTitle.jsx";
import useCourses from "../../../Hooks/useCourses.jsx";
import { AuthContext } from "../../../Providers/AuthProvider.jsx";

const AllStudySessions = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("card");

  const [sessions] = useCourses([]);

  // Get the current date to determine if the session is ongoing or closed
  const currentDate = new Date();

  const getSessionStatus = (registrationStartDate, registrationEndDate) => {
    const startDate = new Date(registrationStartDate);
    const endDate = new Date(registrationEndDate);

    if (currentDate >= startDate && currentDate <= endDate) {
      return "Ongoing";
    } else {
      return "Closed";
    }
  };

  const handleViewDetails = (id) => {
    if (!user) {
      navigate("/login"); // Redirect to login if not logged in
    } else {
      navigate(`/sessions/${id}`); // Redirect to session details if logged in
    }
  };

  // Filtered sessions based on search and filter
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description.toLowerCase().includes(searchQuery.toLowerCase());
    const status = getSessionStatus(
      session.registrationStartDate,
      session.registrationEndDate
    );

    const matchesFilter =
      filter === "all" ||
      (filter === "ongoing" && status === "Ongoing") ||
      (filter === "closed" && status === "Closed");

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 mb-10 w-11/12 mx-auto">
      <Helmet>
        <title>LearnBridge || Courses </title>
      </Helmet>
      {/* Slide animation for the section title */}
      <Slide direction="down" duration={800} triggerOnce>
        <SectionTitle
          heading={"Explore Our Study Sessions"}
          subHeading={
            "Join our expertly curated sessions to enhance your skills and knowledge."
          }
        />
      </Slide>

      {/* Controls: Search, Filter, and View Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search sessions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered w-full md:w-1/3"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="select select-bordered w-full md:w-1/4"
        >
          <option value="all">All</option>
          <option value="ongoing">Ongoing</option>
          <option value="closed">Closed</option>
        </select>
        <div className="flex gap-2">
          <button
            className={`btn ${view === "card" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setView("card")}
          >
            Card View
          </button>
          <button
            className={`btn ${view === "list" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setView("list")}
          >
            List View
          </button>
        </div>
      </div>

      {/* Display Sessions */}
      <div
        className={`grid ${
          view === "card"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        } gap-4`}
      >
        {filteredSessions.map((session, index) => (
          <Fade key={index} duration={1000} cascade triggerOnce>
            <div
              className={`session-card ${
                view === "card" ? "h-96" : "h-auto"
              } w-full bg-base-content text-white p-4 border rounded-lg shadow-md`}
            >
              {view === "card" && (
                <img
                  className="rounded-md h-48 w-full mb-4"
                  src={session.image}
                  alt={session.title}
                />
              )}
              <h3 className="text-xl font-bold">{session.title}</h3>
              <p>{session.description}</p>
              <div className="flex justify-between items-center mt-4">
                <button
                  className={`status-btn ${
                    getSessionStatus(
                      session.registrationStartDate,
                      session.registrationEndDate
                    ) === "Ongoing"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  } text-white p-2 rounded`}
                >
                  {getSessionStatus(
                    session.registrationStartDate,
                    session.registrationEndDate
                  )}
                </button>
                <button
                  onClick={() => handleViewDetails(session._id)}
                  className="btn btn-sm btn-primary"
                >
                  Read more
                </button>
              </div>
            </div>
          </Fade>
        ))}
      </div>
    </div>
  );
};

export default AllStudySessions;
