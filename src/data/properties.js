export const propertiesData = Array.from({ length: 24 }).map((_, i) => {
  const types = ["Buy", "Rent"];
  const propertyTypes = ["Apartment", "Villa", "Commercial"];
  const locations = ["Mumbai", "Navi Mumbai", "Thane", "Panvel", "Pune"];
  const statuses = ["Ready to move", "Under construction"];
  const furnishings = ["Furnished", "Semi-Furnished", "Unfurnished"];

  const type = types[i % 2];
  const location = locations[i % locations.length];
  const bhk = (i % 4) + 1;
  const isSale = type === "Buy";
  const price = isSale ? (Math.random() * 5 + 0.5).toFixed(2) + " Cr" : (Math.random() * 50 + 15).toFixed(0) + "k /mo";
  const rawPrice = isSale ? parseFloat(price) * 10000000 : parseFloat(price) * 1000;

  return {
    id: `prop-${i + 1}`,
    slug: `property-${i + 1}-in-${location.toLowerCase().replace(' ', '-')}`,
    title: `${bhk} BHK Premium ${propertyTypes[i % 3]} in ${location}`,
    type: type,
    propertyType: propertyTypes[i % 3],
    location: location,
    bhk: bhk,
    price: `₹ ${price}`,
    rawPrice: rawPrice,
    sqft: 500 + i * 150,
    beds: bhk,
    baths: bhk === 1 ? 1 : bhk - 1,
    image: `https://picsum.photos/seed/prop${i + 1}/800/600`,
    status: statuses[i % 2],
    furnishing: furnishings[i % 3],
    isVerified: i % 3 === 0,
    hasRera: i % 2 === 0,
    floor: Math.floor(Math.random() * 30) + 1,
    facing: ["East", "West", "North", "South"][i % 4],
    age: Math.floor(Math.random() * 10) + " Years",
    possession: statuses[i % 2] === "Ready to move" ? "Immediate" : "Dec 2025",
    description: "Experience luxury living in this beautifully designed property. Featuring spacious rooms, modern amenities, and a prime location, it's the perfect place to call home. Close to schools, hospitals, and transit points.",
    amenities: ["Swimming Pool", "Gymnasium", "Club House", "24/7 Security", "Power Backup", "Car Parking", "Children's Play Area"]
  };
});
