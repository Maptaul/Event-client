import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Loading from "../../../Components/Loading";
import SectionTitle from "../../../Components/SectionTitle";
import useAuth from "../../../hooks/useAuth";
import reviews from "../../../../public/ReviewsCollection.json";


const TestimonialSection = () => {
  const { loading } = useAuth();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch data from the JSON file
    fetch("/ReviewsCollection.json")
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-6 mb-10 ">
      <div className="text-center mb-12">
        <SectionTitle
          heading={"What Students Say"}
          subHeading={"Hear from our satisfied learners."}
        />
      </div>

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        modules={[Navigation, Pagination]}
        className="testimonial-swiper"
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index}>
            <div className="testimonial-card bg-base-content text-gray-400 p-6 rounded-lg shadow-lg hover:shadow-2xl items-center text-center transition duration-300">
              <h3 className="text-2xl text-white font-bold">
                {review.studentName}
              </h3>
              <p className="text-sm text-gray-200">
                Session ID: {review.sessionId}
              </p>
              <div className="rating justify-center mt-2 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="mt-4 text-gray-200">{review.review}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TestimonialSection;
