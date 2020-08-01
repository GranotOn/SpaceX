import React, { useEffect, useState } from "react";
import { Breadcrumbs, Typography, Link } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import FlightIcon from "@material-ui/icons/Flight";
import { Glide } from "react-glide";
import "react-glide/lib/reactGlide.css";
import Countdown from "react-countdown";
import Fade from "react-reveal/Fade";
import moment from "moment";
import TrackVisibility from "react-on-screen";
import "./Launch.css";

import api from "../../Api/SpaceX";

//TODO "D"
//TODO Add email subscription if status is tbd
export default function Launch({ match, location }) {
  const launchId = match.params.id; //Launch ID from params
  const [error, setError] = useState(""); //API error handler
  const [launch, setLaunch] = useState({}); //Raw launch object from api
  const [images, setImages] = useState([]); //Array of all flight-images
  const [status, setStatus] = useState(null); //Mission status (success, failure, tbd)
  const [details, setDetails] = useState(""); //Mission details summary
  const [youtube, setYoutube] = useState(false); //Handle youtube video link
  const url = `https://api.spacexdata.com/v3/launches/${launchId}`;

  /**
   * Callback for 'api' error.
   */
  const errorHandler = (error) => {
    if (!error) return;
    setError(`Unable to retrieve launch '${launchId}'`);
  };

  /**
   * Handle data from launch:
   * 1) create images array for glidejs
   * 2) manage status (failed/success/upcoming)
   * 3) set iframe youtube
   * 4) set details for mission (because might be null)
   */
  const handleLaunch = (data) => {
    if (error || !data) return;

    //Create images array
    data.links.flickr_images.forEach((image) => {
      setImages((prevImages) => [...prevImages, image]);
    });

    //Manage status
    if (data.upcoming) {
      //Launch is yet to happen
      const differenceInMiliseconds = -moment().diff(
        data.launch_date_utc,
        "miliseconds"
      );
      setStatus(
        <div className="mid mb-2">
          <Countdown date={Date.now() + differenceInMiliseconds} />
          <hr color="dodgerBlue"></hr>
        </div>
      );
    } else {
      //Launch already happend
      setStatus(
        <div className={"mid mb-2"}>
          {data.launch_success ? "Launch was successful" : "Launch had failed"}
          <hr color={data.launch_success ? "green" : "red"}></hr>
        </div>
      );
    }

    //Handle youtube IFRAME
    if (!data.links.video_link) {
      setYoutube(false);
    } else {
      setYoutube(
        <iframe
          title={data.mission_name}
          src={`https://www.youtube.com/embed/${data.links.youtube_id}`}
          width="500"
          height="350"
          id="launch-youtube"
        ></iframe>
      );
    }

    //Handle details
    if (!data.details) {
      setDetails("No details were provided for this mission");
    } else {
      setDetails(data.details);
    }
  };
  /**
   * useEffect once fetch data, if not goto errorHandler as a callback.
   */
  useEffect(() => {
    api(url, errorHandler).then((data) => {
      console.log(data);
      setLaunch(data);
      handleLaunch(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Faded component (launch-data)
   * Might export to different file
   */
  const FadeComponent = (props) => {
    return (
      <div className="launch-data">
        <Fade center>
          <div id="status">{status}</div>
        </Fade>
        <Fade left>
          <div className="details">
            <h3>{details}</h3>
            <hr></hr>
          </div>
        </Fade>
        <Fade right>
          <>
            {youtube ? (
              <div className="align-right mb-2 mt-1" id="launch-youtube-parent">
                {youtube}
              </div>
            ) : null}
          </>
        </Fade>
        <Fade left>
          <h2>D</h2>
        </Fade>
      </div>
    );
  };

  return error ? (
    <h1>{error}</h1>
  ) : (
    <>
      <div className="launch-container">
        <div className="launch-header mb-2">
          <h1 className="launch-name">
            #{launchId}: {launch.mission_name}
          </h1>
          <img
            src={
              (launch.links && launch.links.mission_patch) ||
              "https://images.pexels.com/users/avatars/3362/spacex-361.png?w=256&h=256&fit=crop&auto=compress"
            }
            alt="mission-patch"
            className="launch-patch"
          />
        </div>
      </div>
      <div className="launch-breadcrumbs">
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/" className="home-crumb">
            <HomeIcon className="home-crumb-icon" />
            <span className="vivid"> Home</span>
          </Link>
          <Typography color="inherit" className="flight-crumb">
            <FlightIcon className="flight-crumb-icon" />
            <span className="dull">Launch {launchId}</span>
          </Typography>
        </Breadcrumbs>
      </div>
      <div className="launch-body mb-2">
        {images.length >= 2 ? (
          <>
            <Glide
              height={500}
              width={500}
              autoPlay={true}
              autoPlaySpeed={2000}
              infinite={true}
              className="launch-glider"
            >
              {images.map((image) => (
                <div key={image}>
                  <img src={image} className="launch-image mt-2" alt="flicker" />
                </div>
              ))}
            </Glide>
            <hr></hr>
          </>
        ) : null}

        <TrackVisibility offset={5000}>
          <FadeComponent />
        </TrackVisibility>
      </div>
    </>
  );
}
