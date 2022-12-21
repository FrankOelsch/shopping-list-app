import {useEffect, useState, useRef} from "react";
import Food from "./components/Food";
import styled from "styled-components";
import MyColorPicker from "./components/ColorPicker";
import {RalColorsLimited} from "./data/RalColors";

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

  const [foodColors, setFoodColors] = useState(getFromLocalStorage("FoodColors") ?? {
    cart: "#BDECB6",
    recent: "#E6D690",
    results: "#CBD0CC"});

  // searchInput.current.focus();

  useEffect(() => {
    if (!foods || foods.length < 1) {
      fetch("https://fetch-me.vercel.app/api/shopping/items")
        .then((response) => response.json())
        .then((response) =>
          setFoods(response.data.map((item) => ({...item,
            active: false, recent: false, date: Date.now()})))
        );
    }
  }, []);

  useEffect(() => {
    setToLocalStorage("Foods", foods);
  }, [foods]);

  useEffect(() => {
    setToLocalStorage("FoodColors", foodColors);
  }, [foodColors]);

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
          date: Date.now(),
        };
      } else {
        return food;
      }
    }));

    setSearchString("");
  }

  function handleChangeLang() {
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
        <section>
          {foods.filter((item) => item.active && item.category._ref === "c2hvcHBpbmcuY2F0ZWdvcnk6MA==")
            .sort((a, b) => a.date - b.date)
            .map((e) => (
            <Food
              key={e._id}
              id={e._id}
              name={checked ? e.name.en : e.name.de}
              onSelect={handleToggle}
              active={e.active}
              color={foodColors.cart}
            ></Food>
          ))}
        </section>
      </Collapse>

      <Collapse open>
        <summary>{checked ? langStrings.Brot.en : langStrings.Brot.de}</summary>
        <section>
          {foods.filter((item) => item.active && item.category._ref === "c2hvcHBpbmcuY2F0ZWdvcnk6MQ==")
            .sort((a, b) => a.date - b.date)
            .map((e) => (
            <Food
              key={e._id}
              id={e._id}
              name={checked ? e.name.en : e.name.de}
              onSelect={handleToggle}
              active={e.active}
              color={foodColors.cart}
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
        <section>
          {foods.filter((item) => item.recent && !item.active)
            .sort((a, b) => b.date - a.date)
            .map((e) => (
            <Food
              key={e._id}
              id={e._id}
              name={checked ? e.name.en : e.name.de}
              onSelect={handleToggle}
              active={e.active}
              color={foodColors.recent}
            ></Food>
          ))}
        </section>
      </Collapse>}

      <section>
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
            color={foodColors.results}
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
        colors={RalColorsLimited}
        // setColorOut={setColorCart}
        defaultColor={foodColors.cart}
        onColorSelect={(color) => setFoodColors({...foodColors, cart: color.id})}
      ></MyColorPicker>
      <label htmlFor="colpick2">
        {checked ? langStrings.Farbe2.en : langStrings.Farbe2.de}
      </label>
      <MyColorPicker
        id="colpick2"
        langEn={checked}
        colors={RalColorsLimited}
        // setColorOut={setColorRecent}
        defaultColor={foodColors.recent}
        onColorSelect={(color) => setFoodColors({...foodColors, recent: color.id})}
      ></MyColorPicker>
      <label htmlFor="colpick3">
        {checked ? langStrings.Farbe3.en : langStrings.Farbe3.de}
      </label>
      <MyColorPicker
        id="colpick3"
        langEn={checked}
        colors={RalColorsLimited}
        // setColorOut={setColorResults}
        defaultColor={foodColors.results}
        onColorSelect={(color) => setFoodColors({...foodColors, results: color.id})}
      ></MyColorPicker>

    </MainContainer>
  );
}

const MainContainer = styled.main`
  text-align: center;
  font-size: 16px;
  padding: 3px 5px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  color: white;
  height: 99.2vh;
  max-width: 500px;
  margin: 0 auto;
  border-left: rgba(0, 0, 0, 0.4) solid 1px;
  border-right: rgba(0, 0, 0, 0.4) solid 1px;

  h1 {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 20px;
    color: white;
  }

  section {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 5px;
    margin-bottom: 10px;
  }

  /* switch */

  .switch {
    position: relative;
    display: inline-block;
    width: 46px;
    height: 22px;
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
    background-color: burlywood;
    transition: 0.2s;
    border-radius: 22px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 3px;
    background-color: #242424;
    transition: 0.2s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: burlywood;
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
    border: 2px solid gray;
    padding: 3px;

  &:hover {
    border: 2px solid #155e99;
  }

  &:focus {
    border: 2px solid #155e99;
    outline: none;
  }
`

export default App;
