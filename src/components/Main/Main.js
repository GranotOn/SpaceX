import React, { useState } from "react";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import "./Main.css";
export default function Main({
  setShouldScroll,
  setExtras,
  setLaunches,
  setOffset,
  offset,
  limit,
  allFlights,
  totalFlights,
}) {
  const [tab, setTab] = useState(0); //Tab handler
  const [searchValue, setSearchValue] = useState("");

  /**
   * searchHandler queries allFlights
   */
  const searchHandler = (e) => {
    //Filter array
    const userInput = e.target.value;
    const filtered = allFlights.filter((flight) =>
      flight.name.toLowerCase().includes(userInput.toLowerCase())
    );

    //Set value as input
    setSearchValue(userInput);

    //Close previous search
    closeLists();

    const input = document.getElementById("auto-complete"); //input parent div
    var list = document.createElement("DIV"); //new list
    list.setAttribute("id", "autocomplete-list");
    list.setAttribute("class", "autocomplete-list");

    //Create items for each filtered element
    filtered.forEach((flight) => {
      var node = document.createElement("DIV");
      node.setAttribute("class", "autocomplete-item");
      node.setAttribute("id", `${parseInt(flight.id) + 1}`);
      node.innerHTML = `<strong>${flight.name}</strong>`;
      list.appendChild(node);

      //On click node
      node.addEventListener("click", () => {
        setSearchValue(flight.name);
        console.log(`${flight.name} id: ${node.getAttribute("id")}`);
      });
    });
    input.appendChild(list);

    //Arrow traveling
    var currentFocus = -1; // Focused div
    const search = document.getElementById("search-launch");

    const addActive = (activeNode) => {
      if (activeNode === undefined) {
        //If we traveled to last/first node
        currentFocus = currentFocus <= 1 ? 1 : list.children.length - 1;
        return;
      }
      //Remove "active" from previous selection
      list.childNodes.forEach((node) => {
        node.classList.remove("active");
      });
      //Add active to current node
      activeNode.classList.add("active");
    };
    search.addEventListener("keydown", (event) => {
      if (event.keyCode === 40) {
        // DOWN arrow
        ++currentFocus;
        addActive(list.children[currentFocus]);
      } else if (event.keyCode === 38) {
        //UP arrow
        --currentFocus;
        addActive(list.children[currentFocus]);
      } else if (event.keyCode === 13) {
        //ENTER key
        event.preventDefault(); //Prevent form submitting
        if (currentFocus >= 0) list.children[currentFocus].click();
      }
    });
  };

  /**
   * Close lists (every button press in input creates one).
   */
  const closeLists = () => {
    const x = document.getElementsByClassName("autocomplete-list");
    for (let i = 0; i < x.length; ++i) {
      x[i].parentNode.removeChild(x[i]);
    }
  };

  /**
   * Listeners to close autocomplete
   */
  document.addEventListener("click", closeLists);
  document.addEventListener("scroll", (e) => {
    if (window.pageYOffset >= 300) closeLists();
  });
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
            <input
              id="search-launch"
              type="text"
              name="search-launch"
              value={searchValue}
              plachholder="Search launch"
              onChange={searchHandler}
            />
            <span className="fas fa-search"></span>
          </div>
        </div>
      </form>
    </>
  );
}
