import React from "react";

const extras = ["Spot/Scratch Polishing: +$60",
     "Avalon Kings Ceramic Coating: +$90-$190 (Price Varies by Vehicle Size)",
    "Iron Removal: +$20"
];

const ExtrasSection = () => (
    <div className="extras-section">
        <h2>Extras:</h2>
        <ul>
            {extras.map((extra, i) => <li key={i}>{extra}</li>)}
        </ul>
    </div>
);

export default ExtrasSection;