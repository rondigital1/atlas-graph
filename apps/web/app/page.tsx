import { Header } from "./components/header";
import { PlannerForm } from "./components/planner-form";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <PlannerForm />
      </main>
    </div>
  );
}
