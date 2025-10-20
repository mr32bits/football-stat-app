import i18next from "i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      Name: "Name",

      Delete: "Delete",
      Cancel: "Cancel",
      Saving: "Saving...",
      SaveChanges: "Save changes",

      Goals: "Goals",
      Goal_one: "goal",
      Goal_other: "goals",

      "Own Goals": "Own Goals",
      "Attended Games": "Attended Games",
      "Search...": "Search...",

      Player: "Player",
      Players: "Players",
      NumberOfPlayers: "Number of Players",

      "Match Date": "Match Day",

      Match: "Match",
      Matches_one: "Match",
      Matches_other: "Matches",

      Season: "Season",
      "Match Result": "Match Result",
      "Match Results": "Match Results",

      Examples: "Examples",
      ColumnFilter: "Column Filters",
      ColumnFilterInfo: "Search for data using column filters.",

      MenuBar: {
        Players: {
          New: "New Player",
          Open: "Open Players",
        },
        Matches: { New: "New Match", Open: "Open Matches" },
        File: {},
      },
      PlayerPage: {
        Edit: "Edit player",
        EditInfo:
          "Make changes to the player '{{name}}' here. Click save when you're done.",

        Delete_one: "Delete player",
        Delete_other: "Delete {{count}} players",
        DeleteInfo_zero: "No player was selected.",
        DeleteInfo_one:
          "This action cannot be undone. This will permanently delete player '{{name}}}' and remove him from all matches, but will not change the results of the matches.",
        DeleteInfo_other:
          "This action cannot be undone. This will permanently delete the selected players and remove them from all matches, but will not change the results of the matches.",
        AddNewPlayer: "Create new player",
        AddNewPlayerInfo:
          "Create a new Player here. Click save when you're done.",
      },
      MatchPage: {
        Edit: "Edit match",
        EditInfo:
          "Make changes to the match '{{name}}' here. Click save when you're done.",

        Delete_one: "Delete match",
        Delete_other: "Delete {{count}} matches",
        DeleteInfo_zero: "No Match was selected.",
        DeleteInfo_one:
          "This action cannot be undone. This will permanently delete match '{{name}}}'.",
        DeleteInfo_other:
          "This action cannot be undone. This will permanently delete the selected matches.",
        AddNewMatch: "Create new match",
        AddNewMatchInfo:
          "Create a new match here. Click save when you're done.",
      },

      Pagination: {
        Selected: "{{value}} of {{length}} selected Rows",
        RowPerPage: "Rows per page:",
        Page: "Page {{value}} of {{length}}",
      },

      Error: {
        PlayerNotFound: "ERROR: Player Not Found!",
        PageNotFound: { Message: "Oops! Page was not found!", Back: "Back" },
        NoSeason: "ERROR: Seasons Not Found!",
        InvalidDate: "Invalid Date",
      },
      Warning: {
        NoResults: "No results.",
      },
    },
  },
  de: {
    translation: {
      Name: "Name",

      Delete: "Löschen",
      Cancel: "Abbrechen",
      Saving: "Speichern...",
      SaveChanges: "Änderungen Speichern",

      Goals: "Tore",
      Goal_one: "Tor",
      Goal_other: "Tore",

      "Own Goals": "Eigentore",
      "Attended Games": "Anzahl Spiele",
      Wins: "Siege",
      Draws: "Remis",
      Losses: "Niederlagen",
      "Match Date": "Spieltag",

      "Search...": "Suchen...",
      Player: "Spieler:in",
      Players: "Spieler",
      NumberOfPlayers: "Anzahl Spieler",

      Match: "Spiel",
      //Matches: "Spiele",
      Matches_one: "Spiel",
      Matches_other: "Spiele",
      Season: "Saison",
      "Match Result": "Spielergebnis",
      "Match Results": "Spielergebnisse",

      Examples: "Beispiele",
      ColumnFilter: "Spaltenfilter",
      ColumnFilterInfo: "Suche nach Daten mithilfe von Spaltenfiltern.",
      MenuBar: {
        Players: {
          New: "Neuer Spieler",
          Open: "Öffne Spieler",
        },
        Matches: { New: "Neues Spiel", Open: "Öffne Spiele" },
        File: {},
      },
      PlayerPage: {
        Edit: "Spieler bearbeiten",
        EditInfo:
          "Nehmen Sie hier Änderungen an dem Spieler '{{name}}' vor. Klicken Sie auf speichern, wenn Sie fertig sind.",
        Delete_one: "Spieler Löschen",
        Delete_other: "Lösche {{count}} Spieler",
        DeleteInfo_zero: "Kein Spieler wurde ausgewählt.",
        DeleteInfo_one:
          "Diese Aktion kann nicht rückgängig gemacht werden. Dadurch wird der Spieler:in '{{name}}' dauerhaft gelöscht und aus allen Spielen entfernt, jedoch bleiben die Ergebnisse der Spiele unverändert.",
        DeleteInfo_other:
          "Diese Aktion kann nicht rückgängig gemacht werden. Dadurch werden die ausgewählten Spieler:innen dauerhaft gelöscht und aus allen Spielen entfernt, jedoch bleiben die Ergebnisse der Spiele unverändert.",
        AddNewPlayer: "Erstelle neuen Spieler",
        AddNewPlayerInfo:
          "Erstelle hier einen neuen Spieler. Drücken Sie auf Speichern, wenn Sie fertig sind..",
      },
      MatchPage: {
        Edit: "Spiel bearbeiten",
        EditInfo:
          "Nehmen Sie hier Änderungen an dem Spiel '{{name}}' vor. Klicken Sie auf speichern, wenn Sie fertig sind.",

        Delete_one: "Spiel Löschen",
        Delete_other: "Lösche {{count}} Spiele",
        DeleteInfo_zero: "Kein Spiel wurde ausgewählt.",
        DeleteInfo_one:
          "Diese Aktion kann nicht rückgängig gemacht werden. Dadurch wird das Spiel '{{name}}' dauerhaft gelöscht.",
        DeleteInfo_other:
          "Diese Aktion kann nicht rückgängig gemacht werden. Dadurch werden die ausgewählten Spiele dauerhaft gelöscht.",
        AddNewMatch: "Erstelle neues Spiel",
        AddNewMatchInfo:
          "Erstelle hier ein neues Spiel. Drücken Sie auf Speichern, wenn Sie fertig sind..",
      },

      Pagination: {
        Selected: "{{value}} von {{length}} ausgewählte Reihen",
        RowPerPage: "Reihen pro Seite:",
        Page: "Seite {{value}} von {{length}}",
      },

      Error: {
        PlayerNotFound: "FEHLER: Spieler nicht Gefunden!",
        MatchNotFound: "FEHLER: Spiel nicht Gefunden!",
        NoSeason: "FEHLER: Saisons nicht gefunden!",
        InvalidDate: "Ungültiges Datum",

        PageNotFound: {
          Message: "Oops! Seite wurde nicht gefunden",
          Back: "Zurück",
        },
      },
      Warning: {
        NoResults: "Kein Ergebnis.",
      },
    },
  },
};
function getLanguage() {
  const locale = new Intl.Locale(navigator.language);
  console.log(locale);
  switch (locale.language) {
    case "de":
      i18n.changeLanguage("de");
      break;

    case "en":
      i18n.changeLanguage("en");
      break;
    default:
      i18n.changeLanguage("en");
      console.log("Language " + locale + "not found! Changed to English");
      break;
  }
  console.log(i18next.language);
}
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    //lng: "de", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    fallbackLng: "en",
    keySeparator: ".",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

getLanguage();

export default i18n;
