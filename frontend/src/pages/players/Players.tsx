"use client";

import { useEffect, useState } from "react";
import { usePlayerColumns } from "./columns";
import { DataTable } from "./data-table";
import { API_URL } from "../../constants/constants";
import { MenuBar } from "@/components/navigation-bars";

export type PlayersStats = {
  id: number;
  player_uuid: string;
  player_name: string;
  matches_played: number;
  goals_scored: number;
  own_goals_scored: number;
};

export default function Players() {
  const [data, setData] = useState<PlayersStats[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/players/stats/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        setData(data);
      })
      .catch((error) => console.error("API Fetch Error:", error));
  }, []);

  return (
    <>
      <MenuBar />
      <div className="container-wrapper">
        <div className="container mx-auto py-10">
          <DataTable columns={usePlayerColumns()} data={data} />
        </div>
      </div>
    </>
  );
}
