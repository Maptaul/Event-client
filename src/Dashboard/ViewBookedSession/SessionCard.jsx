import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const SessionCard = ({ session }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleReadMore = () => {
    if (user?.email) {
      navigate(`/dashboard/sessionDetails/${session._id}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="rounded-lg shadow-lg overflow-hidden border">
      <img
        src={session?.sessionData.image || "https://via.placeholder.com/150"}
        alt={session?.title || "Session"}
        className="w-full  h-48"
      />
      <div className="p-4">
        <p className="text-sm text-blue-500">
          {session?.tutorName || "Unknown Tutor"}
        </p>
        <h2 className="text-lg font-bold mt-2">
          {session?.sessionData.title || "Untitled Session"}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {session.description && session.description.length > 100
            ? `${session.description.slice(0, 100)}...`
            : session.sessionData.description || "No description available"}
        </p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-semibold text-gray-700">
            ${session.sessionData.registrationFee || "0"}
          </p>
          <button onClick={handleReadMore} className="btn btn-primary btn-sm">
            Read More <span className="ml-1">➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
