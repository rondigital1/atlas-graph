import { describe, expect, it } from "vitest";

import {
  buildTripRequestFromForm,
  PlannerFormValidationError,
} from "./planner-form-request";
import type { PlannerFormState } from "./types";

function createValidFormState(): PlannerFormState {
  return {
    destination: "Lisbon, Portugal",
    endDate: "2026-06-18",
    prompt: "Focus on food, walkable neighborhoods, and a relaxed pace.",
    selections: {
      accommodation: ["boutique"],
      budget: ["moderate"],
      constraints: ["walkable"],
      destinationType: ["city"],
      flightPreference: ["best-overall"],
      interests: ["food", "art"],
      travelPace: ["fast-paced"],
      tripType: ["couple"],
    },
    startDate: "2026-06-12",
  };
}

describe("buildTripRequestFromForm", () => {
  it("requires destination, dates, and canonical selection fields", () => {
    expect.assertions(2);

    try {
      buildTripRequestFromForm({
        ...createValidFormState(),
        destination: "",
        endDate: "",
        startDate: "",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(PlannerFormValidationError);
      expect((error as PlannerFormValidationError).issues).toEqual([
        "Enter a destination.",
        "Choose a start date.",
        "Choose an end date.",
      ]);
    }
  });

  it("maps budget and travel pace into the backend enums", () => {
    const request = buildTripRequestFromForm(createValidFormState());

    expect(request).toMatchObject({
      budget: "medium",
      groupType: "couple",
      travelStyle: "packed",
    });
  });

  it("rejects unsupported traveler types", () => {
    expect.assertions(2);

    try {
      buildTripRequestFromForm({
        ...createValidFormState(),
        selections: {
          ...createValidFormState().selections,
          tripType: ["business"],
        },
      });
    } catch (error) {
      expect(error).toBeInstanceOf(PlannerFormValidationError);
      expect((error as PlannerFormValidationError).issues).toContain(
        "Choose who is traveling."
      );
    }
  });

  it("aggregates, dedupes, and caps interests deterministically", () => {
    const request = buildTripRequestFromForm({
      ...createValidFormState(),
      selections: {
        accommodation: ["hotel", "boutique", "airbnb"],
        budget: ["luxury"],
        constraints: ["walkable", "remote-work", "kid-friendly"],
        destinationType: ["nightlife", "beach", "luxury"],
        flightPreference: ["best-overall", "premium-cabin"],
        interests: ["nightlife", "food", "architecture", "nature"],
        travelPace: ["balanced"],
        tripType: ["friends"],
      },
    });

    expect(request.interests).toEqual([
      "Nightlife",
      "Food & Dining",
      "Architecture",
      "Nature",
      "Beach",
      "Luxury",
      "Walkable",
      "Remote Work",
      "Kid Friendly",
      "Hotel",
    ]);
  });

  it("rejects invalid date ordering", () => {
    expect.assertions(2);

    try {
      buildTripRequestFromForm({
        ...createValidFormState(),
        endDate: "2026-06-10",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(PlannerFormValidationError);
      expect((error as PlannerFormValidationError).issues).toContain(
        "endDate must be on or after startDate"
      );
    }
  });
});
