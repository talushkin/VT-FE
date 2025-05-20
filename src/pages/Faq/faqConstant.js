import svgIcons from "./assets/index";

export const faqCarouselItems = [
  {
    originalImage: svgIcons.gettingStarted,
    hoverImage: svgIcons.gettingStartedHover,
    title: "Getting Started",
    description: "How to navigate site basics & find the perfect stay",
    uinqId: "GettingStarted"
  },
  {
    originalImage: svgIcons.trust,
    hoverImage: svgIcons.trustHover,
    title: "Trust & Safety",
    description: "Learn more about our commitment to trust & safety",
    uinqId: "Trust&Safety"
  },
  {
    originalImage: svgIcons.booking,
    hoverImage: svgIcons.bookingHover,
    title: "Booking and Payments",
    description: "Learn more about booking and payment processes",
    uinqId: "BookingAndPayments"
  },
  {
    originalImage: svgIcons.reservation,
    hoverImage: svgIcons.reservationHover,
    title: "Reservation Support",
    description:
      "What you need to know for seamless arrivals, special requests & more",
    uinqId: "ReservationSupport"
  },
  {
    originalImage: svgIcons.advanced,
    hoverImage: svgIcons.advancedHover,
    title: "Advanced Tools",
    description: "How to save properties, create shareable lists & more",
    uinqId: "AdvancedTools"
  },
  {
    originalImage: svgIcons.pricing,
    hoverImage: svgIcons.pricingHover,
    title: "Understanding Pricing & Agency Offerings",
    description: "Learn about pricing and offerings for agencies",
    uinqId: "PricingAndOfferings"
  },
];

export const faqAccordionData = [
  {
    uinqId: "GettingStarted",
    icon: svgIcons.gettingStarted,
    category: "Getting Started",
    faqs: [
      {
        eventKey: "0",
        headerText: "How do I create an account on the Villa Tracker site?",
        bodyContent: `Creating an account on Villa Tracker is a straightforward process! Follow these steps to get started:\n
1. Visit the Signup Page: Click on this link to access the registration page: Villa Tracker Signup.\n
2. Fill out the Required Information: On the signup page, you will see a form asking for some necessary details. Make sure to fill in all required fields accurately.\n
3. Review Your Information: Take a moment to review all the information you’ve entered.\n
4. Agree to the Terms and Conditions: Before you complete your registration, you must agree to the Terms and Conditions of Villa Tracker. Look for the checkbox that states you accept the terms, and make sure to tick it.\n
5. Complete the Registration: Once you have filled out all the necessary information and agreed to the terms, hit the “SIGN UP” button at the end of the form. Click on it to submit your registration.\n
6. Check Your Email: After you have signed up, you will receive a confirmation email. We will contact you by email once our review is complete, so please keep an eye on your inbox.\n
That’s it! You should now have your account created on the Villa Tracker site and be ready to start exploring.`,
      },
      {
        eventKey: "1",
        headerText: "What information is required to set up my profile?",
        bodyContent: `To set up your profile, please navigate to your Profile section, where you can enter the following information:\n
- Agent Details: Fill in your personal information as an agent: Agent Name, Agent Phone/Mobile, Agent Email.\n
- Agency Details: Provide details about your agency such as Agency Name, Manager First Name, Manager Last Name, Agency Email, Agency Phone, Agency Address, Agency Postal Code, and Agency Bank Details.\n
You can also upload your agency logo, add a personal email format for your clients, and change your password if necessary. Be sure to complete all required fields to successfully set up your profile!`,
      },
      {
        eventKey: "2",
        headerText: "Do I need to sign an Agreement?",
        bodyContent: `No, you do not need to sign a dedicated Agreement with us. Instead, before completing your registration with Villa Tracker, you are required to acknowledge and agree to our Terms and Conditions. This step is crucial as it ensures that you understand and accept the guidelines and requirements that govern your use of our services.\n
To make this process smooth, simply look for the checkbox that states "I accept the Terms and Conditions." It is essential to tick this box to confirm your agreement. By doing so, you will be agreeing to abide by our policies and will be able to proceed with your registration without any issues.`,
      },
      {
        eventKey: "3",
        headerText: "How can I search for villas?",
        bodyContent: `To search for villas, simply visit the Search section at Villa Tracker Search. There, you can easily select the country of your destination, input your desired check-in and check-out dates, and specify the number of guests. Once you’ve filled in the necessary information, just hit the "Search" button to find the perfect villa for your client’s stay!`,
      },
      {
        eventKey: "4",
        headerText: "What are the basic features of the Villa Tracker site?",
        bodyContent: `The Villa Tracker Site offers a comprehensive range of features designed to enhance your user experience. Once you log in, you’ll be welcomed by your personalised dashboard, where you can take advantage of the following features:\n
1. User Management: Easily log in to your account and personalise your experience by editing your profile.\n
2. Advanced Search Filters: Utilise advanced filters to sort through collections based on family needs, pets, events, and sustainability to find the perfect property.\n
3. Property Selection: Choose up to 5 properties to send directly to your clients or add them to your favourites for future reference.\n
4. Send Offers: Effortlessly email selected properties as brochures (PDFs or links) that incorporate your agency logo for a professional touch.\n
5. Booking Options: Simplify the booking process with payment options via Visa, credit card, or bank transfer.\n
6. Reservation Log: Access your clients’ reservation panel to track all bookings in one convenient location.\n
7. Wishlist: Allow us to assist you in finding the best offers tailored to your needs.\n
8. Favourites: Keep track of properties you love by adding them to your favourites list for easy access.\n
9. Hot Destinations: Stay informed about trending destinations that clients may be interested in.\n
10. FAQ Section: Quickly find answers to common questions to help you navigate the platform.\n
11. Interactive Map: Explore properties visually using our interactive map feature.\n
12. Explore Resources: Access valuable resources and guides within the platform. We recommend checking out our user manual for a deeper understanding of all the capabilities available to you.\n
With these features, Villa Tracker aims to provide you with a seamless and efficient experience in managing your property listings and client interactions.`,
      },
      {
        eventKey: "5",
        headerText: "Can I go back to a previous offer sent to my client?",
        bodyContent: `Absolutely! You can easily track down any previous offers sent to your client once you signed in to your Villa Tracker account. This feature not only allows you to review the details of the past offer but also provides the opportunity to resend it with any necessary updates, including revised availability and pricing. This ensures that your client has the most current information at their fingertips, enhancing their overall experience and facilitating smoother communication between you and your client.`,
      },
    ],
  },
  {
    uinqId: "Trust&Safety",
    icon: svgIcons.trust,
    category: "Trust and Safety",
    faqs: [
      {
        eventKey: "0",
        headerText: "How does the Villa Tracker site ensure the safety and security of its users?",
        bodyContent: `The Villa Tracker site ensures user safety and security through regular website backups, strong password requirements, CAPTCHA and spam filters, firewalls, timely system updates, two-step authentication, and HTTPS with SSL encryption.`,
      },
      {
        eventKey: "1",
        headerText: "What measures are in place to verify the legitimacy of villa listings?",
        bodyContent: `We take the legitimacy of our villa listings very seriously. To ensure you have the best experience possible, we work closely with top property management companies around the globe, conducting thorough due diligence on each listing. Rest assured, every villa we offer is 100% legitimate.\n
Additionally, we can provide accreditation for each villa, as we are proud to be i-Prac approved. You can view our accreditation and learn more about our commitment to excellence here. Your trust is our priority, and we are dedicated to providing you with verified and quality listings.`,
      },
      {
        eventKey: "2",
        headerText: "How is my personal information protected on the site?",
        bodyContent: `Your personal information is protected through a combination of strong security measures. We recommend creating strong, unique passwords and using a password manager. Be cautious with oversharing on social media and using public Wi-Fi. Always check for a secure site (look for the lock symbol and "https" in the URL) before entering personal details. Additionally, installing anti-virus and anti-spyware software can enhance your security.`,
      },
    ],
  },
  {
    uinqId: "PricingAndOfferings",
    icon: svgIcons.pricing,
    category: "Understanding Pricing & Agency Offerings",
    faqs: [
      {
        eventKey: "0",
        headerText: "How does the Villa Tracker pricing work?",
        bodyContent: `There are two distinctive prices on our platform:\n
- Client Price: This is the price that the end client will pay.\n
- Travel Agency Price: This is set at 10% less than the client price. This discount is effectively the commission for the travel agency.`,
      },
      {
        eventKey: "1",
        headerText: "What do you need to know about the sales process?",
        bodyContent: `Here are a few things that you need to know when it comes to offering the Villa Tracker properties to your clients:\n
- Agencies are empowered to offer Villa Tracker properties without the need to upsell or create additional marketing materials, such as PDF offers.\n
- Agencies can select multiple property options to present to their clients simultaneously. These options can be sent directly to the clients as they are listed in Villa Tracker.\n
Rate Exposure:\n
- Agencies have the discretion to expose the travel agency pricing or client pricing based on their sales strategy. Exposing the rates may assist in upselling properties.`,
      },
    ],
  },
  {
    uinqId: "ReservationSupport",
    icon: svgIcons.support,
    category: "Reservation and Support",
    faqs: [
      {
        eventKey: "0",
        headerText: "Who do I contact if I have a question about a property?",
        bodyContent: `Our in-house team is the best place to start if you have a question about a property while you are considering options for an upcoming trip. Whether you would like to know more about the property layout or location, available amenities, nearby landmarks, and stores, or possible add-ons (e.g. a private chef, grocery pre-fills, pool heating) - we are here to help!`,
      },
      {
        eventKey: "1",
        headerText: "Who do I contact if I have a question about a reservation?",
        bodyContent: `Our in-house team is the best place to start if you have a question about a property while you are considering options for an upcoming trip. Whether you would like to know more about the property layout or location, available amenities, nearby landmarks, and stores, or possible add-ons (e.g. a private chef, grocery pre-fills, pool heating) - we are here to help!`,
      },
      {
        eventKey: "2",
        headerText: "What should I do if I encounter an issue during my client’s stay?",
        bodyContent: `At Villa Tracker, our top priority is to ensure that every aspect of your client's travel experience exceeds their expectations.\n
To accomplish this, we provide a comprehensive range of information prior to your client’s arrival. This includes detailed contact information for a dedicated on-site representative who will be available throughout their stay. This representative serves as a direct line of communication, ready to address any inquiries or needs that may arise — from check-in details to recommendations for local attractions.\n
Moreover, your clients will have the peace of mind knowing they can reach out to our Villa Tracker support team at any time. We are committed to being accessible and responsive, ensuring that both you and your client have the support needed to enjoy a seamless and memorable vacation.\n
Whether it's resolving a last-minute issue or answering a simple question, the Villa Tracker team is here to assist you every step of the way. We pride ourselves on providing not just a place to stay, but a complete travel experience tailored to your client's desires.\n
Thank you for choosing Villa Tracker - we look forward to making this journey exceptional for you and your clients!`,
      },
      {
        eventKey: "3",
        headerText: "How can I contact customer support for booking issues?",
        bodyContent: `If your clients encounter any issues during their stay, our Villa Tracker support team will be happy to assist you at any time. We are committed to being accessible and responsive, ensuring that both you and your client have the support needed to enjoy a seamless and memorable vacation.`,
      },
      {
        eventKey: "4",
        headerText: "What should I do if I need to change my reservation dates?",
        bodyContent: `If you need to change your reservation dates, you can reach out to our Villa Tracker support team at any time. We are committed to being accessible and responsive, ensuring that both you and your client have the support needed to enjoy a seamless and memorable vacation. Our team is here to assist you with any changes you may need to make.`,
      },
      {
        eventKey: "5",
        headerText: "Can I extend my stay after I have checked in?",
        bodyContent: `Yes, your clients can extend their stay after checking in, provided that the villa is vacant over the period they wish to extend. For that, we recommend that you check the availability directly on our platform and manage your clients’ booking conveniently.\n
If you prefer assistance or if you have specific dates in mind, feel free to contact our support team. They are here to help you check for availability and facilitate your request.`,
      },
    ],
  },
  {
    uinqId: "BookingAndPayments",
    icon: svgIcons.payment,
    category: "Booking and Payments",
    faqs: [
      {
        eventKey: "0",
        headerText: "How do I book a villa through the site?",
        bodyContent: `Booking a villa through our site is a seamless process designed to make your experience as a travel professional simple and efficient. Here’s a step-by-step guide to help you navigate the booking process:\n
1. Select Properties: Begin by exploring our extensive selection of villas available on the site. You can filter and sort properties based on your client's preferences, such as location, amenities, and budget.\n
2. Collaborate with Your Client: After presenting your clients with a curated selection of properties, engage in a discussion to understand their preferences and requirements better. Together, you’ll choose the ideal villa that meets their needs and expectations.\n
3. Final Decision: Once your clients have made their choice, it’s time to proceed with the booking. You will handle this part internally by sorting out all the booking and payment details directly with your client. This ensures clear communication and a smooth transaction process.\n
4. Booking on Villa Tracker: With the property finalised, go ahead and complete the booking on Villa Tracker. An important detail to note is that while booking, you will only be charged 90% of the original price of the villa. This is because the 10% commission due to you has already been accounted for in this pricing structure. This approach allows you to efficiently manage your earnings while providing excellent service to your clients.\n
By following these steps, you can effortlessly book villas for your clients while ensuring that you are compensated fairly for your efforts. If you have any further questions or need assistance during the booking process, feel free to reach out!`,
      },
      {
        eventKey: "1",
        headerText: "What payment methods are accepted?",
        bodyContent: `We accept a variety of payment methods to make your experience as convenient as possible. You can pay using Visa, major credit cards, or through bank transfer. If you have any specific questions about a payment method or need assistance, feel free to reach out to our customer support team!`,
      },
      {
        eventKey: "2",
        headerText: "What are the booking Terms & Conditions? Is there a deposit required for booking?",
        bodyContent: `Yes, Villa Tracker requires a down payment of 50% of the total rental amount at the time of the booking if the booking is made 60 days or more prior to date of arrival at Property. The remaining 50% is due two months before the start of the rental period.\n
if the booking is made less than 60 days prior to date of arrival, the full amount will be charged at the time of booking.`,
      },
      {
        eventKey: "3",
        headerText: "How are cancellations and refunds handled?",
        bodyContent: `Our cancellation policy specifies that all paid amounts are non-refundable.\n
The cancellation terms for each property are tailored specifically to that property and can vary widely. To ensure you have the most accurate and relevant information, detailed cancellation policies will be clearly outlined during the booking process. If you have any questions or need further clarification regarding the cancellation policies for a specific property, please do not hesitate to reach out to our support team for assistance.`,
      },
      {
        eventKey: "4",
        headerText: "Are there any additional fees associated with booking a villa?",
        bodyContent: `Yes, our properties may encompass a range of additional charges for amenities and services, which can vary depending on the property's offerings and location. Common examples of these extra charges include:\n
- Resort Fees: These typically cover essential property maintenance and access to various amenities.\n
- Parking Fees: Applicable for guests who require parking during their stay.\n
- Pool Heating Fees: If you wish to heat the pool, there may be an additional charge.\n
- Cleaning Fees: These may apply for additional cleaning services beyond the standard provided.\n
- Pet Fees: If you’re travelling with pets, there may be associated fees.\n
- Utilities: Charges for heating, electricity, and other utilities may apply, depending on usage.\n
- Extra Linen Changes: For guests who prefer additional linen services, fees may be incurred.\n
- Staff Services: Optional services including meals prepared by a chef, or assistance from a butler or housekeeper may come with additional costs.\n
- Babysitting Services: Available for families, this service may also have an associated charge.\n
- Spa Services: Enjoy massages or hairdressing services for an extra fee.\n
- Pre-arrival Shopping Service: We can stock your property with favourites before your arrival, at an additional charge.\n
- Transfers: Charges may apply for helicopter, boat, or car transfers to and from the property.\n
- Event Planning: Fees for party planning, corporate event planning, or wedding planning services can also be expected.\n
We recommend checking with the property directly for a detailed list of all potential fees and charges to ensure you can plan your stay accordingly.`,
      },
      {
        eventKey: "5",
        headerText: "What is the commission for the Travel Agency on each reservation made through our platform?",
        bodyContent: `Travel agencies will receive a 10% commission on all bookings made through Villa Tracker. This creates a financial incentive for agencies to promote and sell Villa Tracker properties.`,
      },
      {
        eventKey: "6",
        headerText: "What is the payment procedure from the Travel Agent’s perspective?",
        bodyContent: `Payment from Client:\n
- Agencies are responsible for charging the clients based on their terms and conditions, which should be communicated to the client.\n
- All bookings require payment in advance.\n
Payment to Villa Tracker:\n
- Agencies must pay Villa Tracker 90% of the booking amount.\n
- Payment can be made through the agency’s credit card or a wire transfer.\n
- Alternatively, agencies may choose to use the client's credit card or wire transfer to make the payment to Villa Tracker. In this case, Villa Tracker will return the 10% commission back to the agency’s account after the transaction is completed.`,
      },
    ],
  },
  {
    uinqId: "AdvancedTools",
    icon: svgIcons.advanced,
    category: "Advanced Tools",
    faqs: [
      {
        eventKey: "0",
        headerText: "What advanced search filters are available for finding a villa?",
        bodyContent: `When looking for the perfect villa, we offer a range of Advanced Search Options to help you refine your search. Our platform includes a variety of filters that allow you to find alternatives that match your clients’ specific criteria. You can filter properties based on important factors such as location, amenities, and budget, ensuring that you have a comprehensive view of your options.\n
- Price Ranges: Choose from various price ranges to find a property that fits your client’s budget.\n
- Type of Property: Specify the type of property you’re interested in, whether it's a villa, chalet, apartment, studio, castle, yacht, or more.\n
- Must-Haves: Highlight your must-haves such as a stunning sea view, ski-in/ski-out access, a private beach, a helipad, and other essential features.\n
- Amenities: Filter by desired amenities to ensure that your property meets all your clients’ needs for comfort and convenience.\n
These options make it easy to tailor your search and discover the ideal villa that meets your client’s unique requirements.`,
      },
    ],
  },
];
