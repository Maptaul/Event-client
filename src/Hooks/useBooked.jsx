import { useEffect, useState } from "react";

const useBooked = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://learn-bridge-server-two.vercel.app/bookSession")
      .then((res) => res.json())
      .then((data) => {
        setSessions(data);
        setLoading(false);
      });
  }, []);

  return [sessions, loading];
};

export default useBooked;
