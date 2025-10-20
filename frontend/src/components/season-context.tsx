import { createContext, useContext, useEffect, useState } from "react";

type SeasonParams = {
  year: number;
  id: number;
};

type SeasonContextType = {
  season: SeasonParams | null;
  setSeason: (season: SeasonParams) => void;
};

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

export const SeasonProvider = ({ children }: { children: React.ReactNode }) => {
  const [season, setSeasonState] = useState<SeasonParams | null>(null);

  // Load season from localStorage when the component mounts
  useEffect(() => {
    const storedSeason = localStorage.getItem("preferredSeason");
    console.log("storedSeason" + storedSeason);
    if (storedSeason) {
      setSeasonState(JSON.parse(storedSeason));
    }
  }, []);

  const setSeason = (season: SeasonParams) => {
    setSeasonState(season);
    console.log("Set storedSeason" + JSON.stringify(season));
    localStorage.setItem("preferredSeason", JSON.stringify(season));
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
