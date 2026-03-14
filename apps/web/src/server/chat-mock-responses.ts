const destinationResponses: Record<string, string> = {
  tokyo: `Great question about Tokyo! Here are some tips:

**Getting Around**
- Get a **Suica or Pasmo card** for seamless train/bus travel
- The **JR Yamanote Line** loops around all major areas
- Download the **Japan Transit** app for real-time navigation

**Food Tips**
- Visit **Tsukiji Outer Market** early morning for the freshest sushi
- Try **konbini** (convenience store) food — it's surprisingly excellent
- Ramen shops with vending machines at the entrance are often the best

**Cultural Notes**
- Bow when greeting — a slight nod is fine for tourists
- Remove shoes before entering homes, temples, and some restaurants
- Tipping is not customary and can be considered rude`,

  paris: `Here's what you should know about Paris:

**Must-Know Tips**
- Buy a **carnet of 10 metro tickets** for savings on transport
- Most museums are **free on the first Sunday** of each month
- Always say **"Bonjour"** when entering a shop — it's considered essential

**Food & Dining**
- Lunch **prix fixe menus** offer great value at quality restaurants
- Try a **croque monsieur** at a classic bistro
- The best croissants are at bakeries with **"Artisan Boulanger"** signs

**Practical Notes**
- Carry cash for small purchases — not everywhere takes cards
- The Seine is beautiful at **golden hour** — plan a walk or cruise then
- Book popular museums like the Louvre and Musée d'Orsay in advance`,

  rome: `Here are some essentials for Rome:

**Navigation Tips**
- Rome is very walkable — most major sites are within 30 min of each other
- Buy the **Roma Pass** for metro access and museum discounts
- Watch out for cobblestones — wear comfortable walking shoes

**Food Rules**
- Never order **cappuccino after 11am** — Italians consider it a morning drink
- Avoid restaurants right next to major tourist sites
- Try **supplì** (fried rice balls) — Rome's best street food

**Cultural Tips**
- Dress modestly for churches — shoulders and knees must be covered
- The Vatican is less crowded on **Wednesday mornings** during papal audiences
- Toss a coin in the **Trevi Fountain** with your right hand over your left shoulder`,
};

const genericResponse = `I'd be happy to help with your travel plans! Here are some general tips:

**Before Your Trip**
- Check visa requirements at least **3 months** before departure
- Register with your country's embassy for travel advisories
- Make copies of important documents (passport, insurance, bookings)

**Packing Essentials**
- A good **power adapter** for your destination
- Comfortable walking shoes that are already broken in
- A **packable day bag** for sightseeing

**During Your Trip**
- Keep a **paper map** as backup — phones can die at the worst times
- Learn basic phrases in the local language — locals appreciate the effort
- Try eating where locals eat — look for busy restaurants away from tourist areas

What destination would you like to know more about?`;

export function getMockChatResponse(
  destination: string | null,
): string {
  if (!destination) {
    return genericResponse;
  }

  const lower = destination.toLowerCase();

  for (const [keyword, response] of Object.entries(destinationResponses)) {
    if (lower.includes(keyword)) {
      return response;
    }
  }

  return `Here are some tips for your trip to **${destination}**:

**Before You Go**
- Research local customs and etiquette
- Check if you need any vaccinations or visas
- Download offline maps for navigation without data

**On the Ground**
- Try the local street food — it's often the most authentic experience
- Visit popular attractions early morning or late afternoon to avoid crowds
- Ask hotel staff for their personal restaurant recommendations

**Practical Tips**
- Keep some local currency on hand for small vendors
- Learn a few basic phrases in the local language
- Take photos of your hotel address in the local script for taxi drivers

Would you like to know something specific about ${destination}?`;
}
