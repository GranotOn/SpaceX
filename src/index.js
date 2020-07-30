import React from "react";
import ReactDOM from "react-dom";
import Particles from "react-particles-js";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <Particles
      canvasClassName="background"
      height={window.outerHeight}
      params={{
        particles: {
          number: {
            value: 180,
            density: {
              enable: true,
              value_area: 1500,
            },
          },
          line_linked: {
            enable: true,
            opacity: 0.02,
          },
          move: {
            direction: "right",
            speed: 0.1,
          },
          size: {
            value: 1,
          },
          opacity: {
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.05,
            },
          },
        },
        interactivity: {
          events: {
            onclick: {
              enable: true,
              mode: "push",
            },
          },
          modes: {
            push: {
              particles_nb: 1,
            },
          },
        },
        retina_detect: true,
      }}
    />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
