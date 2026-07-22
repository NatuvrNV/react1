import { useState } from "react";
import { PrimaryButton, StepHeading, StickyFooter, OptionRow } from "../primitives";
import { useQuestionnaire } from "../context";
import { SplitLayout } from "../SplitLayout";

import imgDefault from "@/assets/facade-default.jpg";
import iconicAsset from "@/assets/aesthetic/iconic.jpg.asset.json";
import minimalAsset from "@/assets/aesthetic/minimal.jpg.asset.json";
import contemporaryAsset from "@/assets/aesthetic/contemporary.jpg.asset.json";
import artisticAsset from "@/assets/aesthetic/artistic.jpg.asset.json";
import contextualAsset from "@/assets/aesthetic/contextual.jpg.asset.json";
import fluidAsset from "@/assets/aesthetic/fluid.jpg.asset.json";
import monolithicAsset from "@/assets/aesthetic/monolithic.webp.asset.json";
import futuristicAsset from "@/assets/aesthetic/futuristic.jpg.asset.json";
import refinedAsset from "@/assets/aesthetic/refined.jpg.asset.json";
import valueDrivenAsset from "@/assets/aesthetic/value-driven.jpg.asset.json";
import oneOfAKindAsset from "@/assets/aesthetic/one-of-a-kind.jpg.asset.json";
import texturalAsset from "@/assets/aesthetic/textural.jpg.asset.json";

const STYLES: { key: string; label: string; img?: string }[] = [
  { key: "iconic", label: "Iconic", img: iconicAsset.url },
  { key: "refined", label: "Old Money", img: refinedAsset.url },
  { key: "minimal", label: "Japandi", img: minimalAsset.url },
  { key: "contemporary", label: "Contemporary", img: contemporaryAsset.url },
  { key: "artistic", label: "Avant-garde", img: artisticAsset.url },
  { key: "contextual", label: "Contextual", img: contextualAsset.url },
  { key: "value-driven", label: "Functional", img: valueDrivenAsset.url },
  { key: "one-of-a-kind", label: "One of a kind", img: oneOfAKindAsset.url },
  { key: "fluid", label: "Classic", img: fluidAsset.url },
  { key: "monolithic", label: "Brutalist", img: monolithicAsset.url },
  { key: "futuristic", label: "Neo-futurist", img: futuristicAsset.url },
  { key: "textural", label: "Maximalist", img: texturalAsset.url },
];

export function Aesthetic() {
  const { answers, setAnswer, next } = useQuestionnaire();
  const [hover, setHover] = useState<string | null>(null);

  const activeKey = hover ?? answers.facadeStyle ?? null;
  const active = STYLES.find((s) => s.key === activeKey);
  const imageSrc = active?.img ?? imgDefault;
  const imageKey = active?.img ? active.key : "aesthetic-default";

  return (
    <SplitLayout imageKey={imageKey} imageSrc={imageSrc}>
      <div className="space-y-6">
        <StepHeading
          kicker="Step 06: Aesthetic Resonance"
          title="What's your facade vision?"
        />
        <div className="grid grid-cols-2 gap-2">
          {STYLES.map((s, i) => (
            <OptionRow
              key={s.key}
              index={i}
              label={s.label}
              selected={answers.facadeStyle === s.key}
              onHover={() => setHover(s.key)}
              onClick={() => setAnswer("facadeStyle", s.key)}
            />
          ))}
        </div>
      </div>
      <StickyFooter>
        <PrimaryButton disabled={!answers.facadeStyle} onClick={next}>Continue</PrimaryButton>
      </StickyFooter>
    </SplitLayout>
  );
}
