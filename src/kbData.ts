import { KBItem, MandiPrice, Scheme, CropDisease } from "./types";

export const KB_DATA: KBItem[] = [
  // English crop management
  {
    id: "en-crop-1",
    category: "crop",
    question: "What is the best time to sow Wheat in North India?",
    answer: "The optimum sowing time for wheat in Northern India (Punjab, Haryana, UP, Rajasthan) is from November 1st to November 15th for timely-sown varieties. Late sowing beyond November 25th reduces crop yield by 1.5% per day of delay. Soil temperature should ideally be between 20°C and 22°C.",
    language: "en",
    tags: ["wheat", "sowing", "rabi"]
  },
  {
    id: "en-crop-2",
    category: "crop",
    question: "How often should I irrigate Paddy (Rice) during transplanting?",
    answer: "For paddy transplanting, maintain a shallow water depth of 2-5 cm for the first 10-15 days. This prevents weed growth and helps the seedlings establish roots. After this period, implement Alternate Wetting and Drying (AWD) to save water, allowing the soil to dry for 1-3 days before the next irrigation.",
    language: "en",
    tags: ["paddy", "rice", "irrigation", "water"]
  },
  {
    id: "en-crop-3",
    category: "crop",
    question: "What organic fertilizer can improve clay soil drainage?",
    answer: "Well-decomposed Farmyard Manure (FYM) or Vermicompost applied at 10-12 tons per hectare significantly improves clay soil structure. Adding green manure like Dhaincha (Sesbania) before the kharif season helps loosen the soil, adding organic matter and creating natural macro-pores for drainage.",
    language: "en",
    tags: ["clay", "soil", "organic", "fertilizer", "drainage"]
  },

  // Hindi crop management
  {
    id: "hi-crop-1",
    category: "crop",
    question: "उत्तर भारत में गेहूं की बुआई का सबसे अच्छा समय क्या है?",
    answer: "उत्तर भारत (पंजाब, हरियाणा, उत्तर प्रदेश, राजस्थान) में गेहूं की समय पर बुआई का सर्वोत्तम समय 1 नवंबर से 15 नवंबर है। 25 नवंबर के बाद बुआई करने पर प्रति दिन लगभग 1.5% उपज में कमी आती है। बुआई के समय मिट्टी का तापमान 20°C से 22°C होना चाहिए।",
    language: "hi",
    tags: ["गेहूं", "बुआई", "रबी"]
  },
  {
    id: "hi-crop-2",
    category: "crop",
    question: "धान की रोपाई के दौरान कितनी बार सिंचाई करनी चाहिए?",
    answer: "धान की रोपाई के बाद शुरुआती 10-15 दिनों तक खेत में 2 से 5 सेमी पानी का स्तर बनाए रखें। यह खरपतवार को रोकता है और जड़ों को जमने में मदद करता है। इसके बाद, पानी बचाने के लिए 'वैकल्पिक गीला और सूखा' (AWD) तरीका अपनाएं, जिससे दोबारा सिंचाई से पहले मिट्टी को 1-3 दिन तक सूखने दिया जाता है।",
    language: "hi",
    tags: ["धान", "चावल", "सिंचाई", "पानी"]
  },

  // Kannada crop management
  {
    id: "kn-crop-1",
    category: "crop",
    question: "ಉತ್ತರ ಭಾರತದಲ್ಲಿ ಗೋಧಿ ಬಿತ್ತನೆಗೆ ಅತ್ಯುತ್ತಮ ಸಮಯ ಯಾವುದು?",
    answer: "ಉತ್ತರ ಭಾರತದಲ್ಲಿ (ಪಂಜಾಬ್, ಹರಿಯಾಣ, ಯುಪಿ, ರಾಜಸ್ಥಾನ) ಗೋಧಿ ಬಿತ್ತನೆಗೆ ಸೂಕ್ತವಾದ ಸಮಯ ನವೆಂಬರ್ 1 ರಿಂದ ನವೆಂಬರ್ 15 ಆಗಿದೆ. ನವೆಂಬರ್ 25 ರ ನಂತರ ಬಿತ್ತನೆ ಮಾಡುವುದರಿಂದ ಪ್ರತಿದಿನ ಶೇಕಡಾ 1.5 ರಷ್ಟು ಇಳುವರಿ ಕಡಿಮೆಯಾಗುತ್ತದೆ. ಬಿತ್ತನೆಯ ಸಮಯದಲ್ಲಿ ಮಣ್ಣಿನ ತಾಪಮಾನವು 20°C ರಿಂದ 22°C ಇರಬೇಕು.",
    language: "kn",
    tags: ["ಗೋಧಿ", "ಬಿತ್ತನೆ", "ರಬಿ"]
  },
  {
    id: "kn-crop-2",
    category: "crop",
    question: "ನಾಟಿ ಮಾಡುವಾಗ ಭತ್ತದ ಬೆಳೆಗೆ ಎಷ್ಟು ಬಾರಿ ನೀರು ಹಾಯಿಸಬೇಕು?",
    answer: "ಭತ್ತ ನಾಟಿ ಮಾಡಿದ ಮೊದಲ 10-15 ದಿನಗಳವರೆಗೆ 2-5 ಸೆಂ.ಮೀ ಆಳದ ನೀರನ್ನು ನಿರ್ವಹಿಸಿ. ಇದು ಕಳೆಗಳ ಬೆಳವಣಿಗೆಯನ್ನು ತಡೆಯುತ್ತದೆ ಮತ್ತು ಬೇರುಗಳು ಮಣ್ಣಿನಲ್ಲಿ ಸ್ಥಿರವಾಗಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ನಂತರ ನೀರು ಉಳಿಸಲು ಪರ್ಯಾಯ ಒಣಗಿಸುವ ಮತ್ತು ಒದ್ದೆ ಮಾಡುವ ವಿಧಾನವನ್ನು (AWD) ಬಳಸಿ.",
    language: "kn",
    tags: ["ಭತ್ತ", "ನೀರಾವರಿ", "ನೀರು"]
  },

  // Pest control English
  {
    id: "en-pest-1",
    category: "pest",
    question: "How to control Fall Armyworm in Maize organically?",
    answer: "To control Fall Armyworm (FAW) organically: 1) Spray 5% Neem Seed Kernel Extract (NSKE) or Neem oil (1500 ppm) at 5ml/litre of water. 2) Apply fine sand or wood ash in the whorls of maize plants to suffocate the larvae. 3) Release Trichogramma chilonis egg parasitoids at 2.5 lakh/hectare. 4) Handpick and destroy egg masses.",
    language: "en",
    tags: ["maize", "armyworm", "pest", "organic", "neem"]
  },
  {
    id: "en-pest-2",
    category: "pest",
    question: "What is the remedy for Yellow Mosaic Virus in Soybeans?",
    answer: "Yellow Mosaic Virus is transmitted by whiteflies. 1) Spray Neem oil at 3ml/litre as a repellent. 2) Set up yellow sticky traps (30 traps per hectare) to monitor and catch whiteflies. 3) Apply chemical control if whiteflies cross the Economic Threshold Level (ETL): spray Acetamiprid 20% SP at 100g/hectare or Thiamethoxam 25% WG at 100g/hectare.",
    language: "en",
    tags: ["soybean", "virus", "pest", "whitefly", "remedy"]
  },

  // Pest control Hindi
  {
    id: "hi-pest-1",
    category: "pest",
    question: "मक्के में फॉल आर्मीवॉर्म (सैनिक कीट) को जैविक रूप से कैसे नियंत्रित करें?",
    answer: "मक्के में फॉल आर्मीवॉर्म (FAW) के जैविक नियंत्रण के लिए: 1) 5% नीम बीज कर्नल अर्क (NSKE) या नीम का तेल (1500 ppm) 5ml प्रति लीटर पानी में मिलाकर छिड़काव करें। 2) लार्वे को मारने के लिए मक्के की पत्तियों के बीच बारीक रेत या लकड़ी की राख डालें। 3) ट्राइकोम्मा चिलोनीस परजीवी को खेत में छोड़ें। 4) पत्तियों पर दिखने वाले अंडों के समूहों को हाथ से निकालकर नष्ट कर दें।",
    language: "hi",
    tags: ["मक्का", "सैनिक कीट", "कीट", "जैविक", "नीम"]
  },

  // Pest control Kannada
  {
    id: "kn-pest-1",
    category: "pest",
    question: "ಮೆಕ್ಕೆಜೋಳದಲ್ಲಿ ಸೈನಿಕ ಹುಳು (Fall Armyworm) ನಿಯಂತ್ರಿಸುವುದು ಹೇಗೆ?",
    answer: "ಮೆಕ್ಕೆಜೋಳದಲ್ಲಿ ಸೈನಿಕ ಹುಳು ನಿಯಂತ್ರಿಸಲು ಸಾವಯವ ಕ್ರಮಗಳು: 1) 5% ಬೇವಿನ ಬೀಜದ ಕಷಾಯ (NSKE) ಅಥವಾ ಬೇವಿನ ಎಣ್ಣೆಯನ್ನು (1500 ppm) ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 5 ಮಿ.ಲೀ ಸೇರಿಸಿ ಸಿಂಪಡಿಸಿ. 2) ಸುಳಿಯಲ್ಲಿ ಮರಳು ಅಥವಾ ಒಲೆ ಬೂದಿಯನ್ನು ಹಾಕುವುದರಿಂದ ಹುಳುಗಳು ಸಾಯುತ್ತವೆ. 3) ಟ್ರೈಕೋಗ್ರಾಮ ಪರಾವಲಂಬಿ ಜೀವಿಗಳನ್ನು ಹೆಕ್ಟೇರ್‌ಗೆ 2.5 ಲಕ್ಷ ಬಿಡುಗಡೆ ಮಾಡಿ.",
    language: "kn",
    tags: ["ಮೆಕ್ಕೆಜೋಳ", "ಸೈನಿಕ ಹುಳು", "ಕೀಟ", "ಸಾವಯವ", "ಬೇವು"]
  },

  // Schemes English
  {
    id: "en-scheme-1",
    category: "scheme",
    question: "What are the benefits and eligibility criteria for PM-KISAN scheme?",
    answer: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi) provides direct income support of ₹6,000 per year in three equal installments of ₹2,000 directly to bank accounts of all landholding farmers' families. Eligible: Families holding cultivable land in their names. Excluded: Institutional landholders, government employees, income tax payers, and professionals (doctors, lawyers, engineers).",
    language: "en",
    tags: ["pm-kisan", "subsidies", "scheme", "money"]
  },
  {
    id: "en-scheme-2",
    category: "scheme",
    question: "How does PM Fasal Bima Yojana (PMFBY) help farmers?",
    answer: "PMFBY is a crop insurance scheme. It covers financial loss due to localized calamities, post-harvest losses, and preventing sowing due to adverse weather. Premium rates are heavily subsidized: farmers pay only 2% premium for Kharif crops, 1.5% for Rabi crops, and 5% for Annual Horticultural/Commercial crops, with the remaining premium shared equally by State and Central Governments.",
    language: "en",
    tags: ["pmfby", "insurance", "scheme", "crop-loss"]
  },

  // Schemes Hindi
  {
    id: "hi-scheme-1",
    category: "scheme",
    question: "पीएम-किसान योजना के क्या लाभ हैं और इसके लिए कौन पात्र है?",
    answer: "पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि) योजना के तहत सभी भूमिधारक किसान परिवारों को प्रति वर्ष ₹6,000 की वित्तीय सहायता तीन समान किस्तों (₹2,000 प्रत्येक) में सीधे उनके बैंक खातों में दी जाती है। पात्रता: वे परिवार जिनके नाम पर कृषि योग्य भूमि है। अपात्र: संस्थागत भूमिधारक, सरकारी कर्मचारी, आयकर दाता और पेशेवर जैसे डॉक्टर, वकील आदि।",
    language: "hi",
    tags: ["पीएम-किसान", "अनुदान", "योजना", "पैसा"]
  },

  // Schemes Kannada
  {
    id: "kn-scheme-1",
    category: "scheme",
    question: "ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆಯ ಪ್ರಯೋಜನಗಳು ಮತ್ತು ಅರ್ಹತೆ ಮಾನದಂಡಗಳು ಯಾವುವು?",
    answer: "ಪಿಎಂ-ಕಿಸಾನ್ (ಪ್ರಧಾನ ಮಂತ್ರಿ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ) ಯೋಜನೆಯು ಎಲ್ಲಾ ಭೂಹಿಡುವಳಿ ಹೊಂದಿರುವ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವರ್ಷಕ್ಕೆ ₹6,000 ನೇರ ಆದಾಯ ಬೆಂಬಲವನ್ನು ತಲಾ ₹2,000 ರಂತೆ ಮೂರು ಸಮಾನ ಕಂತುಗಳಲ್ಲಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗಳಿಗೆ ನೇರವಾಗಿ ವರ್ಗಾಯಿಸುತ್ತದೆ. ಅರ್ಹತೆ: ಸ್ವಂತ ಹೆಸರಿನಲ್ಲಿ ಕೃಷಿ ಭೂಮಿ ಹೊಂದಿರುವ ರೈತರು. ಹೊರತುಪಡಿಸಿದವರು: ಆದಾಯ ತೆರಿಗೆ ಪಾವತಿದಾರರು ಮತ್ತು ಸರ್ಕಾರಿ ನೌಕರರು.",
    language: "kn",
    tags: ["ಪಿಎಂ-ಕಿಸಾನ್", "ಯೋಜನೆ", "ಹಣ"]
  }
];

export const MANDI_PRICES: MandiPrice[] = [
  { cropName: "Wheat (Lokwan)", market: "Indore", state: "Madhya Pradesh", price: 2450, previousPrice: 2420, arrivalDate: "2026-07-15", trend: "up" },
  { cropName: "Wheat (Kalyan)", market: "Khanna", state: "Punjab", price: 2325, previousPrice: 2325, arrivalDate: "2026-07-15", trend: "stable" },
  { cropName: "Paddy (Basmati)", market: "Karnal", state: "Haryana", price: 4100, previousPrice: 4200, arrivalDate: "2026-07-15", trend: "down" },
  { cropName: "Paddy (Common)", market: "Shimoga", state: "Karnataka", price: 2180, previousPrice: 2150, arrivalDate: "2026-07-15", trend: "up" },
  { cropName: "Onion (Red)", market: "Lasalgaon", state: "Maharashtra", price: 1850, previousPrice: 1720, arrivalDate: "2026-07-15", trend: "up" },
  { cropName: "Potato (Jyoti)", market: "Agra", state: "Uttar Pradesh", price: 1250, previousPrice: 1280, arrivalDate: "2026-07-15", trend: "down" },
  { cropName: "Tomato (Local)", market: "Kolar", state: "Karnataka", price: 2600, previousPrice: 2200, arrivalDate: "2026-07-15", trend: "up" },
  { cropName: "Mustard Seed", market: "Jaipur", state: "Rajasthan", price: 5400, previousPrice: 5410, arrivalDate: "2026-07-15", trend: "stable" },
  { cropName: "Cotton (Long)", market: "Rajkot", state: "Gujarat", price: 6800, previousPrice: 6650, arrivalDate: "2026-07-15", trend: "up" },
  { cropName: "Maize (Yellow)", market: "Davangere", state: "Karnataka", price: 2150, previousPrice: 2120, arrivalDate: "2026-07-15", trend: "up" }
];

export const GOVERNMENT_SCHEMES: Scheme[] = [
  {
    id: "pm-kisan",
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    description: "Income support scheme to supplement financial needs of all landholding farmers, helping them buy seeds, fertilizers, and other farm inputs.",
    benefits: "Direct payment of ₹6,000 per year, delivered in three equal installments of ₹2,000 directly into the farmer's verified bank account.",
    eligibility: [
      "All small and marginal landholder farmer families who own cultivable land.",
      "Must have land records in the family member's name.",
      "Aadhaar card must be linked to the bank account."
    ],
    documentsRequired: [
      "Land Ownership Documents (Khasra / Khatauni / Pattadar passbook)",
      "Aadhaar Card",
      "Bank Account Passbook (with IFSC code)",
      "Mobile Number linked to Aadhaar"
    ],
    link: "https://pmkisan.gov.in"
  },
  {
    id: "pmfby",
    name: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
    description: "Crop insurance scheme offering comprehensive risk covers against pre-sowing, localized calamities, mid-season adversity, and post-harvest losses.",
    benefits: "Heavily subsidized premium rates: 2% for Kharif crops, 1.5% for Rabi, and 5% for commercial/horticultural crops. Full claim payout for crop failure.",
    eligibility: [
      "All farmers growing notified crops in notified areas.",
      "Includes tenant farmers and sharecroppers.",
      "Optional for non-loanee farmers, automated for loanee farmers."
    ],
    documentsRequired: [
      "Land records or Tenancy Agreement",
      "Sowing Certificate issued by local agricultural department / Patwari",
      "Bank Account Details",
      "ID Proof (Aadhaar, Voter ID, or PAN Card)"
    ],
    link: "https://pmfby.gov.in"
  },
  {
    id: "pm-kusum",
    name: "PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha Scheme)",
    description: "Scheme providing standalone solar pumps, solarization of grid-connected agricultural pumps, and setting up solar power plants on barren lands.",
    benefits: "Government provides up to 60% subsidy for installing solar water pumps. Farmer only pays 10%, and remaining 30% can be financed via bank loan. Helps in daytime irrigation.",
    eligibility: [
      "Individual farmers, groups of farmers, panchayats, and cooperatives.",
      "Must own land suitable for solar plant installation or pump boring.",
      "Water source must be available (well, tube-well, or pond)."
    ],
    documentsRequired: [
      "Land ownership documents (Fard / Jamabandi)",
      "Bank account details",
      "Aadhaar card",
      "Affidavit on underground water level status"
    ],
    link: "https://mnre.gov.in/pm-kusum"
  }
];

export const CROP_DISEASES: CropDisease[] = [
  {
    name: "Blast Disease (Rice Blast)",
    crop: "Paddy (Rice)",
    symptoms: [
      "Spindle-shaped spots with dark brown margins and gray centers on leaves.",
      "Neck rot: brown spots on the node just below the panicle, causing it to break.",
      "Chaffy panicles that stand erect instead of hanging down."
    ],
    treatment: [
      "Spray Tricyclazole 75 WP at 0.6g per litre of water at the first sign of symptoms.",
      "Alternatively, use Isoprothiolane 40 EC at 1.5ml per litre of water.",
      "Avoid excess nitrogen fertilizer which increases disease severity."
    ],
    prevention: [
      "Use disease-resistant varieties like IR-64 or CO-47.",
      "Treat seeds with Carbendazim (2g/kg seed) before sowing.",
      "Destroy diseased stubble from previous harvests to eliminate spores."
    ],
    imagePrompt: "rice blast disease leaf spindle brown spots"
  },
  {
    name: "Yellow Rust of Wheat",
    crop: "Wheat",
    symptoms: [
      "Linear stripes of bright yellow powdery pustules on leaf blades.",
      "Yellow dust coming off on fingers when leaves are touched (spores).",
      "Stunted crop growth and shriveled grains."
    ],
    treatment: [
      "Spray Propiconazole 25 EC at 1ml per litre of water as soon as stripes are observed.",
      "Repeat spray after 15 days if weather remains humid and cold.",
      "Ensure uniform coverage of the crop canopy."
    ],
    prevention: [
      "Sow rust-resistant wheat varieties (e.g., HD 2967, HD 3086).",
      "Sow wheat timely (Nov 1-15) to avoid peak rust weather in late spring.",
      "Avoid excess overhead irrigation during cloudy, cold weather."
    ],
    imagePrompt: "wheat yellow rust disease leaves yellow stripes"
  },
  {
    name: "Late Blight of Potato",
    crop: "Potato",
    symptoms: [
      "Water-soaked irregular green-brown lesions on leaves, starting from tips.",
      "White downy growth on the underside of leaves under humid conditions.",
      "Tubers develop purplish-brown dry rot."
    ],
    treatment: [
      "Spray Metalaxyl 8% + Mancozeb 64% WP (Ridomil Gold) at 2g per litre of water.",
      "Alternatively, apply Copper Oxychloride at 3g per litre.",
      "Improve air circulation by keeping rows well-spaced."
    ],
    prevention: [
      "Plant only certified disease-free seed tubers.",
      "Perform high earthing-up to prevent spores washing down to tubers.",
      "Harvest during dry sunny weather, and discard infected tubers immediately."
    ],
    imagePrompt: "potato late blight disease leaf spots purplish brown rot"
  }
];
