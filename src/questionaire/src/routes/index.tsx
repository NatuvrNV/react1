import { createFileRoute } from "@tanstack/react-router";
import { QuestionnaireApp } from "@/questionnaire/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Metaguise: Begin Your Facade Journey" },
      { name: "description", content: "India's leading metal facade partner. Share your project brief and our design team will respond within 24 hours." },
      { property: "og:title", content: "Metaguise: Begin Your Facade Journey" },
      { property: "og:description", content: "Every iconic building begins with an unforgettable facade." },
    ],
  }),
  component: Index,
});

function Index() {
  return <QuestionnaireApp />;
}
