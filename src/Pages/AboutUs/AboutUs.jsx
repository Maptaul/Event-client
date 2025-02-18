import React from "react";
import SectionTitle from "../../Components/SectionTitle";

const AboutUs = () => {
  return (
    <div className=" p-8 w-11/12 mx-auto rounded-lg shadow-md">
      <SectionTitle heading={"About Us"} />
      <p className="text-white text-xl mb-10">
        Welcome to our Collaborative Study Platform, where learning meets
        convenience. Our mission is to provide a seamless and enriching
        educational experience for students, tutors, and admins alike.
      </p>
      <p className="text-white text-xl mb-10">
        Our platform offers personalized study sessions, a vast collection of
        study materials, and a community-driven approach to education. We
        believe in empowering learners through interactive and flexible learning
        options.
      </p>
      <p className="text-white text-xl mb-10">
        Whether you're a student looking for guidance, a tutor ready to share
        knowledge, or an admin managing educational resources, we are here to
        support your journey every step of the way.
      </p>
      <p className="text-white text-center text-xl mb-10">
        Join us and make learning an exciting adventure!
      </p>
    </div>
  );
};

export default AboutUs;
