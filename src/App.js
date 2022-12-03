import {useEffect, useState, useRef} from "react";
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
  const langStrings = {
    AppText: {de: "Meine Einkaufsliste", en: "My Shopping List"},
    SpracheText: {de: "Sprache", en: "Language"},
    SucheText: {de: "Suche", en: "Search"},
    WarenkText: {de: "Warenkorb", en: "Shopping cart"},
    ZuletztText: {de: "Zuletzt gekauft", en: "Recently used"},
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

      <h1>{checked ? langStrings.AppText.en : langStrings.AppText.de}</h1>

      <label>
        {checked ? langStrings.WarenkText.en : langStrings.WarenkText.de}:
      </label>

      <section className="cart">
        {foods.filter((item) => item.active).map((e) => (
          <Food
            key={e._id}
            id={e._id}
            name={checked ? e.name.en : e.name.de}
            onSelect={handleToggle}
            active={e.active}
          ></Food>
        ))}
      </section>

      <input
        className="search"
        id="searchInput"
        onChange={handleChangeSearch}
        type="text"
        ref={searchInput}
        placeholder={checked ? langStrings.SucheText.en : langStrings.SucheText.de}
      ></input>

      <Collapse>
        <summary>{checked ? langStrings.ZuletztText.en : langStrings.ZuletztText.de}</summary>
        <section className="recent">
          {foods.filter((item) => item.recent).map((e) => (
            <Food
              key={e._id}
              id={e._id}
              name={checked ? e.name.en : e.name.de}
              active={e.active}
            ></Food>
          ))}
        </section>
      </Collapse>

      <section className="shop">
        {search(searchString, foods, {
          keySelector: (obj) => (checked ? obj.name.en : obj.name.de),
        }).filter((item) => !item.active).map((e) => (
          <Food
            key={e._id}
            id={e._id}
            name={checked ? e.name.en : e.name.de}
            onSelect={handleToggle}
            active={e.active}
          ></Food>
        ))}
      </section>
    </MainContainer>
  );
}

const MainContainer = styled.main`
  text-align: center;
  font-size: 18px;
  padding: 3px 5px;

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
    min-height: 80px;
    padding: 5px;
    margin-bottom: 10px;
  }

  input[type="text"] {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 18px;
    width: 50%;
    color: #155e99;
    margin-bottom: 10px;
    border-radius: 8px;
    border: 3px solid #2196f3;
    padding: 3px;
  }

  input[type="text"]:hover {
    border: 3px solid #155e99;
  }

  input[type="text"]:focus {
    border: 3px solid #155e99;
    outline: none;
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
  text-align: left;
  margin-left: 5px;
`

export default App;
