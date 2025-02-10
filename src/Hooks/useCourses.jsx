import { useEffect, useState } from "react";

const useCourses = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Fetch data from the JSON file
    fetch("https://learn-bridge-server-two.vercel.app/studysessions")
      .then((res) => res.json())
      .then((data) => {
        setSessions(data);
        setLoading(false);
      });
  }, []);
  return [sessions, loading];
};
export default useCourses;
