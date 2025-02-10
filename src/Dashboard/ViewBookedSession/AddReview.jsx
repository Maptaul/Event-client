import { useState } from "react";

const AddReview = ({ sessionId, refetchReviews }) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const review = {
      sessionId,
      studentEmail: "student@example.com", // Replace with authenticated user's email
      rating,
      reviewText,
    };
    try {
      const res = await fetch(
        "https://learn-bridge-server-two.vercel.app/reviews",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(review),
        }
      );
      if (res.ok) {
        refetchReviews();
        setRating(5);
        setReviewText("");
      }
    } catch (error) {
      console.error("Failed to submit review", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <label className="block mb-2">
        Rating:
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="ml-2"
        >
          {[...Array(5)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </label>
      <label className="block mb-2">
        Review:
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="block w-full mt-1 p-2 border"
        />
      </label>
      <button type="submit" className="btn btn-primary mt-4">
        Submit Review
      </button>
    </form>
  );
};

export default AddReview;
