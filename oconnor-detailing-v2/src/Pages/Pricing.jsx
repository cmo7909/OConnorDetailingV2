import React from "react";
import PackageCard from "./PackageCard";
import ExtrasSection from "./ExtraSection";
import "./Pricing.css";

const packages = [
    {
        name: 'Silver',
        variant: 'silver',
        interiorPrice: 80,
        exteriorPrice: 100,
        interiorItems: [
            "Vacuum Carpets", 
            "Vacuum Seats (leather seats cleaned)",
            "All Surfaces Wiped Down",
            "Door Jambs Cleaned",
            "Windows + Mirrors Cleaned"
        ],
        exteriorItems: [
           "Hand wash",
            "Claybar Mitt",
            "Hydro O2 Hydrophobic Spray",
            "Wheels Dressed",
            "Plastic Trim Dressed and Protected" 
        ]
    },
    {
        name: 'Gold',
        variant: 'gold',
        interiorPrice: 100,
        exteriorPrice: 120,
        interiorItems: [
            "Vacuum Carpets and Seats",
            "Steam Cleaned Cloth Seats",
            "Leather Seats Cleaned and Conditioned",
            "Air Dusting the Entire Vehicle",
            "All Surfaces Wiped Down",
            "Steam Cleaned Carpets and Mats",
            "Door Jambs Cleaned",
            "Windows + Mirrors Cleaned"
        ],
        exteriorItems: [
           "Hand wash",
            "Claybar mitt",
            "Butter Wax or Hydro O2 Hydrophobic spray",
            "Wheels Dressed",
            "Wheel Ceramic Spray",
            "Plastic Trim Dressed and Protected (With Ceramic Spray)"
        ]  
    },
    {
        name: 'Platinum',
        variant: 'platinum',
        interiorPrice: 150,
        exteriorPrice: 150,
        interiorItems: [
            "Vacuum carpets and Seats",
            "Cloth Seat and/or Carpet Extraction",
            "Leather seats cleaned and conditioned",
            "Air dusting the entire vehicle",
            "All Surfaces Wiped Down",
            "Door jambs cleaned",
            "Windows + mirrors cleaned",
            "Clean the Spare jack and accessories"
        ],
        exteriorItems: [
           "Hand Wash",
            "Synthetic Clay bar",
            "Undercarriage Spray Clean",
            "Chemical Guys Jet Seal (1 Year Useful Life)",
            "Wheels dressed + ceramic spray",
            "Plastic trim dressed and Protected (With Ceramic Spray)",
            "Windshield Ceramic Spray"
        ]
    }
];

const Pricing = () => (
    <div className="pricing-page">
        <div className="titles">
            <h1>Detailing Packages</h1>
            <h2>(price may vary based on the vehicles condition)</h2>
        </div>
        <div className="package-list">
            {packages.map(pkg=> (
              <PackageCard key={pkg.name} {...pkg}></PackageCard>  
            ))}
        </div>
        <ExtrasSection></ExtrasSection>
    </div>
)

export default Pricing;