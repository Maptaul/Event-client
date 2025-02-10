import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Loading from "../../Components/Loading";

const SessionDetails = () => {
  const { id } = useParams();

  const {
    data: session,
    isLoading,
    error,
  } = useQuery(["sessionDetails", id], async () => {
    const res = await fetch(
      `https://learn-bridge-server-two.vercel.app/sessions/${id}`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch session details");
    }
    return res.json();
  });

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold">{session?.tutorName}</h2>
      <p className="text-lg">{session?.description}</p>
      <p className="text-lg">Date: {session?.date}</p>
      <p className="text-lg">Time: {session?.time}</p>
    </div>
  );
};

export default SessionDetails;
