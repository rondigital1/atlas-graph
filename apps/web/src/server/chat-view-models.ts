import { getCountryFlag } from "../../app/lib/country-flags";
import { getDestinationBackground } from "../../app/lib/mock/destination-backgrounds";
import type { ChatTripCardViewModel } from "../../app/lib/types";
import type { PlanningRunSummary } from "./planning-run-query-service";
import {
  formatEnumLabel,
  formatTripDates,
  getRunStatusPresentation,
} from "./view-model-utils";

export function createChatTripCardsViewModel(
  runs: PlanningRunSummary[]
): ChatTripCardViewModel[] {
  return runs
    .filter((run) => run.status === "SUCCEEDED")
    .map((run) => {
      const status = getRunStatusPresentation(run.status);
      const destination = run.destination ?? "Untitled";

      return {
        id: run.id,
        destination,
        countryFlag: getCountryFlag(run.destination),
        tripDates: formatTripDates(run.startDate, run.endDate),
        backgroundUrl: getDestinationBackground(destination),
        budget: formatEnumLabel(run.budget),
        travelStyle: formatEnumLabel(run.travelStyle),
        statusLabel: status.label,
        statusTone: status.tone,
      };
    });
}
