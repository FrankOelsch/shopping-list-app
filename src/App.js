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
  };

  const [searchString, setSearchString] = useState("");
  const [checked, setChecked] = useState(false);
  const [foods, setFoods] = useState(getFromLocalStorage("Foods") ?? []);
  const searchInput = useRef(null);

  const [color1, setColor1] = useState("#C2B078");

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

      {(searchString === "") && <Collapse>
        <summary>{checked ? langStrings.Zuletzt.en : langStrings.Zuletzt.de}</summary>
        <section className="recent">
          {foods.filter((item) => item.recent).map((e) => (
            <Food
              key={e._id}
              id={e._id}
              name={checked ? e.name.en : e.name.de}
              onSelect={handleToggle}
              active={e.active}
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
          ></Food>
        ))}
      </section>

      <h1>Test Color-Picker</h1>

      <StyledInput
        id="color1"
        style={{ backgroundColor: color1 }}
        readOnly={true}
        type="text"
      ></StyledInput>

      <MyColorPicker
        setColor1={setColor1}
      >

      </MyColorPicker>

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
