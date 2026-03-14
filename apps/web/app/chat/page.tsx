import { Header } from "../components/header";
import { createPlanningRunQueryService } from "../../src/server/create-planning-run-query-service";
import { createChatTripCardsViewModel } from "../../src/server/chat-view-models";
import { ChatPageShell } from "./components/chat-page-shell";

export default async function ChatPage() {
  const service = createPlanningRunQueryService();
  let trips = createChatTripCardsViewModel([]);

  try {
    const runs = await service.listRecentRuns();
    trips = createChatTripCardsViewModel(runs);
  } catch {
    // Trips unavailable — chat still works in general mode
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <ChatPageShell trips={trips} />
    </div>
  );
}
