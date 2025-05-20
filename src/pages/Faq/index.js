import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Accordion from "react-bootstrap/Accordion";
import Carousel from "react-grid-carousel";
import PageHeader from "../../components/PageHeader";
import "./FAQ.scss";
import pageBg from "../../assets/sweem.jpg";
import FaqCardItems from "./FaqCardItems";
import FaqAccordionItem from "./FaqAccordionItem";
import { faqCarouselItems, faqAccordionData } from "./faqConstant";

const Faq = (props) => {
  const { agency, agent } = props;
  const user = useSelector((state) => state.user.user);
  const [selectedCategory, setSelectedCategory] = useState(faqAccordionData[0].uinqId);

  useEffect(() => {
    const load = async () => {};
    load();
  }, []);

  return (
    <div className="card">
      <div className="reservations-container">
        <div
          style={{
            backgroundImage: `url(${pageBg})`,
            "background-size": "cover",
          }}
        >
          <PageHeader
            agent={agent}
            agency={agency}
            searchOpen={null}
            style={{ position: "absolute", marginTop: "70px" }}
          />
        </div>
      </div>
      <div className="faq-container py-2 px-2">
        <div className="faq-header mb-3 mt-3 py-4 px-4">
          <h1 className="faq-header_title">What can we help you find?</h1>
          <h4 className="faq-header_title2">
            Below you will find answers to the question we get asked the most
            about “Villa Tracker”
          </h4>
        </div>

        <div className="mt-4 px-1 py-1">
          <Carousel
            cols={5}
            rows={1}
            gap={18}
            loop
            className="faq-carousel-container"
          >
            {faqCarouselItems.map(
              ({ originalImage, hoverImage, title, description, uinqId }, index) => (
                <Carousel.Item key={index} href="title">
                  <a 
                    href={`#title${uinqId}`} 
                    style={{ textDecoration: 'none' }} 
                    onClick={() => setSelectedCategory(uinqId)}
                  >
                    <FaqCardItems
                      originalImage={originalImage}
                      hoverImage={hoverImage}
                      title={title}
                      description={description}
                    />
                  </a>
                </Carousel.Item>
              )
            )}
          </Carousel>
        </div>

        <div
          className="faq-accordion-container px-4 py-4 d-flex"
          style={{ flexDirection: "column" }}
        >
          {faqAccordionData
            .filter(({ uinqId }) => uinqId === selectedCategory)
            .map(({ icon, category, faqs, uinqId }, index) => (
              <div
                key={index}
                className="faq-accordion-container px-4 py-4 d-flex"
                id={`title${uinqId}`}
                style={{ flexDirection: "column" }}
              >
                <div className="booking-header">
                  <div className="faq-accodian-header d-flex">
                    <img src={icon} alt={category} />
                    <h2 className="faq-accodian-lable">{category}</h2>
                  </div>
                </div>
                <div className="faq-accodian-container">
                  <Accordion className="faq-accordion">
                    {faqs.map(
                      ({ eventKey, headerText, bodyContent }, faqIndex) => (
                        <>
                          <FaqAccordionItem
                            key={faqIndex}
                            eventKey={eventKey}
                            headerText={headerText}
                            bodyContent={bodyContent}
                          />
                          <hr className="mx-3" />
                        </>
                      )
                    )}
                  </Accordion>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
