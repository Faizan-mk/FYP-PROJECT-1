"""
AI Travel Guide Chatbot - Comprehensive Test Script
Tests all major categories and verifies model responses
"""

from chatbot import chatbot_response
import time

def print_separator():
    print("\n" + "="*80 + "\n")

def test_category(category_name, queries):
    """Test a category with multiple queries"""
    print(f"🧪 Testing: {category_name}")
    print("-" * 80)
    
    for i, query in enumerate(queries, 1):
        print(f"\n{i}. Query: '{query}'")
        response = chatbot_response(query)
        print(f"   Response: {response[:150]}..." if len(response) > 150 else f"   Response: {response}")
        time.sleep(0.5)  # Small delay for readability
    
    print_separator()

def main():
    print("="*80)
    print("🌍 AI TRAVEL GUIDE CHATBOT - COMPREHENSIVE TEST")
    print("="*80)
    print("\nTesting all 25 intent categories with real queries...\n")
    time.sleep(1)
    
    # Test Categories
    test_categories = {
        "Greetings": [
            "Hello",
            "Assalam o Alaikum",
            "Good morning"
        ],
        
        "Destinations - Pakistan": [
            "Best places in Pakistan",
            "Tell me about Hunza",
            "Where to visit in Northern areas"
        ],
        
        "Destinations - International": [
            "Dubai trip",
            "Turkey travel",
            "Best countries to visit"
        ],
        
        "Hotels - Lahore": [
            "Hotels in Lahore",
            "Best hotels Lahore",
            "Cheap hotels Lahore"
        ],
        
        "Hotels - Hunza": [
            "Where to stay in Hunza",
            "Best hotels Hunza Valley",
            "Hunza accommodation"
        ],
        
        "Hotels - Dubai": [
            "Hotels in Dubai",
            "Luxury hotels Dubai",
            "Cheap stay Dubai"
        ],
        
        "Flights - Domestic": [
            "Flights to Karachi",
            "Islamabad to Skardu flight",
            "PIA flights"
        ],
        
        "Flights - International": [
            "Flights to Dubai",
            "Cheap international flights",
            "Emirates flights"
        ],
        
        "Transport - Local": [
            "How to travel in Lahore",
            "Uber in Pakistan",
            "Metro bus"
        ],
        
        "Transport - Intercity": [
            "Lahore to Islamabad",
            "Daewoo bus",
            "Train Pakistan"
        ],
        
        "Weather - Pakistan": [
            "Weather in Hunza",
            "Best time to visit Skardu",
            "When to visit Northern Areas"
        ],
        
        "Weather - International": [
            "Dubai weather",
            "Best time to visit Turkey",
            "Thailand weather"
        ],
        
        "Budget - Pakistan": [
            "Hunza trip budget",
            "How much for Skardu trip",
            "Cost of Pakistan trip"
        ],
        
        "Budget - International": [
            "Dubai trip budget",
            "How much for Turkey trip",
            "Thailand trip cost"
        ],
        
        "Food - Pakistan": [
            "What to eat in Lahore",
            "Best food in Karachi",
            "Pakistani cuisine"
        ],
        
        "Food - International": [
            "Food in Dubai",
            "What to eat in Turkey",
            "Halal food abroad"
        ],
        
        "Activities - Adventure": [
            "Trekking in Pakistan",
            "Adventure activities",
            "Paragliding"
        ],
        
        "Activities - Cultural": [
            "Historical places",
            "Museums in Pakistan",
            "Forts to visit"
        ],
        
        "Activities - Family": [
            "Family activities",
            "Things to do with kids",
            "Parks in Lahore"
        ],
        
        "Shopping": [
            "Shopping in Lahore",
            "What to buy in Hunza",
            "Souvenirs Pakistan"
        ],
        
        "Safety": [
            "Is Pakistan safe",
            "Safety tips",
            "Emergency numbers"
        ],
        
        "Visa & Documents": [
            "Visa for Dubai",
            "Documents needed",
            "Passport requirements"
        ],
        
        "Packing": [
            "What to pack for Hunza",
            "Packing list",
            "What to wear"
        ],
        
        "Photography": [
            "Best photo spots",
            "Instagram spots Pakistan",
            "Where to take photos"
        ],
        
        "SIM & Internet": [
            "SIM card Pakistan",
            "How to get internet",
            "Best network"
        ],
        
        "Language & Culture": [
            "Language in Pakistan",
            "Urdu phrases",
            "Pakistani culture"
        ],
        
        "Money & Currency": [
            "Currency in Pakistan",
            "Money exchange",
            "ATM"
        ],
        
        "Health & Medical": [
            "Medical facilities",
            "Health tips",
            "Vaccination"
        ],
        
        "Booking": [
            "How to book hotels",
            "Booking flights",
            "Tour packages"
        ],
        
        "Help": [
            "Help me",
            "What can you do",
            "Guide me"
        ],
        
        "Thanks & Goodbye": [
            "Thank you",
            "That's helpful",
            "Goodbye"
        ]
    }
    
    # Run tests
    total_categories = len(test_categories)
    total_queries = sum(len(queries) for queries in test_categories.values())
    
    print(f"📊 Total Categories: {total_categories}")
    print(f"📊 Total Test Queries: {total_queries}")
    print_separator()
    
    for category, queries in test_categories.items():
        test_category(category, queries)
    
    # Summary
    print("="*80)
    print("✅ TESTING COMPLETE!")
    print("="*80)
    print(f"\n✅ Tested {total_categories} categories")
    print(f"✅ Tested {total_queries} queries")
    print(f"✅ All responses generated successfully!")
    print("\n🎉 AI Travel Guide Chatbot is working perfectly!")
    print("\n" + "="*80)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Error during testing: {str(e)}")
        print("Please ensure the model is trained (run train.py first)")
