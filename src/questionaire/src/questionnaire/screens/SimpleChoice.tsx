import { useState } from "react";
import { SplitLayout } from "../SplitLayout";
import { OptionRow, PrimaryButton, StepHeading, StickyFooter } from "../primitives";
import { useQuestionnaire } from "../context";

import imgScaleAccentAsset from "@/assets/scale/accent.jpg.asset.json";
import imgScaleBoutiqueAsset from "@/assets/scale/boutique.jpg.asset.json";
import imgScaleMidAsset from "@/assets/scale/mid.jpg.asset.json";
import imgScaleLargeAsset from "@/assets/scale/large.jpg.asset.json";
import imgScaleLandmarkAsset from "@/assets/scale/landmark.jpg.asset.json";
import imgTimelineConceptAsset from "@/assets/timeline/concept.jpg.asset.json";
import imgTimelineVizAsset from "@/assets/timeline/viz.jpg.asset.json";
import imgTimelineTenderAsset from "@/assets/timeline/tender.jpg.asset.json";
import imgTimelineConstructionAsset from "@/assets/timeline/construction.jpg.asset.json";
import imgTimelineRenovationAsset from "@/assets/timeline/renovation.jpg.asset.json";
import imgEngagement from "@/assets/engagement-scope.jpg";
import engagementVideoAsset from "@/assets/step8.mp4.asset.json";

const imgTimelineConcept = imgTimelineConceptAsset.url;
const imgTimelineViz = imgTimelineVizAsset.url;
const imgTimelineTender = imgTimelineTenderAsset.url;
const imgTimelineConstruction = imgTimelineConstructionAsset.url;
const imgTimelineRenovation = imgTimelineRenovationAsset.url;

const imgScaleAccent = imgScaleAccentAsset.url;
const imgScaleBoutique = imgScaleBoutiqueAsset.url;
const imgScaleMid = imgScaleMidAsset.url;
const imgScaleLarge = imgScaleLargeAsset.url;
const imgScaleLandmark = imgScaleLandmarkAsset.url;

export function Scale() {
  const { answers, setAnswer, next } = useQuestionnaire();
  const [hover, setHover] = useState<string | null>(null);
  const options = [
    { key: "accent", label: "Accent: Under 1,000 sqft", img: imgScaleAccent },
    { key: "boutique", label: "Boutique: Under 3,000 sqft", img: imgScaleBoutique },
    { key: "mid", label: "Premium Mid-Scale: 3,000 to 10,000 sqft", img: imgScaleMid },
    { key: "large", label: "Large Scale: 10,000 to 30,000 sqft", img: imgScaleLandmark },
    { key: "landmark", label: "Landmark/Mega Project: 30,000 sqft and above", img: imgScaleLarge },
  ];
  const activeKey = hover ?? answers.scale;
  const activeImg = options.find((o) => o.key === activeKey)?.img ?? imgScaleAccent;
  return (
    <SplitLayout imageKey={activeKey ?? "scale"} imageSrc={activeImg} caption="From boutique to landmark">
      <div className="space-y-6">
        <StepHeading
          kicker="Step 05: Project Scale"
          title={<>What is the approximate surface area of your facade?</>}
        />
        <div className="grid grid-cols-2 gap-2">
          {options.map((o, i) => (
            <OptionRow
              key={o.key}
              index={i}
              label={o.label}
              selected={answers.scale === o.key}
              onHover={() => setHover(o.key)}
              onClick={() => setAnswer("scale", o.key)}
            />
          ))}
        </div>
      </div>
      <StickyFooter>
        <PrimaryButton disabled={!answers.scale} onClick={next}>Continue</PrimaryButton>
      </StickyFooter>
    </SplitLayout>
  );
}

export function Timeline() {
  const { answers, setAnswer, next } = useQuestionnaire();
  const [hover, setHover] = useState<string | null>(null);
  const options = [
    { key: "concept", label: "Concept Design", img: imgTimelineConcept },
    { key: "viz", label: "3D Visualization Ready", img: imgTimelineViz },
    { key: "tender", label: "Tendering Stage", img: imgTimelineTender },
    { key: "construction", label: "Under Construction", img: imgTimelineConstruction },
    { key: "renovation", label: "Renovation/Facade Upgrade", img: imgTimelineRenovation },
  ];
  const activeKey = hover ?? answers.timeline;
  const activeImg = options.find((o) => o.key === activeKey)?.img ?? imgTimelineConcept;
  const assetOptions: { key: "yes" | "no"; label: string }[] = [
    { key: "yes", label: "Yes" },
    { key: "no", label: "No" },
  ];
  return (
    <SplitLayout imageKey={activeKey ?? "timeline"} imageSrc={activeImg} caption="The right moment to engage">
      <div className="space-y-6">
        <StepHeading
          kicker="Step 07: Project Lifecycle"
          title="What stage is your project currently in?"
        />
        <div className="grid grid-cols-2 gap-2">
          {options.map((o, i) => (
            <OptionRow
              key={o.key}
              index={i}
              label={o.label}
              selected={answers.timeline === o.key}
              onHover={() => setHover(o.key)}
              onClick={() => setAnswer("timeline", o.key)}
            />
          ))}
        </div>
        <div className="space-y-3 border-t border-border/60 pt-5">
          <div className="text-[11px] uppercase tracking-[0.28em] text-foreground/60">
            Do you have any 3D renders or architectural drawings?
          </div>
          <div className="grid grid-cols-2 gap-2">
            {assetOptions.map((o, i) => (
              <OptionRow
                key={o.key}
                index={i}
                label={o.label}
                selected={answers.hasAssets === o.key}
                onClick={() => setAnswer("hasAssets", o.key)}
              />
            ))}
          </div>
        </div>
      </div>
      <StickyFooter>
        <PrimaryButton disabled={!answers.timeline || !answers.hasAssets} onClick={next}>Continue</PrimaryButton>
      </StickyFooter>
    </SplitLayout>
  );
}

export function Engagement() {
  const { answers, setAnswer, next } = useQuestionnaire();
  const options = [
    { key: "immediate", label: "Immediate" },
    { key: "next-month", label: "Next month" },
    { key: "design-only", label: "Would like to engage on design, though civil is not ready yet" },
    { key: "other", label: "Other" },
  ];
  const isOther = answers.engagement === "other";
  const canContinue = !!answers.engagement && (!isOther || (answers.engagementOther ?? "").trim().length > 0);
  return (
    <SplitLayout imageKey="engagement" imageSrc={imgEngagement} videoSrc={engagementVideoAsset.url} caption="From concept to skyline">
      <div className="space-y-6">
        <StepHeading
          kicker="Step 08: Engagement Timing"
          title="How soon would you like to engage Metaguise in your project?"
        />
        <div className="grid grid-cols-1 gap-2">
          {options.map((o, i) => (
            <OptionRow
              key={o.key}
              index={i}
              label={o.label}
              selected={answers.engagement === o.key}
              onClick={() => setAnswer("engagement", o.key)}
            />
          ))}
          {isOther && (
            <textarea
              autoFocus
              value={answers.engagementOther ?? ""}
              onChange={(e) => setAnswer("engagementOther", e.target.value)}
              placeholder="Please share your timing..."
              rows={3}
              className="mt-1 w-full rounded-md border border-border bg-card/40 px-4 py-3 text-[14px] text-foreground outline-none transition focus:border-[color:var(--accent)] focus:bg-card focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_18%,transparent)]"
            />
          )}
        </div>
      </div>
      <StickyFooter>
        <PrimaryButton disabled={!canContinue} onClick={next}>Continue</PrimaryButton>
      </StickyFooter>
    </SplitLayout>
  );
}
