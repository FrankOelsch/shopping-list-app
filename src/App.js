import {useEffect, useState, useRef} from "react";
import Food from "./components/Food";
import styled from "styled-components";
import MyColorPicker from "./components/ColorPicker";

function setToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFromLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error(error.message);
  }
}

function App() {
  const langStrings = {
    AppName: {de: "Meine Einkaufsliste", en: "My Shopping List"},
    Suche: {de: "Suche", en: "Search"},
    Zuletzt: {de: "Zuletzt gekauft", en: "Recently used"},
    Obst: {de: "Obst & Gemüse", en: "Fruits & Vegetables"},
    Brot: {de: "Brot & Gebäck", en: "Bread & Pastries"},
    Farbe1: {de: "Einkaufsliste", en: "Shopping List"},
    Farbe2: {de: "Zuletzt Gekauft", en: "Recent Used"},
    Farbe3: {de: "Such-Ergebnisse", en: "Search Results"},
  };

  const [searchString, setSearchString] = useState("");
  const [checked, setChecked] = useState(false);
  const [foods, setFoods] = useState(getFromLocalStorage("Foods") ?? []);
  const searchInput = useRef(null);

  const [colorCart, setColorCart] = useState("#BDECB6");
  const [colorRecent, setColorRecent] = useState("#E6D690");
  const [colorResults, setColorResults] = useState("#E6D690");

  // searchInput.current.focus();

  useEffect(() => {
    if (foods && foods.length > 0) {
      return;
    } else {
      fetch("https://fetch-me.vercel.app/api/shopping/items")
        .then((response) => response.json())
        .then((response) =>
          setFoods(response.data.map((item) => ({...item, active: false, recent: false})))
        );
    }
  }, []);

  useEffect(() => {
    setToLocalStorage("Foods", foods);
  }, [foods]);

  const {search} = require("fast-fuzzy");

  function handleChangeSearch(e) {
    setSearchString(e.target.value);
  }

  function handleToggle(e) {
    console.log("toggleSelect: " + e.target.id);

    setFoods(foods.map((food) => {
      if (food._id === e.target.id) {
        return {
          ...food,
          active: !food.active,
          recent: true,
        };
      } else {
        return food;
      }
    }));

    setSearchString("");
  }

  function handleChangeLang(e) {
    setChecked(!checked);
  }

  console.log("render");

  return (
    <MainContainer>
      <LanguageDiv>
        deutsch
        <label className="switch">
          <input
            type="checkbox"
            value="en"
            checked={checked}
            onChange={handleChangeLang}
          />
          <span className="slider round"></span>
        </label>
        english
      </LanguageDiv>

      <h1>{checked ? langStrings.AppName.en : langStrings.AppName.de}</h1>

      <Collapse open>
        <summary>{checked ? langStrings.Obst.en : langStrings.Obst.de}</summary>
        <section className="cart">
          {foods.filter((item) => item.active && item.category._ref === "c2hvcHBpbmcuY2F0ZWdvcnk6MA==").map((e) => (
            <Food
              key={e._id}
              id={e._id}
              name={checked ? e.name.en : e.name.de}
              onSelect={handleToggle}
              active={e.active}
              color={colorCart}
            ></Food>
          ))}
        </section>
      </Collapse>

      <Collapse open>
        <summary>{checked ? langStrings.Brot.en : langStrings.Brot.de}</summary>
        <section className="cart">
          {foods.filter((item) => item.active && item.category._ref === "c2hvcHBpbmcuY2F0ZWdvcnk6MQ==").map((e) => (
            <Food
              key={e._id}
              id={e._id}
              name={checked ? e.name.en : e.name.de}
              onSelect={handleToggle}
              active={e.active}
              color={colorCart}
            ></Food>
          ))}
        </section>
      </Collapse>

      <StyledInput
        className="search"
        id="searchInput"
        onChange={handleChangeSearch}
        value={searchString}
        type="text"
        ref={searchInput}
        placeholder={checked ? langStrings.Suche.en : langStrings.Suche.de}
      ></StyledInput>

      {(searchString === "") && <Collapse open>
        <summary>{checked ? langStrings.Zuletzt.en : langStrings.Zuletzt.de}</summary>
        <section className="recent">
          {foods.filter((item) => item.recent).map((e) => (
            <Food
              key={e._id}
              id={e._id}
              name={checked ? e.name.en : e.name.de}
              onSelect={handleToggle}
              active={e.active}
              color={colorRecent}
            ></Food>
          ))}
        </section>
      </Collapse>}

      <section className="shop">
        {search(searchString, foods, {
          keySelector: (obj) => (checked ? obj.name.en : obj.name.de),
          threshold: .6,
        }).filter((item) => !item.active).map((e) => (
          <Food
            key={e._id}
            id={e._id}
            name={checked ? e.name.en : e.name.de}
            onSelect={handleToggle}
            active={e.active}
            color={colorResults}
          ></Food>
        ))}
      </section>

      <h1>Test ColorPicker</h1>

      <label htmlFor="colpick1">
        {checked ? langStrings.Farbe1.en : langStrings.Farbe1.de}
      </label>
      <MyColorPicker
        id="colpick1"
        langEn={checked}
        setColorOut={setColorCart}
        defaultColor={{ral: "6019",
          rgb: "189-236-182",
          id: "#BDECB6",
          name: "Weißgrün",
          en: "Pastel green",}}
      ></MyColorPicker>
      <label htmlFor="colpick2">
        {checked ? langStrings.Farbe2.en : langStrings.Farbe2.de}
      </label>
      <MyColorPicker
        id="colpick2"
        langEn={checked}
        setColorOut={setColorRecent}
        defaultColor={{ral: "1015",
          rgb: "230-214-144",
          id: "#E6D690",
          name: "Hellelfenbein",
          en: "Light ivory",}}
      ></MyColorPicker>
      <label htmlFor="colpick3">
        {checked ? langStrings.Farbe3.en : langStrings.Farbe3.de}
      </label>
      <MyColorPicker
        id="colpick3"
        langEn={checked}
        setColorOut={setColorResults}
        defaultColor={{ral: "7035",
          rgb: "203-208-204",
          id: "#CBD0CC",
          name: "Lichtgrau",
          en: "Light grey",}}
      ></MyColorPicker>

    </MainContainer>
  );
}

const MainContainer = styled.main`
  text-align: center;
  font-size: 18px;
  padding: 3px 5px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;

  h1 {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 20px;
  }

  .cart,
  .shop,
  .recent {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
    flex-direction: row;
    flex-wrap: wrap;
    min-height: 40px;
    padding: 5px;
    margin-bottom: 10px;
  }


  /* switch */
  .switch {
    position: relative;
    display: inline-block;
    width: 46px;
    height: 23px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #2196f3;
    transition: 0.2s;
    border-radius: 22px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.2s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #2196f3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    transform: translateX(22px);
  }
`

const LanguageDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
`
const Collapse = styled.details`
  align-self: flex-start;
  text-align: left;
  margin-left: 5px;
`

const StyledInput = styled.input`
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 18px;
    width: 50%;
    color: #155e99;
    margin-bottom: 10px;
    border-radius: 8px;
    border: 3px solid #2196f3;
    padding: 3px;

  &:hover {
    border: 3px solid #155e99;
  }

  &:focus {
    border: 3px solid #155e99;
    outline: none;
  }
`

export default App;
