import { useContext, useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
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
    <div className="p-6 w-11/12 mx-auto mb-10">
      <div className="text-center mb-8">
        <SectionTitle
          heading={"Meet Our Tutors"}
          subHeading={"Learn from our experienced and dedicated educators."}
        />
      </div>

      <div className=" card grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tutors.map((tutor, index) => (
          <div
            key={index}
            className="tutor-card  bg-base-content p-6  rounded-lg shadow-md"
          >
            <div className="flex flex-col items-center">
              {/* Tutor Profile Picture */}
              <div className="avatar w-[100px] h-[100px] mb-4">
                <img
                  src={tutor.profilePicture}
                  alt={`${tutor.name}'s profile`}
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl text-white font-semibold">{tutor.name}</h3>
              <p className="text-gray-200">{tutor.subject}</p>
              <p className="text-gray-200 text-sm">{tutor.email}</p>
              <p className="mt-2 text-gray-200 text-center">{tutor.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorSection;
