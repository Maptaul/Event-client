import { Helmet } from "react-helmet-async";

import Banner from "../Banner/Banner";
import ContactMe from "../ContactMe/ContactMe";
import FrequentlyAsk from "./FrequentlyAsk/FrequentlyAsk";

const Home = () => {
  return (
    <div className="min-h-screen w-11/12 mx-auto bg-[#080A1A] text-primary-content">
      <Helmet>
        <title>Event Manager || Home </title>
      </Helmet>
      <Banner />
      <ContactMe />
      <FrequentlyAsk />
    </div>
  );
};

export default Home;
