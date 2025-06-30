import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../Components/Loading";
import { AuthContext } from "../../../Providers/AuthProviderNew";

const StudySessionDetails = () => {
  const { id } = useParams();
  const { user, loading, getAuthToken } = useContext(AuthContext);
  const [session, setSession] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const sessionResponse = await fetch(
          `https://learn-bridge-server-284wokn26.vercel.app/sessions/${id}`
        );
        const sessionData = await sessionResponse.json();
        console.log("Session Response:", sessionData);
        setSession(sessionData);

        const reviewsResponse = await fetch(
          `https://learn-bridge-server-284wokn26.vercel.app/reviews?sessionId=${id}`
        );
        const reviewsData = await reviewsResponse.json();
        console.log("Reviews Response:", reviewsData);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching session details:", error);
      }
    };

    fetchSessionDetails();
  }, [id]);

  const getSessionStatus = (registrationStartDate, registrationEndDate) => {
    const currentDate = new Date();
    const startDate = new Date(registrationStartDate);
    const endDate = new Date(registrationEndDate);
    return currentDate >= startDate && currentDate <= endDate
      ? "Ongoing"
      : "Closed";
  };

  const handleBookNow = async (session) => {
    if (!session) return;

    const sessionStatus = getSessionStatus(
      session.registrationStartDate,
      session.registrationEndDate
    );

    if (sessionStatus === "Closed") return;

    if (!user) {
      navigate("/login");
      return;
    }

    const bookingData = {
      sessionId: session._id,
      studentEmail: user.email,
      tutorName: session.tutor,
      tutorEmail: session.tutorEmail,
      sessionData: {
        title: session.title,
        description: session.description,
        registrationFee: session.registrationFee,
        image: session.image,
      },
    };

    try {
      if (session.registrationFee > 0) {
        navigate("/payment", { state: { bookingData } });
      } else {
        const response = await axiosSecure.post("/bookSession", bookingData);
        if (response.data.insertedId) {
          alert("Session booked successfully!");
        }
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert(error.response?.data?.message || "Failed to book session.");
    }
  };

  if (!session) return <Loading />;
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 w-11/12 mx-auto rounded-lg shadow-xl text-white text-center ">
      <div className="flex flex-col items-center bg-base-content  p-6 rounded-lg shadow-lg">
        <img
          className="w-60 h-60 rounded-lg mb-6"
          src={session.image || "/placeholder.jpg"}
          alt={session.title}
        />
        <h2 className="text-3xl font-bold text-center">{session.title}</h2>
        <p className="text-lg text-center mt-2">{session.description}</p>

        <div className="mt-6 text-lg space-y-4">
          <p>
            <strong className="font-semibold">Tutor:</strong> {session.tutor}
          </p>
          <p>
            <strong className="font-semibold">Rating:</strong>{" "}
            {session.averageRating}
          </p>
        </div>

        <div className="mt-6 space-y-4 text-lg">
          <div>
            <strong className="font-semibold">Registration Start Date:</strong>{" "}
            {session.registrationStartDate}
          </div>
          <div>
            <strong className="font-semibold">Registration End Date:</strong>{" "}
            {session.registrationEndDate}
          </div>
          <div>
            <strong className="font-semibold">Class Start Time:</strong>{" "}
            {session.classStartDate}
          </div>
          <div>
            <strong className="font-semibold">Class End Date:</strong>{" "}
            {session.classEndDate}
          </div>
          <div>
            <strong className="font-semibold">Session Duration:</strong>{" "}
            {session.duration}
          </div>
          <div>
            <strong className="font-semibold">Registration Fee:</strong> $
            {session.registrationFee || "Free"}
          </div>
        </div>

        <div className="mt-8 w-full">
          <h3 className="text-2xl font-semibold ">Reviews</h3>
          <div className="mt-4 items-center justify-center flex gap-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-gray-100 p-2 rounded-lg shadow-md"
              >
                <p className="text-lg">{review.comment}</p>
                <p className="mt-2 text-sm text-gray-600">
                  <strong>Rating:</strong> {review.rating}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleBookNow(session)}
          className={`mt-6 w-4/12 py-2 rounded-lg text-white font-bold text-lg ${
            getSessionStatus(
              session.registrationStartDate,
              session.registrationEndDate
            ) === "Closed"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-800"
          }`}
          disabled={
            getSessionStatus(
              session.registrationStartDate,
              session.registrationEndDate
            ) === "Closed" ||
            user?.role === "admin" ||
            user?.role === "tutor"
          }
        >
          {getSessionStatus(
            session.registrationStartDate,
            session.registrationEndDate
          ) === "Closed"
            ? "Registration Closed"
            : "Book Now"}
        </button>
      </div>
    </div>
  );
};

export default StudySessionDetails;
