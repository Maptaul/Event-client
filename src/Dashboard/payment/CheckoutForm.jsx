import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bookingData } = state || {};
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Create a payment intent
      const { data } = await axiosSecure.post("/create-payment-intent", {
        registrationFee: bookingData.sessionData.registrationFee,
      });

      const clientSecret = data.clientSecret;

      // Confirm the payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: bookingData.studentEmail,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setIsProcessing(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        // Save booking information
        const response = await axiosSecure.post("/bookSession", {
          ...bookingData,
          isPaid: true,
        });

        if (response.data.insertedId) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Payment successful! Session booked successfully.",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError(err.message || "Payment failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingData) {
    console.error("No booking data provided.");
    return <div>Error: No booking information available.</div>;
  }

  return (
    <div className="p-6 text-center bg-base-content text-white rounded-md w-10/12 mx-auto">
      <h2 className="text-2xl font-bold">Complete Your Payment</h2>
      <p className="mt-4">
        Pay ${bookingData.sessionData.registrationFee} for the session:{" "}
        <strong>{bookingData.sessionData.title}</strong>
      </p>

      <form onSubmit={handlePayment} className="mt-6 space-y-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#9e2146" },
            },
          }}
        />
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="btn py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800"
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default CheckoutForm;
