const products = [
  {
    id: 1,
    title: "M365 Electric Scooter",
    company: "Xiaomi",
    price: 349,
    rating: 4.5,
    vehicleType: "Compact kick scooter",
    description: "A classic folding electric scooter for short city commutes.",
    thumbnail: "/images/xiaomi-m365.jpg",
    imageCredit: {
      href: "https://commons.wikimedia.org/wiki/File:Xiaomi_M365.jpg",
      label: "Photo: Baldesteinemanuel326 / Wikimedia Commons",
    },
  },
  {
    id: 2,
    title: "CE 02",
    company: "BMW",
    price: 7_599,
    rating: 4.7,
    vehicleType: "Electric motorcycle",
    description: "A compact, motorcycle-style electric ride for urban travel.",
    thumbnail: "/images/bmw-ce-02.jpg",
    imageCredit: {
      href: "https://commons.wikimedia.org/wiki/File:BMW_CE_02.jpg",
      label: "Photo: Alexander-93 / Wikimedia Commons",
    },
  },
  {
    id: 3,
    title: "EM1 e",
    company: "Honda",
    price: 2_999,
    rating: 4.4,
    vehicleType: "Compact seated scooter",
    description: "Honda's compact electric scooter for everyday city trips.",
    thumbnail: "/images/honda-em1.jpg",
    imageCredit: {
      href: "https://commons.wikimedia.org/wiki/File:Honda_EM1_e_2026.jpg",
      label: "Photo: MotorideSA / Wikimedia Commons",
    },
  },
  {
    id: 4,
    title: "S1 Pro",
    company: "Ola Electric",
    price: 1_599,
    rating: 4.4,
    vehicleType: "Full-size seated scooter",
    description: "A modern electric scooter designed for daily rides and errands.",
    thumbnail: "/images/ola-s1-pro.jpg",
    imageCredit: {
      href: "https://commons.wikimedia.org/wiki/File:OLA_S1_Pro_Gen_1_Electric_Scooter.jpg",
      label: "Photo: SnapMeUp, CC BY-SA 4.0",
    },
  },
  {
    id: 5,
    title: "BeRider Electric Scooter",
    company: "BeRider",
    price: 1_199,
    rating: 4.3,
    vehicleType: "Seated electric moped",
    description: "A step-through electric moped shown with its rear storage box.",
    thumbnail: "/images/berider-electric-scooter.jpg",
    imageCredit: {
      href: "https://commons.wikimedia.org/wiki/File:BeRider_Electric_scooter.jpg",
      label: "Photo: Libuskare / Wikimedia Commons",
    },
  },
  {
    id: 6,
    title: "Electric Scooter (China)",
    company: "Honda",
    price: 1_299,
    rating: 4.2,
    vehicleType: "Seated city scooter",
    description: "A step-through Honda electric scooter photographed in Japan.",
    thumbnail: "/images/honda-china-scooter.jpg",
    imageCredit: {
      href: "https://commons.wikimedia.org/wiki/File:Honda_electric_scooter_sold_in_China.jpg",
      label: "Photo: Syced / Wikimedia Commons",
    },
  },
  {
    id: 7,
    title: "Electric Scooter (China, red)",
    company: "Honda",
    price: 1_349,
    rating: 4.3,
    vehicleType: "Seated city scooter",
    description: "A red Honda electric scooter photographed at a vehicle show.",
    thumbnail: "/images/honda-china-scooter-3.jpg",
    imageCredit: {
      href: "https://commons.wikimedia.org/wiki/File:Honda_electric_scooter_sold_in_China_3.jpg",
      label: "Photo: Syced / Wikimedia Commons",
    },
  },
  {
    id: 8,
    title: "Shared Electric Scooter",
    company: "Bird",
    price: 499,
    rating: 4.1,
    vehicleType: "Shared kick scooter",
    description: "A city-ready shared electric scooter with a standing deck.",
    thumbnail: "/images/bird-shared-scooter.jpg",
    imageCredit: {
      href: "https://commons.wikimedia.org/wiki/File:Bird_Global_scooter_and_bicycle_at_riverfront,_Windsor,_Ontario,_2025-05-30.jpg",
      label: "Photo: Crisco 1492 / Wikimedia Commons",
    },
  },
  {
    id: 9,
    title: "D4+ Electric Scooter",
    company: "NANROBOT",
    price: 1_399,
    rating: 4.6,
    vehicleType: "Performance kick scooter",
    description: "A performance-oriented folding scooter with a wide deck.",
    thumbnail: "/images/nanrobot-d4.jpg",
    imageCredit: {
      href: "https://commons.wikimedia.org/wiki/File:Nanrobot_D4%2B_electric_scooter.jpg",
      label: "Photo: Oleg Yunakov / Wikimedia Commons",
    },
  },
  {
    id: 10,
    title: "City Electric Scooter",
    company: "Blinkee",
    price: 499,
    rating: 4.2,
    vehicleType: "Compact kick scooter",
    description: "A compact electric kick scooter for convenient short rides.",
    thumbnail: "/images/blinkee-scooter.jpg",
    imageCredit: {
      href: "https://commons.wikimedia.org/wiki/File:Electric_scooter_Blinkee_rented_for_minutes_on_the_street_of_Tomasz%C3%B3w_Mazowiecki,_Poland._September_2021.jpg",
      label: "Photo: WrS.tm.pl / Wikimedia Commons",
    },
  },
  {
    id: 11,
    title: "G5 Electric Scooter",
    company: "YADEA",
    price: 1_999,
    rating: 4.5,
    vehicleType: "Full-size seated scooter",
    description: "A practical seated electric scooter built for city journeys.",
    thumbnail: "/images/yadea-g5.jpg",
    imageCredit: {
      href: "https://commons.wikimedia.org/wiki/File:Yadea_G5_2023-09-24_(bearb_Sp).jpg",
      label: "Photo: Wikisympathisant; edits by Spurzem, CC BY-SA 4.0",
    },
  },
  {
    id: 12,
    title: "Bob-Eco Electric Scooter",
    company: "Bob-Eco",
    price: 1_699,
    rating: 4.3,
    vehicleType: "Seated electric scooter",
    description: "An electric step-through scooter from Bob-Eco's vehicle lineup.",
    thumbnail: "/images/bob-eco-scooters.jpg",
    imageCredit: {
      href: "https://commons.wikimedia.org/wiki/File:Bob-Eco-Bobcoin-Scooters.jpg",
      label: "Photo: Educatievisie / Wikimedia Commons",
    },
  },
  {
    id: 13,
    title: "E-Moped 500 Pininfarina",
    company: "Platum",
    price: 5_499,
    rating: 4.5,
    vehicleType: "Full-size electric moped",
    description: "A Pininfarina-designed electric moped displayed at a trade show.",
    thumbnail: "/images/platum-moped.jpg",
    imageCredit: {
      href: "https://commons.wikimedia.org/wiki/File:Platum_E-Moped_500_Pininfarina.jpg",
      label: "Photo: AVMOTO / Wikimedia Commons",
    },
  },
  {
    id: 14,
    title: "Electric Moped",
    company: "Revel",
    price: 3_299,
    rating: 4.4,
    vehicleType: "Full-size electric moped",
    description: "A seated electric moped photographed during a city ride.",
    thumbnail: "/images/revel-moped.jpg",
    imageCredit: {
      href: "https://commons.wikimedia.org/wiki/File:Revel_electric_moped_IMG_4875_(50522806976).jpg",
      label: "Photo: Craobh àrd / Wikimedia Commons",
    },
  },
  {
    id: 15,
    title: "Electric Kick Scooter",
    company: "Unbranded",
    price: 399,
    rating: 4.1,
    vehicleType: "Compact kick scooter",
    description: "A straightforward electric kick scooter for short urban trips.",
    thumbnail: "/images/aoyama-electric-scooter.jpg",
    imageCredit: {
      href: "https://commons.wikimedia.org/wiki/File:Massive-sized_electric_scooter_in_Aoyama.jpg",
      label: "Photo: Syced / Wikimedia Commons",
    },
  },
].map((product) => {
  const isKickScooter = /kick|shared/i.test(
    `${product.title} ${product.vehicleType}`,
  );
  const isMotorcycle = /motorcycle/i.test(product.vehicleType);
  const batteryCapacities = isKickScooter
    ? [360, 450, 500, 720, 1200]
    : isMotorcycle
      ? [3000, 4000, 5000, 6000, 7500]
      : [1500, 1800, 2000, 2400, 3000, 4000];
  const maximumSpeeds = isKickScooter
    ? [25, 30, 32, 35, 40, 45]
    : isMotorcycle
      ? [80, 90, 95, 100, 105, 110]
      : [45, 50, 55, 60, 65, 75, 85];
  const motorPowers = isKickScooter
    ? [350, 450, 500, 600, 800, 1000, 1500]
    : isMotorcycle
      ? [5000, 6000, 7500, 9000, 11000]
      : [1200, 1500, 1800, 2000, 2500, 3000, 4000];
  const maximumRanges = isKickScooter
    ? [20, 25, 30, 35, 40, 45, 50]
    : isMotorcycle
      ? [70, 80, 90, 100, 110, 120]
      : [50, 60, 70, 80, 90, 100, 120];
  const weights = isKickScooter
    ? [12, 14, 16, 18, 22, 28, 35]
    : isMotorcycle
      ? [100, 110, 120, 130, 140]
      : [65, 75, 85, 95, 105, 115, 125];
  const defaultStocks = [14, 3, 8, 2, 11, 5, 7, 4, 9, 16, 1, 6, 12, 10, 18];
  const sample = (values, multiplier, offset) =>
    values[(product.id * multiplier + offset) % values.length];

  return {
    ...product,
    stockQuantity:
      typeof product.stockQuantity === 'number'
        ? product.stockQuantity
        : defaultStocks[(product.id - 1) % defaultStocks.length] ?? 10,
    category: "electric-scooters",
    specificationsDemo: true,
    specifications: {
      batteryCapacity: `${sample(batteryCapacities, 3, 1)} Wh`,
      maximumSpeed: `${sample(maximumSpeeds, 5, 2)} km/h`,
      motorPower: `${sample(motorPowers, 2, 3)} W`,
      maximumRange: `${sample(maximumRanges, 3, 4)} km`,
      weight: `${sample(weights, 5, 1)} kg`,
    },
  };
});

export default products;
