"use client";

import { useEffect, useState } from "react";
import { useMatchColumns, MatchData } from "./columns";
import { API_URL } from "../../constants/constants";
import { MenuBar } from "@/components/navigation-bars";
import { useSearchParams } from "react-router-dom";
import { DataTable } from "./data-table";

export default function Matches() {
  const [data, setData] = useState<MatchData[]>([]);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    searchParams;
    fetch(`${API_URL}/matches/?` + searchParams)
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

  const transformedData = data ? data : [];

  console.log("transformedData: " + transformedData);
  return (
    <>
      <MenuBar />
      <div>{searchParams.get("player_uuid")}</div>
      <div className="container-wrapper">
        <div className="container mx-auto py-10">
          <DataTable
            columns={useMatchColumns()}
            data={transformedData ? transformedData : []}
          />
        </div>
      </div>
    </>
  );
}
