import {useEffect, useState, useRef} from "react";
import "./App.css";
import Food from "./components/Food";
import styled from "styled-components";

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
  const paramsObj = {
    SpracheText: {de: "Sprache", en: "Language"},
    SucheText: {de: "Suche nach Lebensmitteln", en: "Search for foods"},
    WarenkText: {de: "Warenkorb", en: "Shopping cart"},
  };

  const [searchString, setSearchString] = useState("");
  const [checked, setChecked] = useState(false);
  const [foods, setFoods] = useState(getFromLocalStorage("Foods") ?? []);
  const searchInput = useRef(null);

  // searchInput.current.focus();

  useEffect(() => {
    if (foods && foods.length > 0) {
      return;
    } else {
      fetch("https://fetch-me.vercel.app/api/shopping/items")
        .then((response) => response.json())
        .then((response) =>
          setFoods(response.data.map((item) => ({...item, active: false})))
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

  function toggleSelect(e) {
    console.log("toggleSelect: " + e.target.id);

    setFoods(foods.map((food) => {
      if (food._id === e.target.id) {
        return {
          ...food,
          active: !food.active,
        };
      } else {
        return food;
      }
    }));
  }

  function handleChangeLang(e) {
    setChecked(!checked);
  }

  console.log("render");

  return (
    <div className="App">
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
      <br/>
      <br/>
      <br/>
      <label>
        {checked ? paramsObj.WarenkText.en : paramsObj.WarenkText.de}:
      </label>
      <section className="cart">
        {foods.filter((item) => item.active).map((e) => (
          <Food
            key={e._id}
            id={e._id}
            name={checked ? e.name.en : e.name.de}
            onSelect={toggleSelect}
            active={e.active}
          ></Food>
        ))}
      </section>
      <label>{checked ? paramsObj.SucheText.en : paramsObj.SucheText.de}:</label>
      <br/>
      <input
        className="search"
        id="searchInput"
        onChange={handleChangeSearch}
        type="text"
        ref={searchInput}
      ></input>
      <section className="shop">
        {search(searchString, foods, {
          keySelector: (obj) => (checked ? obj.name.en : obj.name.de),
        }).filter((item) => !item.active).map((e) => (
          <Food
            key={e._id}
            id={e._id}
            name={checked ? e.name.en : e.name.de}
            onSelect={toggleSelect}
            active={e.active}
          ></Food>
        ))}
      </section>
    </div>
  );
}

const LanguageDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
`
export default App;
