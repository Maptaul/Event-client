import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Providers/AuthProvider";

const ViewAllStudySessions = () => {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (user?.email) {
      fetch(
        `https://learn-bridge-server-two.vercel.app/studysessions/tutor/${user.email}`
      )
        .then((res) => res.json())
        .then((data) => setSessions(data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  const handleResubmit = (id) => {
    fetch(
      `https://learn-bridge-server-two.vercel.app/studysessions/resubmit/${id}`,
      {
        method: "PUT",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          Swal.fire("Success", "Approval request resubmitted!", "success");
          // Refresh sessions
          setSessions((prev) =>
            prev.map((session) =>
              session._id === id ? { ...session, status: "pending" } : session
            )
          );
        }
      })
      .catch((error) =>
        Swal.fire("Error", "Failed to resubmit approval request", "error")
      );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
        My Study Sessions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions.map((session) => (
          <div
            key={session._id}
            className="rounded-lg border shadow-lg bg-white overflow-hidden"
          >
            <img
              src={session.image || "https://via.placeholder.com/400x200"}
              alt={session.title}
              className="w-full h-44 "
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {session.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {session.description}
              </p>
              <div className="text-sm space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">
                    Registration Start Time:
                  </span>{" "}
                  {session.registrationStartDate}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Registration End Time:</span>{" "}
                  {session.registrationEndDate}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Class Start Time:</span>{" "}
                  {session.classStartDate}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Class End Time:</span>{" "}
                  {session.classEndDate}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Session Duration:</span>{" "}
                  {session.duration}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Fee:</span> $
                  {session.registrationFee}
                </p>
                <p
                  className={`font-semibold text-sm rounded px-2 py-1 inline-block ${
                    session.status === "success"
                      ? "bg-green-100 text-green-600"
                      : session.status === "rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  Status: {session.status}
                </p>
              </div>
              {session.status === "rejected" && (
                <button
                  onClick={() => handleResubmit(session._id)}
                  className="mt-4 w-full py-2 text-center text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Resubmit for Approval
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAllStudySessions;
