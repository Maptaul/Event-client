import { Helmet } from "react-helmet-async";

import Banner from "../Banner/Banner";
import ContactMe from "../ContactMe/ContactMe";
import StudySessions from "../StudySessions/StudySessions";
import TestimonialSection from "../TestimonialSection/TestimonialSection";
import TutorSection from "../TutorSection/TutorSection";
import FrequentlyAsk from "./FrequentlyAsk/FrequentlyAsk";

const Home = () => {
  return (
    <div className="min-h-screen w-11/12 mx-auto bg-[#080A1A] text-primary-content">
      <Helmet>
        <title>LearnBridge || Home </title>
      </Helmet>
      <Banner />
      <StudySessions />
      <TutorSection />
      <TestimonialSection />
      <ContactMe />
      <FrequentlyAsk />
    </div>
  );
};

export default Home;
