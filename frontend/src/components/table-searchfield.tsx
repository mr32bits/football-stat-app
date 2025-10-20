import i18next from "i18next";
import { MarkingInput } from "./Input/marking-input";
import { HoverCard } from "./ui/hover-card";
import { JSX } from "react";

export function TableSearchField({
  highlight_rules,
  filter,
  setFilter,
  infoHoverCard,
  addElement,
  deleteElement,
}: {
  filter: string;
  setFilter: (value: string) => void;
  infoHoverCard: React.ReactElement<typeof HoverCard>;
  addElement: JSX.Element;
  deleteElement: JSX.Element;
  highlight_rules: { regex: RegExp; className: string }[];
}) {
  return (
    <div className="flex justify-between items-center gap-x-2 py-4">
      <MarkingInput
        placeholder={i18next.t("Search...")}
        regexMap={highlight_rules}
        value={filter}
        onValueChange={setFilter}
        className="flex-1 flex gap-x-1"
      />
      {infoHoverCard}
      {addElement}
      {deleteElement}
    </div>
  );
}
