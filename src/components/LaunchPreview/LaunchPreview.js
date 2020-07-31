import { Button, Grow, Fab } from "@material-ui/core";
import NavigationIcon from "@material-ui/icons/Navigation";
import Countdown from "react-countdown";
import React, { useState, useEffect } from "react";
import moment from "moment";
import "./LaunchPreview.css";

export default function LaunchPreview(launch) {
  const l = launch.launch; //Get formatted launch.
  const [difference, setDifference] = useState(0); //Difference in time between now and the launch.
  const [youtube, setYoutube] = useState(false); //Toggel youtube iframe display.

  /**
   * If launch is in the future we want a timer and not failed or something.
   * So we need to check each launch when the component is loaded.
   */
  useEffect(() => {
    //Check if launch already happend (for timer)
    setDifference(-moment().diff(l.launch_date, "miliseconds"));
  }, [l.launch_date]);

  /**
   * Toggle youtube iFrame display.
   */
  const toggleYoutube = () => {
    setYoutube(!youtube);
  };

  return (
    <div className="launch">
      <div className="extend-lanunch">
        <Fab
          variant="extended"
          size="small"
          color="primary"
          aria-label="add"
          onClick={() => window.location.replace(`/${l.id}`)}
        >
          <NavigationIcon />
        </Fab>
      </div>
      <div className="launch-header">
        <h1>
          #{l.id} {l.name} ({l.year})
        </h1>
      </div>
      {difference < 0 ? (
        <div className={"mb-1" + !l.success ? "false" : "true"}>
          {!l.success ? "Failed" : "Success"}
        </div>
      ) : (
        <div className="status">
          <Countdown date={Date.now() + difference} />{" "}
        </div>
      )}
      <div className="launch-patch">
        <img alt="launch-patch" src={l.patch}></img>
      </div>
      <div className="launch-details">
        <h3>{l.details}</h3>
      </div>
      <div className="launch-options">
        <div className="launch-buttons">
          <Button
            component="span"
            variant="contained"
            color="secondary"
            onClick={toggleYoutube}
          >
            Youtube
          </Button>
          <Button
            component="span"
            variant="contained"
            color="primary"
            onClick={() => window.open(l.wikipedia)}
          >
            Wikipedia
          </Button>
        </div>
        <Grow in={youtube}>
          <iframe
            className={!youtube ? "hidden" : "mt-1"}
            width="420"
            height="315"
            title={l.name}
            src={l.youtube}
          ></iframe>
        </Grow>
      </div>
      <hr className="mb-2"></hr>
    </div>
  );
}
