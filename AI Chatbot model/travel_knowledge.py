# Structured travel data for FAQ generation (Pakistan + international)

PAKISTAN_CITIES = [
    "Lahore", "Islamabad", "Karachi", "Hunza", "Skardu", "Naran", "Kaghan", "Swat",
    "Murree", "Peshawar", "Quetta", "Multan", "Faisalabad", "Gilgit", "Chitral",
    "Abbottabad", "Nathia Gali", "Muzaffarabad", "Neelum Valley", "Fairy Meadows",
    "Rawalpindi", "Bahawalpur", "Sialkot", "Hyderabad", "Gwadar", "Kalash Valley",
    "Shogran", "Kalam", "Dir", "Chillas", "Passu", "Khunjerab", "Deosai", "Shigar",
]

INTERNATIONAL_CITIES = [
    "Dubai", "Abu Dhabi", "Istanbul", "Ankara", "Bangkok", "Phuket", "Kuala Lumpur",
    "Penang", "Riyadh", "Jeddah", "Makkah", "Madinah", "London", "Paris", "Rome",
    "Barcelona", "Amsterdam", "Berlin", "New York", "Los Angeles", "Toronto",
    "Sydney", "Melbourne", "Tokyo", "Singapore", "Maldives", "Baku", "Tbilisi",
    "Doha", "Muscat", "Kuwait City", "Cairo", "Istanbul", "Antalya", "Bali",
    "Jakarta", "Beijing", "Shanghai", "Hong Kong", "Seoul", "Vienna", "Prague",
    "Budapest", "Athens", "Zurich", "Geneva", "Mumbai", "Delhi", "Goa",
    "Kathmandu", "Colombo", "Male",     "Tashkent", "Samarkand", "Tehran", "Baghdad",
    "Amman", "Beirut", "Casablanca", "Marrakech", "Nairobi", "Cape Town",
    "Langkawi", "Hanoi", "Ho Chi Minh", "Manila", "Cebu", "Taipei",
    "Osaka", "Kyoto", "Munich", "Frankfurt", "Lisbon", "Dublin",
]

CITY_DETAILS = {
    "lahore": {
        "region": "Pakistan", "type": "cultural",
        "hotels": "Pearl Continental (PKR 25,000/night), Avari (PKR 18,000), Hotel One Gulberg (PKR 6,500)",
        "food": "Waris Nihari, Butt Karahi, Gawalmandi Food Street, Lahori chargha",
        "activities": "Badshahi Mosque, Lahore Fort, Shalimar Gardens, Wagah Border ceremony",
        "weather": "Pleasant Oct–Mar (10–25°C); hot Apr–Jun; monsoon Jul–Aug",
        "budget_3day": "PKR 15,000–35,000 (budget to mid-range)",
        "transport": "Metro Bus, Orange Line, Careem/Uber, rickshaws",
    },
    "islamabad": {
        "region": "Pakistan", "type": "capital",
        "hotels": "Serena (PKR 30,000), Marriott (PKR 22,000), Envoy Continental (PKR 4,000)",
        "food": "Monal Restaurant, Savour Foods, Afghan cuisine in F-10",
        "activities": "Faisal Mosque, Margalla Hills trails, Pakistan Monument, Daman-e-Koh",
        "weather": "Mild Oct–Apr; hot May–Jun; monsoon Jul–Aug",
        "budget_3day": "PKR 18,000–40,000",
        "transport": "Metro Bus, Careem, taxis; rent car for day trips",
    },
    "karachi": {
        "region": "Pakistan", "type": "coastal",
        "hotels": "PC Karachi (PKR 20,000), Movenpick (PKR 18,000), Regency (PKR 4,000)",
        "food": "Student Biryani, Burns Road, BBQ at Do Darya, fresh seafood Clifton",
        "activities": "Clifton Beach, Mohatta Palace, Quaid's Mausoleum, Port Grand",
        "weather": "Best Nov–Feb; very hot/humid Jun–Aug",
        "budget_3day": "PKR 12,000–30,000",
        "transport": "Careem/Uber; no metro; use ride-hailing for safety",
    },
    "hunza": {
        "region": "Pakistan", "type": "mountain",
        "hotels": "Serena Hunza (PKR 15,000), Eagle's Nest (PKR 6,000), guesthouses PKR 2,500",
        "food": "Local apricot dishes, chapshuro, walnut cake, cafes in Karimabad",
        "activities": "Baltit Fort, Attabad Lake, Passu Cones, Rakaposhi viewpoints",
        "weather": "Best Apr–Oct (15–25°C); snow Nov–Mar, roads may close",
        "budget_5day": "PKR 35,000–70,000 from Islamabad",
        "transport": "Fly ISB–Gilgit or drive via Karakoram Highway; hire jeep locally",
    },
    "skardu": {
        "region": "Pakistan", "type": "mountain",
        "hotels": "Shangrila Resort (PKR 12,000), PTDC Motel (PKR 3,000)",
        "food": "Trout at Shangrila, local Balti cuisine, simple dhabas in city",
        "activities": "Shangrila Lake, Deosai Plains, Shigar Fort, Khaplu Palace",
        "weather": "Jun–Sep ideal; winter heavy snow, many hotels closed",
        "budget_5day": "PKR 40,000–80,000",
        "transport": "Flight ISB–Skardu (weather-dependent) or road via Gilgit",
    },
    "dubai": {
        "region": "UAE", "type": "international",
        "hotels": "Rove Downtown (AED 350), Atlantis (AED 2,000), Premier Inn (AED 200)",
        "food": "Al Ustad Special Kabab, Ravi Restaurant, global fine dining at DIFC",
        "activities": "Burj Khalifa, Dubai Mall, desert safari, Marina walk, Museum of Future",
        "weather": "Nov–Mar pleasant (20–30°C); very hot Jun–Sep",
        "budget_4day": "PKR 80,000–150,000 from Pakistan (visa on arrival for many)",
        "transport": "Metro, Careem, NOL card; airport DXB well connected",
    },
    "istanbul": {
        "region": "Turkey", "type": "international",
        "hotels": "Sura Hagia Sophia (€120), Cheers Hostel (€25), Four Seasons (€350)",
        "food": "Kebabs, simit, baklava, fish by Bosphorus, Sultanahmet breakfast spots",
        "activities": "Hagia Sophia, Blue Mosque, Grand Bazaar, Bosphorus cruise, Galata Tower",
        "weather": "Apr–May and Sep–Oct best; cold wet winter",
        "budget_5day": "PKR 150,000–280,000 (e-visa for Pakistanis)",
        "transport": "Istanbulkart tram/metro; walk Sultanahmet; taxis use apps",
    },
}

TOPIC_TEMPLATES = {
    "hotels": [
        "best hotels in {city}",
        "where to stay in {city}",
        "{city} accommodation",
        "cheap hotels {city}",
        "luxury hotels in {city}",
        "hotel prices {city}",
        "recommended hotels {city}",
        "places to stay {city}",
        "{city} hotel booking",
        "budget stay {city}",
        "family hotels {city}",
        "which hotel in {city}",
        "top rated hotels {city}",
        "{city} resort",
        "hostels in {city}",
        "book hotel {city}",
        "night stay cost {city}",
    ],
    "flights": [
        "flights to {city}",
        "how to fly to {city}",
        "airfare {city}",
        "cheap flights {city}",
        "flight price from pakistan to {city}",
        "airlines flying to {city}",
        "book flight {city}",
        "direct flight {city}",
        "flight duration to {city}",
        "best airline for {city}",
        "when to book flights {city}",
        "return ticket {city}",
        "one way flight {city}",
        "flight deals {city}",
        "PIA flight {city}",
        "emirates to {city}",
    ],
    "weather": [
        "weather in {city}",
        "best time to visit {city}",
        "{city} climate",
        "temperature {city}",
        "when to go {city}",
        "season to visit {city}",
        "rain in {city}",
        "summer weather {city}",
        "winter in {city}",
        "is {city} hot in summer",
        "monsoon {city}",
        "snow in {city}",
        "forecast {city}",
        "pack for {city} weather",
        "month to visit {city}",
        "climate guide {city}",
    ],
    "budget": [
        "trip budget {city}",
        "how much for {city} trip",
        "cost of visiting {city}",
        "{city} travel cost",
        "cheap trip {city}",
        "5 day budget {city}",
        "money needed for {city}",
        "daily expenses {city}",
        "affordable {city} trip",
        "total cost {city} from pakistan",
        "budget breakdown {city}",
        "save money {city}",
        "expensive is {city}",
        "minimum budget {city}",
        "family trip cost {city}",
        "solo travel budget {city}",
    ],
    "food": [
        "what to eat in {city}",
        "best food {city}",
        "restaurants {city}",
        "street food {city}",
        "halal food {city}",
        "famous dishes {city}",
        "where to eat {city}",
        "local cuisine {city}",
        "breakfast {city}",
        "dinner spots {city}",
        "biryani in {city}",
        "food guide {city}",
        "must try food {city}",
        "cheap eats {city}",
        "fine dining {city}",
        "vegetarian food {city}",
    ],
    "activities": [
        "things to do in {city}",
        "attractions {city}",
        "places to visit {city}",
        "sightseeing {city}",
        "tourist spots {city}",
        "adventure {city}",
        "family activities {city}",
        "day trip {city}",
        "photography spots {city}",
        "nightlife {city}",
        "shopping {city}",
        "museums {city}",
        "trekking near {city}",
        "beaches in {city}",
        "cultural sites {city}",
        "itinerary {city} 3 days",
    ],
    "transport": [
        "how to get around {city}",
        "local transport {city}",
        "uber careem {city}",
        "metro bus {city}",
        "taxi {city}",
        "rent car {city}",
        "airport to city {city}",
        "public transport {city}",
        "travel within {city}",
        "bus routes {city}",
        "train to {city}",
        "road trip to {city}",
        "daewoo to {city}",
        "getting around {city}",
        "transport cost {city}",
        "safe transport {city}",
    ],
    "safety": [
        "is {city} safe for tourists",
        "safety tips {city}",
        "solo female travel {city}",
        "crime in {city}",
        "safe areas {city}",
        "emergency numbers {city}",
        "travel advisory {city}",
        "scams to avoid {city}",
        "night safety {city}",
        "health safety {city}",
        "police contact {city}",
        "safe to travel {city} now",
        "security {city}",
        "pickpockets {city}",
        "tourist police {city}",
        "travel insurance {city}",
    ],
    "visa": [
        "visa for {city}",
        "visa requirements {city}",
        "do pakistanis need visa {city}",
        "e visa {city}",
        "visa on arrival {city}",
        "tourist visa {city}",
        "visa fee {city}",
        "visa processing time {city}",
        "documents for {city} visa",
        "schengen for {city}",
        "umrah visa {city}",
        "work visa {city}",
        "visa free {city} pakistan",
        "embassy visa {city}",
        "online visa application {city}",
        "visa extension {city}",
    ],
    "packing": [
        "what to pack for {city}",
        "packing list {city}",
        "clothes for {city}",
        "winter packing {city}",
        "summer clothes {city}",
        "essentials {city} trip",
        "medicine for {city}",
        "power adapter {city}",
        "luggage tips {city}",
        "modest dress {city}",
        "hiking gear {city}",
        "beach packing {city}",
        "carry on {city}",
        "what not to bring {city}",
        "travel gear {city}",
        "pack for mountain {city}",
    ],
    "general": [
        "travel guide {city}",
        "plan trip to {city}",
        "about {city} tourism",
        "first time {city}",
        "tips for {city}",
        "best areas {city}",
        "how many days {city}",
        "weekend trip {city}",
        "honeymoon {city}",
        "family vacation {city}",
        "solo trip {city}",
        "hidden gems {city}",
        "local culture {city}",
        "language in {city}",
        "currency {city}",
        "sim card {city}",
        "travel {city} from pakistan",
        "guide me {city}",
        "tell me about {city}",
        "explore {city}",
        "visit {city} guide",
        "tourist information {city}",
        "travel tips {city} pakistan",
    ],
}

# Light variants (keeps index ~22k, fast real-time search)
EXTRA_QUESTION_SUFFIXES = ["from pakistan", "for tourists"]

GENERIC_ANSWERS = {
    "hotels": (
        "{city} stays: book 2–4 weeks ahead on your app's Hotels page. "
        "Budget PKR 2,500–5,000/night (guesthouses), mid PKR 6,000–12,000, luxury PKR 15,000+. "
        "Check reviews, breakfast inclusion, and location near main sights."
    ),
    "flights": (
        "Flights to {city}: compare PIA, Airblue, Serene, Emirates, Turkish, FlyDubai on our Flights page. "
        "Book 3–6 weeks early; Tue–Thu departures are often cheaper. "
        "Have flexible dates for northern Pakistan routes (weather cancellations)."
    ),
    "weather": (
        "{city} weather: check live forecast in the Weather section of your dashboard before packing. "
        "Mountains: best Apr–Oct; plains: Oct–Mar most comfortable; coast: Nov–Feb. "
        "Carry layers, rain jacket in monsoon, and sunscreen year-round."
    ),
    "budget": (
        "{city} trip budget (estimate): domestic 3–5 days PKR 15,000–50,000; international 4–7 days PKR 80,000–250,000+ "
        "including flights. Use our Budget Planner for a personalized breakdown by hotels, food, and transport."
    ),
    "food": (
        "Food in {city}: try local specialties, halal options are widely available in Muslim regions. "
        "Street food is great value—choose busy stalls. Reserve popular restaurants on weekends. "
        "Drink bottled water in new destinations."
    ),
    "activities": (
        "Top things in {city}: mix cultural sites, nature, and local markets. "
        "Book guided tours for mountains/deserts. Start early to beat crowds. "
        "Save favorites in your Itinerary Planner for day-by-day scheduling."
    ),
    "transport": (
        "Getting around {city}: use Careem/Uber where available; agree rickshaw fares first. "
        "For intercity travel in Pakistan try Daewoo/Faisal Movers; for north hire 4x4 with experienced driver. "
        "See Transport in the app for live routes and prices."
    ),
    "safety": (
        "Safety in {city}: stay in well-reviewed areas, share itinerary with family, keep copies of ID/passport. "
        "Pakistan emergency: 15 police, 115 ambulance. Register with your embassy abroad. "
        "Use official taxis/apps at night; check our Safety & Emergency page."
    ),
    "visa": (
        "Visa for {city}: requirements vary—GCC often visa on arrival/e-visa for Pakistanis; "
        "Europe/USA need Schengen/US visa in advance. Apply 4–8 weeks before travel. "
        "Passport 6+ months validity; return ticket and hotel proof often required."
    ),
    "packing": (
        "Pack for {city}: comfortable shoes, modest dress for mosques, power bank, universal adapter abroad. "
        "Mountains: warm layers even in summer; sun hat and SPF. "
        "International: keep medicines in original packaging with prescription if needed."
    ),
    "general": (
        "{city} travel guide: I can help with hotels, flights, weather, budget, food, and activities. "
        "Browse Destinations in the app for photos and tips. "
        "Ask a specific question like 'best hotels in {city}' or 'weather in {city}' for detailed advice!"
    ),
}
