import React from "react";
import SectionTitle from "../../../../Components/SectionTitle";

const FrequentlyAsk = () => {
  const faqs = [
    {
      question: "How do I book a study session?",
      answer:
        "You can book a session through the 'All Study Sessions' page by selecting a session and confirming your booking.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept credit/debit cards, PayPal, and other popular payment gateways.",
    },
    {
      question: "Can I cancel or reschedule my session?",
      answer:
        "Yes, you can manage your bookings from your dashboard under 'My Sessions'.",
    },
    {
      question: "Are the study materials provided?",
      answer:
        "Yes, all registered students have access to study materials from their dashboard.",
    },
    {
      question: "How can I contact my tutor?",
      answer:
        "You can contact your tutor through the messaging feature available in your dashboard.",
    },
    {
      question: "Is there a trial session available?",
      answer:
        "Yes, new students are eligible for one free trial session with any tutor of their choice.",
    },
    {
      question: "What is the cancellation policy?",
      answer:
        "Cancellations made 24 hours prior to the session are fully refundable.",
    },
  ];

  return (
    <div className="p-8  rounded-lg shadow-md">
      <SectionTitle heading={"Frequently Asked Questions"} />
      {faqs.map((faq, index) => (
        <div key={index} className="collapse collapse-plus  mb-4">
          <input type="radio" name="faq-accordion" />
          <div className="collapse-title text-xl font-medium">
            {faq.question}
          </div>
          <div className="collapse-content">
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FrequentlyAsk;
