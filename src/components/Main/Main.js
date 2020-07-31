import React, { useState } from "react";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import AutoComplete from "./AutoComplete/AutoComplete";
import "./Main.css";
export default function Main({
  setShouldScroll,
  setExtras,
  setLaunches,
  setOffset,
  offset,
  limit,
  allFlights,
}) {
  const [tab, setTab] = useState(0); //Tab handler

  /**
   * onChange(tab) basically. Each change accompinies a change in the
   * API params, so 'Extras' needs to be adjusted.
   */
  const handleChange = (event, newTab) => {
    if (newTab !== tab) {
      setOffset(0);
      setLaunches([]);
      switch (newTab) {
        case 0: // All Launches
          setExtras(`?limit=${limit}&offset=${offset}`);
          setShouldScroll(true);
          break;
        case 1: // Upcoming launches
          setExtras(`/upcoming?limit=${limit}&offset=${offset}`);
          setShouldScroll(false);
          break;
        case 2: // Latest launch
          setExtras(`/latest`);
          setShouldScroll(false);
          break;
        case 3: // Next launch
          setShouldScroll(false);
          setExtras("/next");
          break;
        default:
          break;
      }
    }
    setTab(newTab);
  };

  return (
    <>
      <div className="app-bar" id="app-bar">
        <AppBar position="static" style={{ background: "#222121" }}>
          <Tabs
            id="tabs"
            value={tab}
            onChange={handleChange}
            aria-label="api scrollable auto tabs"
            variant="scrollable"
            indicatorColor="primary"
            scrollButtons="auto"
          >
            <Tab label="All" />
            <Tab label="Upcoming" />
            <Tab label="Latest" />
            <Tab label="Next" />
          </Tabs>
        </AppBar>
      </div>

      <form autoComplete="off">
        <div className="auto-complete" id="auto-complete">
          <div className="search-launch">
            <AutoComplete
              allFlights={allFlights}
            />
          </div>
        </div>
      </form>
    </>
  );
}
