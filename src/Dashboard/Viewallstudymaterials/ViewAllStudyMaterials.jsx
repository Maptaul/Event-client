import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import MaterialList from "./MaterialList";

const ViewAllStudyMaterials = () => {
  const { user } = useAuth();
  const [bookedSessions, setBookedSessions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    const fetchBookedSessions = async () => {
      try {
        const response = await fetch(
          `https://learn-bridge-server-two.vercel.app/bookedSessions/${user?.email}`
        );
        if (!response.ok) throw new Error("Failed to fetch booked sessions");
        const data = await response.json();
        setBookedSessions(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchBookedSessions();
  }, [user]);

  const handleSessionClick = async (sessionId) => {
    setSelectedSession(sessionId);
    setMaterials([]);

    try {
      const response = await fetch(
        `https://learn-bridge-server-two.vercel.app/materials/${sessionId}`
      );
      if (!response.ok) throw new Error("Failed to fetch materials");
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h1 className="text-center font-bold text-3xl mb-10">
        View All Study Materials
      </h1>
      <div>
        <h2 className="text-center font-bold">Booked Sessions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookedSessions.length === 0 ? (
            <p>No booked sessions available.</p>
          ) : (
            bookedSessions.map((session) => (
              <div
                key={session._id}
                className="rounded-lg shadow-lg overflow-hidden border"
              >
                <img
                  src={
                    session?.sessionData?.image ||
                    "https://via.placeholder.com/150"
                  }
                  alt={session?.title || "Session"}
                  className="w-full h-48"
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold mt-2">
                    {session?.sessionData?.title || "Untitled Session"}
                  </h2>
                  <h2 className="text-lg font-bold mt-2">
                    {session?.sessionData?.title || "Untitled Session"}
                  </h2>
                  <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => handleSessionClick(session.sessionId)}
                  >
                    View Materials
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedSession && (
        <div>
          <h2 className="text-center font-bold mt-10">
            Materials for Session: {selectedSession}
          </h2>
          <MaterialList materials={materials} />
        </div>
      )}
    </div>
  );
};

export default ViewAllStudyMaterials;
