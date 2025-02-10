import React, { useEffect, useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2

const ViewAllStudySessions = () => {
  const [sessions, setSessions] = useState([]);

  const pendingSessions = sessions.filter(
    (session) => session.status === "pending"
  );
  const approvedSessions = sessions.filter(
    (session) => session.status === "approved"
  );
  const rejectedSessions = sessions.filter(
    (session) => session.status === "rejected"
  );

  useEffect(() => {
    fetch("https://learn-bridge-server-two.vercel.app/studysessions") // Update with your API endpoint
      .then((res) => res.json())
      .then((data) => setSessions(data));
  }, []);

  const handleUpdate = (id) => {
    console.log("Update session:", id);
    // Add your update logic here
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `https://learn-bridge-server-two.vercel.app/studysessions/${id}`,
          {
            method: "DELETE",
          }
        )
          .then((res) => res.json())
          .then(() => {
            setSessions(sessions.filter((session) => session._id !== id));
            Swal.fire(
              "Deleted!",
              "The study session has been deleted.",
              "success"
            );
          })
          .catch((error) => {
            Swal.fire("Error!", "Failed to delete the session.", "error");
          });
      }
    });
  };

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-purple-600">
          All Study Sessions
        </h1>
        <p className="text-lg mt-2">
          Total Study Sessions: <strong>{sessions.length}</strong>
        </p>
      </div>

      {/* Pending Study Sessions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-blue-500 mb-4">
          Pending Study Sessions: {pendingSessions.length}
        </h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th>#</th>
                <th>Session Title - Image</th>
                <th>Tutor Name</th>
                <th>Tutor Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingSessions.map((session, index) => (
                <tr key={session._id}>
                  <td>{index + 1}</td>
                  <td className="flex items-center space-x-4">
                    <img
                      src={session.image || "https://via.placeholder.com/50"}
                      alt={session.title}
                      className="w-12 h-12 rounded-full"
                    />
                    <span>{session.title}</span>
                  </td>
                  <td>{session.tutor}</td>
                  <td>{session.tutorEmail}</td>
                  <td>
                    <span className="text-blue-500 font-semibold">Pending</span>
                  </td>
                  <td className="space-y-2">
                    <button
                      onClick={() => handleUpdate(session._id)}
                      className="btn btn-primary btn-sm mr-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(session._id)}
                      className="btn btn-error btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approved Study Sessions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-green-500 mb-4">
          Approved Study Sessions: {approvedSessions.length}
        </h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th>#</th>
                <th>Session Title - Image</th>
                <th>Tutor Name</th>
                <th>Tutor Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {approvedSessions.map((session, index) => (
                <tr key={session._id}>
                  <td>{index + 1}</td>
                  <td className="flex items-center space-x-4">
                    <img
                      src={session.image || "https://via.placeholder.com/50"}
                      alt={session.title}
                      className="w-12 h-12 rounded-full"
                    />
                    <span>{session.title}</span>
                  </td>
                  <td>{session.tutor}</td>
                  <td>{session.tutorEmail}</td>
                  <td>
                    <span className="text-green-500 font-semibold">
                      Approved
                    </span>
                  </td>
                  <td className="space-y-2">
                    <button
                      onClick={() => handleDelete(session._id)}
                      className="btn btn-error btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejected Study Sessions */}
      <div>
        <h2 className="text-lg font-bold text-red-500 mb-4">
          Rejected Study Sessions: {rejectedSessions.length}
        </h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th>#</th>
                <th>Session Title - Image</th>
                <th>Tutor Name</th>
                <th>Tutor Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rejectedSessions.map((session, index) => (
                <tr key={session._id}>
                  <td>{index + 1}</td>
                  <td className="flex items-center space-x-4">
                    <img
                      src={session.image || "https://via.placeholder.com/50"}
                      alt={session.title}
                      className="w-12 h-12 rounded-full"
                    />
                    <span>{session.title}</span>
                  </td>
                  <td>{session.tutor}</td>
                  <td>{session.tutorEmail}</td>
                  <td>
                    <span className="text-red-500 font-semibold">Rejected</span>
                  </td>
                  <td>
                    <button
                      disabled
                      className="btn btn-error btn-sm opacity-50 cursor-not-allowed"
                    >
                      Already Rejected
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewAllStudySessions;
