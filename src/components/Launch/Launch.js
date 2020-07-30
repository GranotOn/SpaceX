import React, { useEffect, useState } from "react";
import { Breadcrumbs, Typography, Link, Card } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import FlightIcon from "@material-ui/icons/Flight";
import "./Launch.css";

import api from "../../SpaceX";

export default function Launch({ match, location }) {
  const launchId = match.params.id; //launch ID from params
  const [error, setError] = useState(""); //API error handler
  const [launch, setLaunch] = useState({});
  const url = `https://api.spacexdata.com/v3/launches/${launchId}`;

  /**
   * Callback for 'api' error.
   */
  const errorHandler = (error) => {
    if (!error) return;
    console.log(error);
    setError(`Unable to retrieve launch '${launchId}'`);
  };

  /**
   * useEffect once fetch data, if not goto errorHandler as a callback.
   */
  useEffect(() => {
    api(url, errorHandler).then((data) => {
      console.log(data);
      setLaunch(data);
    });
  }, []);

  return error ? (
    <h1>{error}</h1>
  ) : (
    <div className="launch">
      <Breadcrumbs aria-label="breadcrumb" className="launch-breadcrumbs">
        <Link color="inherit" href="/" className="home-crumb">
          <HomeIcon className="home-crumb-icon" />
          Home
        </Link>
        <Typography color="inherit" className="flight-crumb">
          <FlightIcon className="flight-crumb-icon" />
          Launch: {launchId}
        </Typography>
      </Breadcrumbs>
      <Card className="launch-card"></Card>
    </div>
  );
}
