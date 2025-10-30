import { StrictMode } from "react";
import "./i18n";

import App from "@/pages/App";
import Player from "@/pages/player/Player";
import Players from "@/pages/players/Players";
import Matches from "@/pages/matches/Matches";
import Match from "@/pages/match/Match";

import PageNotFound from "@/pages/PageNotFound";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "@/index.css";
import ProfileForm from "@/pages/test/Test.tsx";
import { ThemeProvider } from "@/components/theme-provider";
import { SeasonProvider } from "@/components/season-context";

export default function Main() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SeasonProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<App />} />
              <Route path="players" element={<Players />} />
              <Route path="player/:uuid" element={<Player />} />{" "}
              <Route path="matches" element={<Matches />} />
              <Route path="match/:match_uuid" element={<Match />} />
              <Route path="submit" element={<ProfileForm />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SeasonProvider>
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <Main />
  </StrictMode>
);
