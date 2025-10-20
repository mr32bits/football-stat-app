import {
  useState,
  useRef,
  JSX,
  ChangeEventHandler,
  HTMLAttributes,
  Ref,
  ChangeEvent,
} from "react";
import "./styles.css";
import { Input } from "../ui/input";
import React from "react";

interface Handles extends HTMLAttributes<HTMLInputElement> {}

interface Props {
  className?: string;
  placeholder?: string;
  regexMap: { regex: RegExp; className: string }[];
  value: string;
  onValueChange: (value: string) => void;
}
const MarkingInput = React.forwardRef<Handles, Props>(
  ({ className, regexMap, value, onValueChange, ...props }, ref) => {
    const highlightRef = useRef<HTMLDivElement | null>(null);

    const syncScroll = (e: React.UIEvent<HTMLDivElement>) => {
      if (highlightRef.current) {
        highlightRef.current.scrollTop = e.currentTarget.scrollTop;
        highlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
      }
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onValueChange(e.target.value);
    };

    const highlightText = (text: string) => {
      const elements: JSX.Element[] = [];
      let lastIndex = 0;

      // Combine all regexes into one pattern
      const combinedRegex = new RegExp(
        regexMap.map(({ regex }) => regex.source).join("|"),
        "gi"
      );

      for (const match of text.matchAll(combinedRegex)) {
        const matchText = match[0];
        const matchIndex = match.index ?? 0;

        // Add normal text before match
        if (lastIndex < matchIndex) {
          elements.push(
            <span key={lastIndex} className="text-primary">
              {text.slice(lastIndex, matchIndex)}
            </span>
          );
        }

        // Find the matching rule (reset regex state)
        const matchedRule = regexMap.find(({ regex }) =>
          new RegExp(regex.source, "gi").test(matchText)
        );

        // Ensure matchText is always wrapped
        elements.push(
          <span key={matchIndex} className={`${matchedRule?.className ?? ""}`}>
            {matchText}
          </span>
        );

        lastIndex = matchIndex + matchText.length;
      }

      // Add remaining normal text
      if (lastIndex < text.length) {
        elements.push(
          <span key={lastIndex} className="text-primary">
            {text.slice(lastIndex)}
          </span>
        );
      }

      return elements;
    };

    return (
      <div className={`input-container relative h-9 w-[250px] ${className}`}>
        <Input
          placeholder={props.placeholder}
          value={value}
          onChange={handleChange}
          onScroll={syncScroll}
          className="absolute w-full z-10 py-2 inset-0 text-transparent caret-primary"
        />
        <div
          ref={highlightRef}
          className="input-renderer h-9 absolute text-base md:text-sm inset-0 flex py-2 px-3 whitespace-pre overflow-x-auto border-transparent border select-none pointer-events-none"
          aria-hidden="true"
        >
          {highlightText(value)}
        </div>
      </div>
    );
  }
);
export { MarkingInput };
