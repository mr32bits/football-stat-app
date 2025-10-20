"use client";

import { useEffect, useState } from "react";
import { PlayerData, columns } from "./columns";
import { DataTable } from "./data-table";
import { API_URL } from "../../constants/constants";
import { MenuBar } from "@/components/navigation-bars";

export default function Players() {
  const [data, setData] = useState<PlayerData[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/players`) // Call Flask API
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data); // Log successful API response
        setData(data);
      })
      .catch((error) => console.error("API Fetch Error:", error));
  }, []);

  return (
    <>
      <MenuBar />
      <div className="container-wrapper">
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}
