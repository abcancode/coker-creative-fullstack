import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown, Check } from "lucide-react";

import "./analytics.css";

import { useAnalytics } from "../../context/AnalyticsContext";

const options = [
  {
    value: "today",
    label: "Today",
  },
  {
    value: "7d",
    label: "Last 7 Days",
  },
  {
    value: "30d",
    label: "Last 30 Days",
  },
  {
    value: "thisMonth",
    label: "This Month",
  },
  {
    value: "lastMonth",
    label: "Last Month",
  },
  {
    value: "lifetime",
    label: "Lifetime",
  },
];

function AnalyticsDateFilter() {
  const { range, changeRange } = useAnalytics();

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const selectedOption =
    options.find((option) => option.value === range) || options[2];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown with Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelect = (value) => {
    changeRange(value);
    setIsOpen(false);
  };

  return (
    <div
      className={`analytics-date-filter ${isOpen ? "is-open" : ""}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className="analytics-date-filter-trigger"
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <CalendarDays
          className="analytics-date-filter-icon"
          size={18}
          strokeWidth={1.8}
        />

        <span className="analytics-date-filter-value">
          {selectedOption.label}
        </span>

        <ChevronDown
          className={`analytics-date-filter-chevron ${isOpen ? "is-open" : ""}`}
          size={16}
          strokeWidth={2}
        />
      </button>

      {isOpen && (
        <div
          className="analytics-date-filter-menu"
          role="listbox"
          aria-label="Analytics date range"
        >
          {options.map((option) => {
            const isSelected = option.value === range;

            return (
              <button
                key={option.value}
                type="button"
                className={`analytics-date-filter-option ${
                  isSelected ? "is-selected" : ""
                }`}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={isSelected}
              >
                <span>{option.label}</span>

                {isSelected && (
                  <Check
                    size={16}
                    strokeWidth={2}
                    className="analytics-date-filter-check"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AnalyticsDateFilter;
