import { useQuery } from "@tanstack/react-query";

import useAxiosSecure from "./useAxiosSecure";

const useAdmin = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: admin, isPending: isAdminLoading } = useQuery({
    queryKey: [user?.email, "admin"],
    enabled: !loading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/${user.email}`);
      console.log(res.data);
      return res.data?.admin;
    },
  });
  return [admin, isAdminLoading];
};

export default useAdmin;
