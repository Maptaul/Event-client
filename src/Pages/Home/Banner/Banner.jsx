import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import image6 from "../../../assets/Banner/1 (1).jpg";
import image7 from "../../../assets/Banner/baruch.jpeg";
import image2 from "../../../assets/Banner/education.jpg";
import image3 from "../../../assets/Banner/john.jpg";
import image4 from "../../../assets/Banner/malcom.jpeg";
import image5 from "../../../assets/Banner/nelson.jpeg";
import image1 from "../../../assets/Banner/teach.jpg";

const Banner = () => {
  return (
    <div className="w-full rounded-md mb-10 ">
      <Carousel
        className=""
        showThumbs={false}
        showStatus={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={5000}
      >
        <div className="h-[600px] rounded-md">
          <img
            src={image1}
            alt="Slide 1"
            className="rounded-md w-full h-full"
          />
        </div>
        <div className="h-[500px] rounded-md">
          <img
            src={image2}
            alt="Slide 1"
            className="rounded-md w-full h-full"
          />
        </div>
        <div className="h-[500px] rounded-md">
          <img
            src={image3}
            alt="Slide 1"
            className="rounded-md w-full h-full"
          />
        </div>
        <div className="h-[500px] rounded-md">
          <img
            src={image4}
            alt="Slide 1"
            className="rounded-md w-full h-full"
          />
        </div>
        <div className="h-[500px] rounded-md">
          <img
            src={image5}
            alt="Slide 1"
            className="rounded-md w-full h-full"
          />
        </div>
        <div className="h-[500px] rounded-md">
          <img
            src={image6}
            alt="Slide 1"
            className="rounded-md w-full h-full"
          />
        </div>
        <div className="h-[500px] rounded-md">
          <img
            src={image7}
            alt="Slide 1"
            className="rounded-md w-full h-full"
          />
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;
