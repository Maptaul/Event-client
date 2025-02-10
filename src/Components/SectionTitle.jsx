const SectionTitle = ({ heading, subHeading }) => {
  return (
    <div className="">
      <h3 className="text-[#FF6F61] text-5xl font-bold text-center mb-5">
        {heading}
      </h3>
      <p className="text-center text-base-200 text-xl mb-10">{subHeading}</p>
    </div>
  );
};

export default SectionTitle;
