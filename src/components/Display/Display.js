import React, { useState, useEffect } from "react";
import RingLoader from "react-spinners/RingLoader";

import useInfiniteScroll from "../../Hooks/useInfiniteScroll";
import LaunchPreview from "../LaunchPreview/LaunchPreview";
import "./Display.css";

export default function Display({ launches, loadMore, hasMore, loading }) {
  const [formatted, setFormatted] = useState([]); //Each object is a formatted launch for displaying on front-page.
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems); //Uses custom hook.

  /**
   * Prevent fetch spam.
   */
  function fetchMoreListItems() {
    setTimeout(() => {
      loadMore();
      setIsFetching(false);
    }, 2000);
  }

  /**
   * useEffect for calling formatHelper depending on the tab.
   */
  useEffect(() => {
    /**
     * 'LATEST' tab returns a single object
     * so there is a need to differntiate between cases here.
     */
    if (!launches) return;
    if (launches.flight_number !== undefined) {
      //Latest flight
      formatHelper(launches);
    } else {
      setFormatted([]);
      launches.forEach((launch) => {
        formatHelper(launch);
      });
    }
  }, [launches]);

  /**
   * Actual formating.
   */
  const formatHelper = (launch) => {
    if (launch.links === undefined) return;
    let currentLaunch = {};
    currentLaunch.id = launch.flight_number;
    currentLaunch.name = launch.mission_name;
    currentLaunch.year = launch.launch_year;
    currentLaunch.success = launch.launch_success;
    currentLaunch.details = launch.details;
    currentLaunch.patch =
      launch.links.mission_patch || launch.links.flickr_images[0];
    currentLaunch.wikipedia = launch.links.wikipedia;
    currentLaunch.launch_date = launch.launch_date_utc;
    currentLaunch.youtube = `https://www.youtube.com/embed/${launch.links.youtube_id}`;
    setFormatted((oldFormatted) => [...oldFormatted, currentLaunch]);
  };
  
  return (
    <div className="display">
      {!loading &&
        formatted.length > 0 &&
        formatted.map((launch) => (
          <LaunchPreview launch={launch} key={launch.id} />
        ))}
      {isFetching && hasMore() && (
        <div className="loader">
          <RingLoader color={"dodgerblue"} size={30} />{" "}
        </div>
      )}
    </div>
  );
}
