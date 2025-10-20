"use client";

import { useEffect, useState } from "react";
import { columns, SeasonData } from "./columns";
import { API_URL } from "../../constants/constants";
//import ExampleTableWithSubRows from "./Test";
import { MenuBar } from "@/components/navigation-bars";
import { useSearchParams } from "react-router-dom";
import { DataTable } from "./data-table";

export default function Matches() {
  const [data, setData] = useState<SeasonData[]>([]);
  const [seasons, setSeasons] = useState<{ year: number; id: number }[]>([]);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    searchParams;
    fetch(`${API_URL}/matches?` + searchParams)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data);

        setData(data.matches); // Adjust based on API response
        setSeasons(data.seasons);
      })
      .catch((error) => console.error("API Fetch Error:", error));
  }, []);
  const transformedData = data
    .map((season) => {
      const s = seasons.find((s) => s.id === season.season_id)?.year;
      return season.matches.map((match) => ({
        ...match,
        season_id: season.season_id,
        season_year: s ? s : 0,
      }));
    })
    .flat();
  return (
    <>
      <MenuBar />
      <div>{searchParams.get("player_uuid")}</div>
      {console.log(transformedData)} {console.log(seasons[1])}
      <div className="container-wrapper">
        <div className="container mx-auto py-10">
          <DataTable
            columns={columns}
            data={transformedData ? transformedData : []}
          />

          {/*<ExampleTableWithSubRows data={data} seasons={seasons} />*/}
        </div>
      </div>
    </>
  );
}
