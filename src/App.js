import React, { useState, useEffect } from "react";
import api from "./SpaceX.js";
import Main from "./components/Main/Main";
import Display from "./components/Display/Display";
import "./app.css";

//TODO Specific launch page
//TODO Email subscription for upcoming launches
//TODO Twitter API for latest tweet?
function App() {
  const limit = 5; //Limit launches for apis
  const [launches, setLaunches] = useState([]); //Each object in array will display.
  const [offset, setOffset] = useState(0); //SpaceX offset (skip) query
  const [extras, setExtras] = useState(""); //AKA API url params
  const [loading, setLoading] = useState(false); //To prevent api spam (scrolling)
  const [shouldScroll, setShouldScroll] = useState(true); //Is this tab scrollable.
  const [totalFlights, setTotalFlights] = useState(0); //How many flights are there (pagination).
  const [allFlights, setAllFlights] = useState([]); //Name of all flights (search).
  let spaceXApi = `https://api.spacexdata.com/v3/launches${extras}`;

  /**
   * Setting total flights for search input box. 
   * Should get called only on first useEffect() when page loads.
   */
  const allFlightsHandler = (data) => {
    setTotalFlights(data.length);

    for (const entry in data) {
      var flight = {
        name: data[entry].mission_name,
        id: entry.toString(),
      };
      setAllFlights((prevFlights) => {
        return [...prevFlights, flight];
      });
    }
  };

  /**
   * Manage search input position on scroll.
   */
  const searchHandler = (offset) => {
    const search = document.getElementById("auto-complete");
    if (offset < 266) { //move freely
      search.classList.add("fixed");
      search.style.position = "fixed";
    } else if (offset >= 266) { //stick it
      search.classList.remove("fixed");
      search.style.position = "sticky";
    }
  };

  /**
   * Manage tab(s) scrolling width.
   */
  const tabsHandler = (offset) => {
    const tabs = document.getElementById("app-bar");
    if (window.innerWidth < 1140) return; //under 1140px width looks bad
    if (offset > 0 && !tabs.classList.contains("shrink")) {
      tabs.classList.add("shrink");
    } else if (offset === 0) {
      tabs.classList.remove("shrink");
    }
  };

  /**
   * onScroll event handler.
   */
  const scrollHandler = (e) => {
    const offset = window.pageYOffset;
    searchHandler(offset);
    tabsHandler(offset);
  };

   /**
    * Loadmore sets extra to relevent pagination settings.
    */
  const loadMore = () => {
    const prevOffset = offset;
    setExtras((prevExtras) => {
      return prevExtras.replace(
        `offset=${prevOffset}`,
        `offset=${launches.length}`
      );
    });
    setOffset(launches.length);
  };

  /**
   * Hasmore checks if 1) a fetch is occuring already
   * 2) if it's a scrollable tab 3) if there are more launches to paginate
   */
  const hasMore = () => {
    return !loading && shouldScroll && totalFlights - launches.length > 0;
  };

  /**
   * First useEffect.
   * Used to retrive all flights (names & id's)
   * for the search input box.
   */
  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    setLoading(true);
    api(spaceXApi).then((res) => {
      allFlightsHandler(res);
      setExtras(`?limit=${limit}&offset=${offset}`);
    });
    setLoading(false);
  }, []);

  /**
   * Second useEffect.
   * Main useEffect for switching tabs (launch types) or scrolling.
   */
  useEffect(() => {
    if (loading === false && extras !== "") {
      setLoading(true);
      api(spaceXApi).then((res) => {
        if (shouldScroll) { //Scrollable tab.
          setLaunches((prevLaunches) => {
            if (prevLaunches.length > 0) { //Concat previous launches if exist.
              return prevLaunches.concat(res);
            }
            return res; //If no previous launches exist setLaunch(res).
          });
        } else { //Non scrollable tab.
          setLaunches(res);
        }
      });
      setLoading(false);
    }
  }, [extras]);

  return (
    <div className="container">
      <div className="header">
        <img
          src="https://www.elonx.net/wp-content/uploads/DM-2-300x300.png"
          alt="rocket"
        ></img>
        <div className="main">
          <Main
            setShouldScroll={setShouldScroll.bind(this)}
            setExtras={setExtras.bind(this)}
            setLaunches={setLaunches.bind(this)}
            setOffset={setOffset.bind(this)}
            offset={offset}
            limit={limit}
            allFlights={allFlights}
            totalFlights={totalFlights}
          />
        </div>
      </div>
      <Display
        launches={launches}
        loadMore={loadMore.bind(this)}
        hasMore={hasMore.bind(this)}
        loading={loading}
      />
    </div>
  );
}

export default App;
