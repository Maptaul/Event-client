import { useContext } from "react";
import { Fade, Slide } from "react-awesome-reveal";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../../Components/Loading.jsx";
import SectionTitle from "../../../Components/SectionTitle.jsx";
import useCourses from "../../../Hooks/useCourses.jsx";
import { AuthContext } from "../../../Providers/AuthProvider.jsx";

const StudySessions = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sessions] = useCourses([]);
  const currentDate = new Date();

  // Filter only approved sessions
  const approvedSessions = sessions.filter(
    (session) => session.status === "approved"
  );

  // Get session status: "Ongoing" or "Closed"
  const getSessionStatus = (registrationStartDate, registrationEndDate) => {
    const startDate = new Date(registrationStartDate);
    const endDate = new Date(registrationEndDate);

    if (currentDate >= startDate && currentDate <= endDate) {
      return "Ongoing";
    } else {
      return "Closed";
    }
  };
  if (loading) {
    return <Loading />;
  }

  const handleViewDetails = (id) => {
    if (!user) {
      navigate("/login"); // Redirect to login if not logged in
    } else {
      navigate(`/sessions/${id}`); // Redirect to session details if logged in
    }
  };

  return (
    <div className="p-6 mb-10">
      <Slide direction="down" duration={800} triggerOnce>
        <SectionTitle
          heading={"Explore Our Study Sessions"}
          subHeading={
            "Join our expertly curated sessions to enhance your skills and knowledge."
          }
        />
      </Slide>

      <div className="card grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {approvedSessions.slice(0, 6).map((session, index) => (
          <Fade key={index} duration={1000} cascade triggerOnce>
            <div className="session-card card space-y-5  bg-base-content p-4 border rounded-lg shadow-md">
              <img
                className="rounded-md h-48 w-full"
                src={session.image}
                alt={session.title}
              />
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
                  Read More
                </button>
              </div>
            </div>
          </Fade>
        ))}
      </div>
      <div className="items-center justify-center text-center mt-5">
        <button className="btn btn-accent">
          <Link to="allStudySessions">See All</Link>
        </button>
      </div>
    </div>
  );
};

export default StudySessions;
