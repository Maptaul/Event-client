import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Loading from "../../../Components/Loading";
import SectionTitle from "../../../Components/SectionTitle";
import { AuthContext } from "../../../Providers/AuthProvider";

const TutorSection = () => {
  const [tutors, setTutors] = useState([]);
  const { loading } = useContext(AuthContext);

  useEffect(() => {
    // Fetch data from the JSON file
    fetch("https://learn-bridge-server-two.vercel.app/tutors")
      .then((res) => res.json())
      .then((data) => {
        setTutors(data);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 mb-10">
      <div className="text-center mb-8">
        <SectionTitle
          heading={"Meet Our Tutors"}
          subHeading={"Learn from our experienced and dedicated educators."}
        />
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {tutors.map((tutor, index) => (
          <SwiperSlide key={index}>
            <div className="tutor-card h-80 bg-base-content p-6 border rounded-lg shadow-md">
              <div className="flex flex-col items-center">
                {/* Tutor Profile Picture */}
                <div className="avatar w-[100px] h-[100px] mb-4">
                  <img
                    src={tutor.profilePicture}
                    alt={`${tutor.name}'s profile`}
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">{tutor.name}</h3>
                <p className="text-gray-200">{tutor.subject}</p>
                <p className="text-gray-200 text-sm">{tutor.email}</p>
                <p className="mt-2 text-gray-200 text-center">{tutor.bio}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="items-center justify-center text-center mt-5">
        <button className="btn btn-accent">
          <Link to="AllTutorSection">See All</Link>
        </button>
      </div>
    </div>
  );
};

export default TutorSection;
