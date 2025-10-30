import { createContext, useContext, useEffect, useState } from "react";

type SeasonParams = {
  season_year: number;
  id: number;
};

type SeasonContextType = {
  season: SeasonParams | "All" | null;
  setSeason: (season: SeasonParams | "All") => void;
};

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

export const SeasonProvider = ({ children }: { children: React.ReactNode }) => {
  const [season, setSeasonState] = useState<SeasonParams | "All" | null>(null);

  // Load season from localStorage when the component mounts
  useEffect(() => {
    const storedSeason = localStorage.getItem("preferredSeason");
    if (storedSeason) {
      try {
        const parsed = JSON.parse(storedSeason);
        setSeasonState(parsed);
      } catch {
        // Handle plain string "All"
        if (storedSeason === "All") {
          setSeasonState("All");
        }
      }
    }
  }, []);

  const setSeason = (season: SeasonParams | "All") => {
    setSeasonState(season);
    console.log("Set storedSeason" + JSON.stringify(season));
    localStorage.setItem(
      "preferredSeason",
      typeof season === "string" ? season : JSON.stringify(season)
    );
  };

  return (
    <SeasonContext.Provider value={{ season, setSeason }}>
      {children}
    </SeasonContext.Provider>
  );
};

export const useSeason = () => {
  const context = useContext(SeasonContext);
  if (!context) {
    throw new Error("useSeason must be used within a SeasonProvider");
  }
  return context;
};
