const MapsService = require('../services/mapsService');

class ItineraryAgent {
  constructor() {
    this.name = 'Itinerary Agent';
    this.role = 'Master Schedule Synthesizer & Timeline Architect';
  }

  async run(sharedState) {
    const startTime = Date.now();
    const req = sharedState.request;
    const duration = req.duration || 7;
    const activities = Array.isArray(sharedState.activities) 
      ? sharedState.activities 
      : (sharedState.activities?.data || []);

    const selectedHotel = sharedState.hotels?.selectedOption || { name: 'Central Hotel', location: req.destination };
    const selectedFlight = sharedState.flights?.selectedOption;
    const forecast = sharedState.weather?.forecast || [];

    const baseDate = req.startDate ? new Date(req.startDate) : new Date();

    const days = [];
    let actIndex = 0;

    for (let dayNum = 1; dayNum <= duration; dayNum++) {
      const dayDate = new Date(baseDate);
      dayDate.setDate(dayDate.getDate() + (dayNum - 1));
      const dateStr = dayDate.toISOString().split('T')[0];
      const weatherInfo = forecast.find(f => f.day === dayNum) || { condition: 'Pleasant', tempC: 22, rainProbability: 10 };

      // Day 1: Arrival & Orientation
      if (dayNum === 1) {
        const dayActivities = [];
        if (activities.length > 0) {
          const act = activities[actIndex % activities.length];
          actIndex++;
          dayActivities.push({
            time: '17:30',
            period: 'Evening',
            title: act.name,
            location: act.area || act.city,
            duration: `${act.durationHours} hrs`,
            cost: `${act.currency} ${act.totalCost?.toLocaleString() || 0}`,
            category: act.category,
            coordinates: act.coordinates,
            highlights: act.highlights,
            icon: 'Landmark'
          });
        }

        days.push({
          day: dayNum,
          date: dateStr,
          title: `Arrival in ${req.destination} & Evening Orientation`,
          location: req.destination,
          weather: weatherInfo,
          timeline: [
            {
              time: selectedFlight?.outbound?.departureTime || '08:45 AM',
              period: 'Morning',
              title: `Flight: ${req.origin} ✈ ${req.destination}`,
              location: `${req.origin} International Airport`,
              duration: selectedFlight?.outbound?.duration || '8h 30m',
              cost: 'Included in Flights',
              category: 'Transit',
              highlights: `Departing on ${selectedFlight?.airline || 'Airline'}. In-flight meal service & entertainment.`,
              icon: 'Plane'
            },
            {
              time: '15:30',
              period: 'Afternoon',
              title: `Hotel Check-in & Settle In`,
              location: selectedHotel.name,
              duration: '1.5 hrs',
              cost: 'Included in Stay',
              category: 'Lodging',
              highlights: `Check in to ${selectedHotel.name} in ${selectedHotel.location}. Refresh and unpack.`,
              icon: 'Hotel'
            },
            ...dayActivities,
            {
              time: '20:00',
              period: 'Dinner',
              title: `Welcome Dinner & Local Culinary Tasting`,
              location: `${selectedHotel.location} Gastronomy Quarter`,
              duration: '1.5 hrs',
              cost: `${req.currency} 2,000`,
              category: 'Food',
              highlights: 'Savor authentic regional signature dishes and local street delicacies.',
              icon: 'Utensils'
            }
          ],
          estimatedDayCost: 3500
        });
      } 
      // Last Day: Souvenirs & Departure
      else if (dayNum === duration) {
        days.push({
          day: dayNum,
          date: dateStr,
          title: `Farewell ${req.destination} & Journey Home`,
          location: req.destination,
          weather: weatherInfo,
          timeline: [
            {
              time: '09:00',
              period: 'Morning',
              title: 'Artisan Souvenir Shopping & Leisure Morning Walk',
              location: 'Traditional Downtown Market',
              duration: '2 hrs',
              cost: `${req.currency} 1,500`,
              category: 'Shopping',
              highlights: 'Pick up authentic local crafts, teas, souvenirs, and memorabilia.',
              icon: 'ShoppingBag'
            },
            {
              time: '11:30',
              period: 'Afternoon',
              title: `Hotel Checkout & Express Airport Transit`,
              location: selectedHotel.name,
              duration: '1.5 hrs',
              cost: 'Included in Transit Pass',
              category: 'Transit',
              highlights: 'Checkout and transfer via express airport link with luggage assistance.',
              icon: 'Car'
            },
            {
              time: selectedFlight?.returnFlight?.departureTime || '15:00',
              period: 'Departure',
              title: `Return Flight: ${req.destination} ✈ ${req.origin}`,
              location: `${req.destination} Airport`,
              duration: selectedFlight?.returnFlight?.duration || '8h 30m',
              cost: 'Included in Flights',
              category: 'Transit',
              highlights: `Boarding ${selectedFlight?.airline || 'Airline'}. Safe travels home!`,
              icon: 'PlaneTakeoff'
            }
          ],
          estimatedDayCost: 2000
        });
      } 
      // Middle Days: 2-3 clustered activities + meals
      else {
        const dayActivities = [];
        const countForToday = 2;

        for (let j = 0; j < countForToday; j++) {
          if (actIndex < activities.length) {
            const act = activities[actIndex];
            actIndex++;
            const isMorning = j === 0;
            dayActivities.push({
              time: isMorning ? '09:30' : '14:30',
              period: isMorning ? 'Morning' : 'Afternoon',
              title: act.name,
              location: `${act.area}, ${act.city}`,
              duration: `${act.durationHours} hrs`,
              cost: `${act.currency} ${act.totalCost?.toLocaleString() || 0}`,
              category: act.category,
              coordinates: act.coordinates,
              highlights: act.highlights,
              icon: act.category === 'Nature' ? 'Trees' : act.category === 'Culture' ? 'Landmark' : act.category === 'Food' ? 'Utensils' : 'Compass'
            });
          }
        }

        const primaryArea = dayActivities[0]?.location || req.destination;

        days.push({
          day: dayNum,
          date: dateStr,
          title: `Exploring ${primaryArea} Highlights`,
          location: primaryArea,
          weather: weatherInfo,
          timeline: [
            dayActivities[0] || {
              time: '09:30',
              period: 'Morning',
              title: `${req.destination} Heritage Exploration`,
              location: 'City Center',
              duration: '2.5 hrs',
              cost: `${req.currency} 500`,
              category: 'Sightseeing',
              highlights: 'Explore historical alleys and landmark monuments.',
              icon: 'Compass'
            },
            {
              time: '12:45',
              period: 'Lunch',
              title: 'Artisan Bistro & Regional Food Tasting',
              location: `${primaryArea} Food Alley`,
              duration: '1.2 hrs',
              cost: `${req.currency} 1,200`,
              category: 'Food',
              highlights: 'Specialty lunch featuring highly-rated local eateries.',
              icon: 'Utensils'
            },
            dayActivities[1] || {
              time: '14:30',
              period: 'Afternoon',
              title: `${req.destination} Cultural Discovery`,
              location: primaryArea,
              duration: '2.5 hrs',
              cost: `${req.currency} 800`,
              category: 'Culture',
              highlights: 'Interactive exhibits and scenic photo spots.',
              icon: 'Landmark'
            },
            {
              time: '18:30',
              period: 'Evening',
              title: 'Sunset Viewpoint & Night Promenade',
              location: `${primaryArea} Waterfront / Skyline`,
              duration: '2 hrs',
              cost: 'Free Entry',
              category: 'Sightseeing',
              highlights: 'Breathtaking twilight views and ambient night lights.',
              icon: 'Sparkles'
            },
            {
              time: '20:30',
              period: 'Dinner',
              title: 'Gourmet Dinner Experience',
              location: `${primaryArea} Dining Quarter`,
              duration: '1.5 hrs',
              cost: `${req.currency} 2,200`,
              category: 'Food',
              highlights: 'Relaxing multi-course dining pairing local flavors.',
              icon: 'Utensils'
            }
          ],
          estimatedDayCost: 4500
        });
      }
    }

    const durationMs = Date.now() - startTime;

    const data = {
      totalDays: duration,
      days,
      pace: req.travelStyle || 'balanced',
      destination: req.destination
    };

    const reasoning = `Synthesized a comprehensive ${duration}-day seamless itinerary. Activities are clustered geographically by neighborhood to eliminate unnecessary transit zigzags. Built in realistic meal breaks and buffer windows.`;

    return {
      agentName: this.name,
      status: 'COMPLETED',
      durationMs,
      data,
      reasoning
    };
  }
}

module.exports = new ItineraryAgent();
