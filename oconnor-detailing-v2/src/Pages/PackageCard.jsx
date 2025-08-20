import React from "react";
import "./PackageCard.css";

const backgrounds = {
  silver: '#bae6fd',   // bright sky blue
  gold: '#fde68a',     // warm yellow
  platinum: '#ddd6fe', // soft lilac
};

const gradientOverlay = 'linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(0,0,0,0.05))';

const PackageCard = ({ name, interiorPrice, exteriorPrice, interiorItems, exteriorItems, variant }) => {
  const backgroundStyle = {
    background: `${gradientOverlay}, ${backgrounds[variant?.toLowerCase()] || '#fff'}`,
  };

  return (
    <div className="package-card" style={backgroundStyle}>
      <h2>{name} Package:</h2>

      <div className="section">
        <h3>Interior: ${interiorPrice}</h3>
        <ul>
          {interiorItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h3>Exterior: ${exteriorPrice}</h3>
        <ul>
          {exteriorItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PackageCard;

