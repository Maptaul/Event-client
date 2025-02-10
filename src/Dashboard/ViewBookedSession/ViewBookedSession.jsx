import { useQuery } from "@tanstack/react-query";
import Loading from "../../Components/Loading";
import useAuth from "../../hooks/useAuth";
import SessionCard from "./SessionCard";

const ViewBookedSession = () => {
  const { user } = useAuth();
  const {
    data: bookedSessions = [],
    isLoading,
    error,
  } = useQuery(
    ["bookedSessions", user?.email],
    async () => {
      const res = await fetch(
        `https://learn-bridge-server-two.vercel.app/bookedSessions/${user?.email}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch booked sessions");
      }
      return res.json();
    },
    { enabled: !!user?.email }
  );

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!bookedSessions.length)
    return <p className="text-gray-500">You have no booked sessions yet.</p>;

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl text-center font-bold mb-10">
        Your Booked Sessions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookedSessions.map((session) => (
          <SessionCard key={session?._id} session={session} />
        ))}
      </div>
      <div></div>
    </div>
  );
};

export default ViewBookedSession;
