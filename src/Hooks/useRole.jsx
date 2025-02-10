import { useEffect, useState } from "react";

const useRole = (email) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If email is not provided, reset states and exit
    if (!email) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        const response = await fetch(
          `https://learn-bridge-server-two.vercel.app/users/email?email=${email}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch user role: ${response.statusText}`);
        }

        const data = await response.json();
        if (data && data.role) {
          setRole(data.role); // Set role if available
        } else {
          setRole(null); // No role found
        }
      } catch (error) {
        console.error("Error fetching role:", error);
        setRole(null);
      } finally {
        setLoading(false); // Always stop loading
      }
    };

    fetchUserRole();
  }, [email]);

  return { role, loading };
};

export default useRole;
