// import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "./useAxiosSecure";
// import useAuth from "./useAuth";

// const useCart = () => {
//   const { user } = useAuth();
//   const axiosSecure = useAxiosSecure();

//   // Prevent query from running if user.email is not available
//   const { refetch, data: cart = [] } = useQuery({
//     queryKey: ["cart", user?.email],
//     enabled: !!user?.email, // Ensure user.email exists before running the query
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/carts?email=${user.email}`);
//       return res.data;
//     },
//   });

//   return [cart, refetch];
// };

// export default useCart;
