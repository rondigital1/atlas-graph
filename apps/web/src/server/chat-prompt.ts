import type { TripPlan } from "@atlas-graph/core";

function serializeTripPlan(plan: TripPlan): string {
  const lines: string[] = [
    `Destination: ${plan.destinationSummary}`,
    `Style: ${plan.tripStyleSummary}`,
    `Rationale: ${plan.rationale}`,
    "",
  ];

  if (plan.warnings.length > 0) {
    lines.push("Warnings:");
    for (const w of plan.warnings) {
      lines.push(`- ${w}`);
    }
    lines.push("");
  }

  if (plan.practicalNotes.length > 0) {
    lines.push("Practical Notes:");
    for (const n of plan.practicalNotes) {
      lines.push(`- ${n}`);
    }
    lines.push("");
  }

  for (const day of plan.days) {
    lines.push(`## Day ${day.dayNumber} — ${day.date} — ${day.theme}`);

    const slots = [
      { label: "Morning", activities: day.morning },
      { label: "Afternoon", activities: day.afternoon },
      { label: "Evening", activities: day.evening },
    ];

    for (const slot of slots) {
      if (slot.activities.length > 0) {
        lines.push(`### ${slot.label}`);
        for (const a of slot.activities) {
          lines.push(`- **${a.title}**: ${a.description}`);
        }
      }
    }

    lines.push("");
  }

  if (plan.topRecommendations.length > 0) {
    lines.push("## Top Recommendations");
    for (const rec of plan.topRecommendations) {
      lines.push(`- **${rec.name}**: ${rec.reason}`);
    }
  }

  return lines.join("\n");
}

export function buildChatSystemPrompt(
  tripPlan: TripPlan,
  destination: string
): string {
  return `You are AtlasGraph, a knowledgeable and friendly travel assistant.

The user is discussing their planned trip to ${destination}. Below is their complete itinerary:

${serializeTripPlan(tripPlan)}

Instructions:
- Help them with questions about their trip, destination info, local tips, packing advice, cultural notes, transportation, food recommendations, and anything travel-related.
- When answering, reference specific days, activities, and recommendations from their itinerary when relevant.
- Use markdown formatting: **bold** for emphasis, bullet lists for tips, and headers for sections.
- Be concise but thorough. Give practical, actionable advice.
- If they ask about changing their itinerary, suggest specific modifications referencing the day numbers and activities above.`;
}

export function buildGeneralChatSystemPrompt(): string {
  return `You are AtlasGraph, a knowledgeable and friendly travel assistant.

The user hasn't selected a specific trip yet. They may ask general travel questions, destination comparisons, packing tips, visa info, or anything travel-related.

Instructions:
- Provide helpful, practical travel advice.
- Use markdown formatting: **bold** for emphasis, bullet lists for tips, and headers for sections.
- Be concise but thorough. Give actionable recommendations.
- If they mention a specific destination, share your knowledge about it including best times to visit, must-see attractions, local customs, food to try, and practical tips.`;
}
