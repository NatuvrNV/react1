import { useEffect } from "react";
import { PrimaryButton, StepHeading, StickyFooter, OptionRow } from "../primitives";
import { useQuestionnaire } from "../context";
import { SplitLayout } from "../SplitLayout";

import imgArchitectAsset from "@/assets/role-architect.jpg.asset.json";
import imgDeveloperAsset from "@/assets/role-developer.jpg.asset.json";
import imgOwnerAsset from "@/assets/role-owner.jpg.asset.json";
import imgContractorAsset from "@/assets/role-contractor.jpg.asset.json";
import imgConsultantAsset from "@/assets/role-consultant.jpg.asset.json";
import imgOtherAsset from "@/assets/role-other.jpg.asset.json";
import imgDefault from "@/assets/role-default.jpg";

const imgArchitect = imgArchitectAsset.url;
const imgDeveloper = imgDeveloperAsset.url;
const imgOwner = imgOwnerAsset.url;
const imgContractor = imgContractorAsset.url;
const imgConsultant = imgConsultantAsset.url;
const imgOther = imgOtherAsset.url;

const ROLES = [
  { key: "Architect", label: "Architect", img: imgArchitect, caption: "Shaping the design language" },
  { key: "Real Estate Developer", label: "Real Estate Developer", img: imgDeveloper, caption: "Scaling vision into skylines" },
  { key: "End User/Owner", label: "End User/Owner", img: imgOwner, caption: "A facade for your own world" },
  { key: "Main Contractor", label: "Main Contractor", img: imgContractor, caption: "Executing with precision" },
  { key: "Facade Consultant", label: "Facade Consultant", img: imgConsultant, caption: "Engineering the envelope" },
  { key: "Other", label: "Other", img: imgOther, caption: "Tell us your role" },
];

export function Role() {
  const { answers, setAnswer, next } = useQuestionnaire();

  useEffect(() => {
    if (!answers.role) {
      setAnswer("role", ROLES[0].key);
    }
  }, []);

  const active = ROLES.find((r) => r.key === answers.role);
  const imgSrc = active?.img ?? imgDefault;
  const imgKey = active?.key ?? "default";
  return (
    <SplitLayout imageKey={imgKey} imageSrc={imgSrc} caption={active?.caption}>
      <div className="space-y-6">
        <StepHeading
          kicker="Step 04: Your Role"
          title="What is your role in this project?"
          sub="Select the description that best fits you."
        />
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((r, i) => (
            <OptionRow
              key={r.key}
              index={i}
              label={r.label}
              thumb={r.img}
              thumbClassName="hidden md:block"
              selected={answers.role === r.key}
              onClick={() => setAnswer("role", r.key)}
            />
          ))}
        </div>
        {answers.role === "Other" && (
          <input
            autoFocus
            type="text"
            value={answers.roleOther ?? ""}
            onChange={(e) => setAnswer("roleOther", e.target.value)}
            placeholder="Please specify your role"
            className="h-12 w-full rounded-md border border-border bg-card/40 px-4 text-[14px] text-foreground outline-none transition focus:border-[color:var(--accent)] focus:bg-card focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_18%,transparent)]"
          />
        )}
      </div>
      <StickyFooter>
        <PrimaryButton
          disabled={!answers.role || (answers.role === "Other" && !answers.roleOther?.trim())}
          onClick={next}
        >
          Continue
        </PrimaryButton>
      </StickyFooter>
    </SplitLayout>
  );
}
