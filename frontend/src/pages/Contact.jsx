import React, { useState } from 'react';
import ContactForm from '../components/Contact-form.jsx';
import "../Styles/StylesContact.css";
import "../Styles/StylesContact-form.css";
import FadeInSection from '../Animations/FadeInSection.jsx';
import { Helmet } from "react-helmet"; // Importing Helmet

const Contact = () => {
  const [successMessage, setSuccessMessage] = useState(null);

  return (
    <FadeInSection>
    <div className="contact-container">
       {/* Set the title for the Home Page */}
            <Helmet>
              <title>Contact Us</title>
              
            </Helmet>
      <h2>Contact Us</h2>
      <p>Feel free to reach out to us for any inquiries.</p>
      <div className="contact-info">
            <p><strong>Address:</strong> Souk Essouf, Tunis</p>
            <p><strong>Email:</strong> emnabes930@gmail.com</p>
            <p><strong>Phone:</strong> +216 12 345 678</p>
          </div>
      <div className="contact-content">
        <div className="contact-left">
          <ContactForm onSuccess={setSuccessMessage} />
          {successMessage && <p className="message-status">{successMessage}</p>}
          
        </div>
        <div className="contact-right">
          <div className="google-map">
            <iframe
              title="Google Maps"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0, borderRadius: "8px" }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.899436156162!2d10.168883975609846!3d36.79696146788252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd353026677d91%3A0xf877b7effea31709!2ssabri%20wahret%20zmen!5e0!3m2!1sfr!2stn!4v1741992302530!5m2!1sfr!2stn"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
    </FadeInSection>
  );
};

export default Contact;