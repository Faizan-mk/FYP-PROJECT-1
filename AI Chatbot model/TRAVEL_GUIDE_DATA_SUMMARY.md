# 🌍 AI Travel Guide Chatbot - Data Summary

## Overview
Your AI chatbot has been transformed into a **professional Travel Guide** with comprehensive, real-world data covering all aspects of travel planning for Pakistan and international destinations.

---

## 📊 Data Categories (25 Intent Tags)

### 1. **Basic Interactions**
- ✅ Greeting (with Urdu support: "Assalam o Alaikum", "Kya haal hai")
- ✅ Goodbye (with Urdu: "Allah Hafiz", "Khuda Hafiz")
- ✅ Thanks/Appreciation
- ✅ Help & Support

---

### 2. **🌍 Destinations**

#### **Pakistan Destinations** (`destinations_pakistan`)
- **Northern Areas**: Hunza, Skardu, Naran-Kaghan, Swat, Fairy Meadows, Neelum Valley, Chitral
- **Major Cities**: Lahore, Karachi, Islamabad, Murree
- **Key Info**: Best visiting times, budget estimates (PKR 10,000-70,000), unique features
- **Example**: "Hunza Valley - Best time: April-October, cherry blossoms in spring"

#### **International Destinations** (`destinations_international`)
- **Popular**: Dubai, Istanbul (Turkey), Bangkok (Thailand), Kuala Lumpur (Malaysia)
- **Religious**: Saudi Arabia (Umrah packages)
- **Premium**: Europe, Maldives
- **Budget Estimates**: PKR 80,000-400,000 depending on destination
- **Visa Info**: Visa on arrival, e-visa, visa-free options

---

### 3. **🏨 Hotels & Accommodation (9 Cities)**

#### **Pakistan Hotels**
1. **Lahore** (`hotels_lahore`)
   - Luxury: Pearl Continental (PKR 25,000/night), Avari (PKR 18,000)
   - Mid-range: Hotel One (PKR 6,000), Ramada (PKR 8,000)
   - Budget: Sunfort (PKR 3,500), Metro Hotel (PKR 2,500)
   - Best areas: Gulberg, Mall Road, DHA

2. **Islamabad** (`hotels_islamabad`)
   - Premium: Serena Hotel (PKR 30,000), Marriott (PKR 22,000)
   - Mid-range: Ramada (PKR 10,000), Best Western (PKR 8,000)
   - Budget: Envoy Continental (PKR 4,000), Hill View (PKR 3,000)
   - Best sectors: F-6/F-7, F-10, Bahria Town

3. **Karachi** (`hotels_karachi`)
   - Luxury: Pearl Continental (PKR 20,000), Movenpick (PKR 18,000)
   - Mid-range: Mehran Hotel (PKR 9,000), Ramada Creek (PKR 11,000)
   - Budget: Regency Hotel (PKR 4,000)
   - Best areas: Clifton/DHA, Saddar

4. **Hunza** (`hotels_hunza`)
   - Premium: Serena Hunza (PKR 15,000), Hunza Embassy (PKR 8,000)
   - Mid-range: Eagle's Nest (PKR 6,000), Rakaposhi View (PKR 5,000)
   - Budget: Karimabad Inn (PKR 2,500), Guesthouses (PKR 1,500-2,500)
   - Unique: Local apricot jam breakfast included!

5. **Skardu** (`hotels_skardu`)
   - Premium: Shangrila Resort (PKR 12,000) - iconic heart-shaped lake!
   - Mid-range: Concordia Hotel (PKR 6,000), K2 Motel (PKR 5,000)
   - Budget: PTDC Motel (PKR 3,000), Mountain Lodge (PKR 2,500)
   - Note: Many close in winter (Nov-March)

#### **International Hotels**
6. **Dubai** (`hotels_dubai`)
   - Ultra Luxury: Burj Al Arab (AED 5,000+), Atlantis The Palm (AED 2,000)
   - Mid-range: Rove Hotels (AED 350), Ibis (AED 250)
   - Budget: Premier Inn (AED 200), Deira hotels (AED 150-250)
   - Tip: Use Dubai Metro to save money!

7. **Istanbul** (`hotels_istanbul`)
   - Luxury: Ciragan Palace (€400), Four Seasons (€350)
   - Mid-range: Sura Hagia Sophia (€120), Dosso Dossi (€80)
   - Budget: Hostels (€25-30 with breakfast)
   - Best areas: Sultanahmet, Beyoglu/Taksim

---

### 4. **✈️ Flights**

#### **Domestic Flights** (`flights_domestic`)
- **Airlines**: PIA, Airblue, Serene Air, AirSial
- **Routes & Prices**:
  - Lahore-Karachi: PKR 8,000-15,000 (2hrs)
  - Islamabad-Karachi: PKR 9,000-16,000 (2.5hrs)
  - Islamabad-Skardu: PKR 12,000-25,000 (1hr, scenic!)
  - Islamabad-Gilgit: PKR 10,000-20,000
- **Tips**: Book 3-4 weeks advance for 30-40% savings, Tuesday-Thursday cheaper

#### **International Flights** (`flights_international`)
- **Dubai**: Emirates (PKR 45,000-80,000), FlyDubai (PKR 30,000-55,000)
- **Istanbul**: Turkish Airlines (PKR 65,000-120,000), PIA (PKR 55,000-95,000)
- **Bangkok**: Thai Airways (PKR 55,000-90,000)
- **Tips**: Book 2-3 months advance, avoid peak seasons (Eid, December)

---

### 5. **🚗 Transport**

#### **Local Transport** (`transport_local`)
- **Ride-hailing**: Careem, Uber, InDriver (cheapest), Bykea (bikes)
- **Public Transport**:
  - Lahore: Metro Bus (PKR 30-50), Orange Line Train (PKR 40)
  - Islamabad: Metro Bus (PKR 20-50)
  - Karachi: Careem/Uber (no metro yet)
- **Rickshaws**: PKR 50-200 (negotiate!)
- **Car Rental**: PKR 3,000-6,000/day with driver

#### **Intercity Transport** (`transport_intercity`)
- **Luxury Buses**: Daewoo (PKR 1,500-2,500), Faisal Movers (PKR 1,200-2,000)
- **Trains**: Economy (PKR 800-1,500), AC Business (PKR 2,000-3,500), AC Sleeper (PKR 3,000-5,000)
- **Popular Routes**: Lahore-Islamabad (4-5hrs), Lahore-Karachi (18-20hrs)
- **Northern Areas**: Hire 4x4 jeeps (PKR 8,000-15,000/day)

---

### 6. **☀️ Weather**

#### **Pakistan Weather** (`weather_pakistan`)
- **Northern Areas**: Best April-October (15-25°C), winter roads close
- **Lahore/Islamabad**: Pleasant Oct-March, hot summer (35-45°C)
- **Karachi**: Hot year-round, best Nov-Feb
- **Monsoon**: July-August (carry umbrella!)
- **Best Seasons**: Spring (March-May) for flowers, Autumn (Sep-Nov) for clear skies

#### **International Weather** (`weather_international`)
- **Dubai**: Best Nov-March (20-30°C), avoid June-Aug (40-50°C)
- **Istanbul**: Best April-May, Sep-Oct (15-25°C)
- **Bangkok**: Best Nov-Feb (cool season), avoid Mar-May (40°C+)
- **Malaysia**: Hot year-round (25-35°C), best Dec-Feb

---

### 7. **💰 Budget Planning**

#### **Pakistan Trips** (`budget_pakistan`)
- **Hunza 5 days**: Budget PKR 25,000 | Mid-range PKR 40,000 | Luxury PKR 70,000+
- **Skardu 5 days**: Budget PKR 30,000 | Mid-range PKR 50,000 | Luxury PKR 80,000+
- **Lahore 3 days**: Budget PKR 12,000 | Mid-range PKR 25,000 | Luxury PKR 50,000+
- **Breakdown**: Accommodation (30-40%), Food (25-30%), Transport (20-25%)

#### **International Trips** (`budget_international`)
- **Dubai 4 days**: Budget PKR 80,000 | Mid-range PKR 120,000 | Luxury PKR 200,000+
- **Turkey 7 days**: Budget PKR 150,000 | Mid-range PKR 250,000 | Luxury PKR 400,000+
- **Thailand 6 days**: Budget PKR 100,000 | Mid-range PKR 160,000
- **Umrah**: PKR 150,000-300,000 (varies by season)

---

### 8. **🍽️ Food & Cuisine**

#### **Pakistan Food** (`food_pakistan`)
- **Lahore**: Nihari (Waris Nihari), Haleem (Phajja's), Chargha (Butt Karahi), Food Street
- **Karachi**: Biryani (Student Biryani), Bun Kabab (Zameer Ansari), Sajji
- **Islamabad**: Monal Restaurant, Savour Foods (pulao, tikka)
- **Street Food**: Gol Gappay (PKR 50-100), Samosas (PKR 20-50), Chaat (PKR 80-150)
- **Northern Areas**: Chapshuro (Hunza), Harissa (Skardu), local apricots
- **Average Cost**: PKR 300-800/meal

#### **International Food** (`food_international`)
- **Dubai**: Shawarma (AED 10-20), Al Mallah, Ravi Restaurant (all halal!)
- **Turkey**: Kebabs, Baklava, Turkish Delight, Pide (all meat is halal!)
- **Thailand**: Muslim Quarter for halal food, use HalalTrip app
- **Malaysia**: 100% halal everywhere! Nasi Lemak, Satay, Roti Canai

---

### 9. **🎯 Activities**

#### **Adventure Activities** (`activities_adventure`)
- **Trekking**: K2 Base Camp (12-14 days), Fairy Meadows (2-3 days), Rush Lake
- **Paragliding**: Hunza (PKR 5,000-8,000)
- **Camping**: Deosai Plains (PKR 3,000-5,000/night with guide), Rama Meadows
- **Rafting**: Kunhar River, Indus River
- **Skiing**: Malam Jabba (Dec-Feb, PKR 3,000-5,000/day)
- **Jeep Safari**: Khunjerab Pass (China border, 4,693m altitude!)

#### **Cultural Activities** (`activities_cultural`)
- **Lahore**: Badshahi Mosque (free), Lahore Fort (PKR 500), Shalimar Gardens (PKR 50)
- **Islamabad**: Faisal Mosque (free), Lok Virsa Museum (PKR 50)
- **Karachi**: Quaid's Mausoleum (free), Mohatta Palace (PKR 100)
- **Northern Heritage**: Baltit Fort (PKR 200, 700 years old), Shigar Fort
- **UNESCO Sites**: Taxila (PKR 500), Mohenjo-Daro (PKR 500)

#### **Family Activities** (`activities_family`)
- **Lahore**: Jilani Park, Lahore Zoo (PKR 50), Joyland, Sozo Water Park (PKR 1,500-2,500)
- **Islamabad**: Lake View Park, F-9 Park (free), Pir Sohawa chairlift (PKR 300)
- **Karachi**: Karachi Zoo, Funland, Sindbad (PKR 1,500-2,500)
- **Northern Areas**: Lake Saif ul Malook boat ride (PKR 500-1,000), Ayubia chairlift

---

### 10. **🛍️ Shopping** (`shopping`)
- **Lahore**: Anarkali Bazaar, Liberty Market, Packages Mall
- **Islamabad**: Jinnah Super, Centaurus Mall, F-6 Markaz
- **Karachi**: Saddar, Dolmen Mall, Zamzama
- **Souvenirs**: 
  - Hunza: Gemstones (PKR 500-50,000), dry fruits (PKR 500-2,000/kg)
  - Lahore: Truck art items, miniature paintings, leather goods
  - Swat: Peshawari chappals (PKR 1,500-4,000)
- **Tip**: Bargain at bazaars (start at 50-60% of asking price!)

---

### 11. **🛡️ Safety & Practical Info**

#### **Safety Tips** (`safety_tips`)
- **Emergency Numbers**: Police 15, Ambulance 115, Tourist Police 1422
- **Safety**: Major cities and Northern Areas are very safe for tourists
- **Tips**: Dress modestly, use registered transport, keep document copies
- **Solo Travel**: Women can travel solo, better with groups in Northern Areas

#### **Visa & Documents** (`visa_documents`)
- **Dubai**: Visa on arrival (PKR 10,000-15,000, 30 days)
- **Turkey**: E-visa online (PKR 8,000-12,000, 90 days)
- **Thailand**: Visa on arrival (PKR 5,000-8,000, 15 days)
- **Malaysia**: Visa-free (30 days)
- **Documents**: Passport (6 months validity), return ticket, hotel booking, bank statement

#### **Packing Tips** (`packing_tips`)
- **Northern Areas**: Layers, windproof jacket, hiking shoes, sunscreen (SPF 50+)
- **Cities**: Light cotton clothes, modest clothing, comfortable shoes
- **International**: Adapter (UK-style 3-pin), local SIM card, medicines

---

### 12. **📱 Technology & Communication**

#### **SIM Cards & Internet** (`sim_internet`)
- **Best Networks**: Jazz (best coverage), Zong (fast 4G), Telenor, Ufone
- **Tourist SIM**: PKR 500-1,000 at airports (passport required)
- **Data Packages**: 10GB (PKR 500-700), 50GB (PKR 1,500-2,000)
- **Coverage**: 4G in all major cities and most Northern Areas
- **Activation**: Biometric verification required (5-10 minutes)

#### **Language & Culture** (`language_culture`)
- **Languages**: Urdu (national), English (widely spoken in cities)
- **Useful Phrases**: 
  - Assalam o Alaikum (Hello)
  - Shukriya (Thank you)
  - Kitna hai? (How much?)
  - Mehenga hai (Too expensive)
- **Culture Tips**: Remove shoes in homes/mosques, use right hand, dress modestly

---

### 13. **💵 Money & Currency** (`money_currency`)
- **Currency**: Pakistani Rupee (PKR)
- **Exchange Rate**: 1 USD = PKR 280-290, 1 AED = PKR 75-80
- **ATMs**: Widely available in cities, limited in Northern Areas
- **Credit Cards**: Accepted in hotels/malls in cities, not in small shops
- **Mobile Banking**: JazzCash, EasyPaisa (widely used)
- **Cash Needed**: PKR 10,000-20,000/day budget, PKR 30,000-50,000 comfortable

---

### 14. **💊 Health & Medical** (`health_medical`)
- **Hospitals**: Shaukat Khanum, Aga Khan, Shifa International (excellent in cities)
- **Pharmacies**: Everywhere, many 24/7, most medicines available
- **Health Tips**: 
  - Drink bottled water only (Nestle, Kinley - PKR 50-100)
  - Altitude sickness above 3,000m (drink water, rest first day)
  - SPF 50+ sunscreen essential
- **Vaccinations**: Hepatitis A, Typhoid recommended
- **Emergency**: Dial 115 for ambulance

---

### 15. **📸 Photography** (`photography`)
- **Best Spots**:
  - Hunza: Attabad Lake, Eagle's Nest (sunrise!), Passu Cones, Khunjerab Pass
  - Skardu: Shangrila Lake, Deosai Plains (sunset), Katpana Desert
  - Lahore: Badshahi Mosque (sunset), Wazir Khan Mosque (tiles!)
  - Islamabad: Faisal Mosque (blue hour), Monal (city lights)
- **Best Time**: Golden hour (sunrise/sunset), Spring (April-May), Autumn (Sep-Oct)
- **Drone Rules**: Need CAA permission for commercial use
- **Tip**: Ask permission before photographing people (especially women)

---

### 16. **📅 Booking Help** (`booking_help`)
- **Platforms**: 
  - Hotels: Booking.com, Agoda, Jovago.pk
  - Flights: Skyscanner, Google Flights
  - Packages: Bookme.pk, Sastaticket.pk
- **Tour Operators**: Adventure Tours Pakistan, Karakoram Tours, Hunza Guides
- **Package Cost**: PKR 30,000-80,000 for 5-7 day Northern Areas tour
- **Tips**: Book flights 2-3 months advance, hotels 2-4 weeks advance, read reviews

---

## 📈 Training Statistics

- **Total Intents**: 25 categories
- **Total Patterns**: 300+ user input variations
- **Total Responses**: 75+ detailed, context-aware responses
- **Training Epochs**: 200
- **Model Accuracy**: High (optimized with dropout layers)
- **Languages Supported**: English + Urdu phrases

---

## 🎯 Key Features

1. ✅ **Real Data**: Actual hotel names, prices, locations
2. ✅ **Comprehensive Coverage**: Pakistan + International destinations
3. ✅ **Budget-Friendly**: Budget, mid-range, and luxury options for all categories
4. ✅ **Practical Tips**: Real-world advice (booking times, bargaining, safety)
5. ✅ **Cultural Sensitivity**: Urdu phrases, halal food info, modest dress tips
6. ✅ **Up-to-Date**: 2024/2026 information (visa rules, prices, routes)
7. ✅ **Detailed Pricing**: PKR, AED, EUR prices for easy planning
8. ✅ **Local Expertise**: Insider tips (best times, hidden gems, local food)

---

## 🚀 Usage Examples

**User**: "Best hotels in Hunza?"
**Bot**: "Hunza Hotels - Premium: Serena Hunza (PKR 15,000/night, mountain views)..."

**User**: "How much for Dubai trip?"
**Bot**: "Dubai 4 days: Budget PKR 80,000 (flight PKR 35,000, hotel PKR 25,000...)..."

**User**: "Weather in Skardu?"
**Bot**: "Pakistan Weather Guide - Northern Areas (Hunza, Skardu, Swat): Best time April-October..."

**User**: "What to eat in Lahore?"
**Bot**: "Pakistan Must-Try Foods - Lahore: Nihari (Waris Nihari), Haleem (Phajja's)..."

---

## 📝 Notes

- All prices are approximate and subject to change
- Data is based on 2024-2026 information
- Chatbot provides general guidance; users should verify current prices and availability
- Model can be retrained anytime with updated data by modifying `intents.json` and running `train.py`

---

## 🔄 How to Update Data

1. Edit `intents.json` - add/modify patterns and responses
2. Run `python train.py` to retrain the model
3. Test with `python chatbot.py` or through Flask API
4. Model files will be updated: `chatbot_model.h5`, `words.pkl`, `classes.pkl`

---

**Created**: January 7, 2026
**Model Version**: 2.0 - Professional Travel Guide
**Status**: ✅ Trained & Ready to Use
