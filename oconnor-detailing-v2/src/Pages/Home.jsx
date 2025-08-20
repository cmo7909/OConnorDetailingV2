import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Professional Auto Detailing</h1>
          <p>Premium interior & exterior detailing — at the right price!</p>
          <Link to="/pricing" className="cta-button">View Packages</Link>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About Us</h2>
        <p>
          At <strong>O'Connor Auto Detailing</strong>, we’re passionate about bringing that <em>like-new</em> feeling back to your vehicle.
          Born from a love for cars and a commitment to quality, we provide professional detailing services
          at a lower price. Whether you need a quick refresh or a deep clean inside and out, we’ve got you covered.
        </p>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Choose Your Package Combination</h3>
            <p>Silver, Gold, or Platinum — pick what fits your needs.
                You can mix and match interior and exterior options from different packages!
            </p>
          </div>
          <div className="step">
            <h3>2. Book a Time</h3>
            <p>View the calender for avalibility then contact us directly through the email form!</p>
          </div>
          <div className="step">
            <h3>3. Drop off your vehicle or schedule pickup</h3>
            <p>Set your time and leave the vehicle in our driveway and pickup once completed.
                Or Schedule a time for me to pick up the car.
            </p>
          </div>
          <div className="step">
            <h3>4. Drive Clean & Protected</h3>
            <p>Your vehicle will look and feel new.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Bring Your Vehicle Back to Life?</h2>
        <Link to="/Contact" className="cta-button">Book Now</Link>
      </section>
    </div>
  );
};

export default Home;
