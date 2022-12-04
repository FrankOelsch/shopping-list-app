import styled from "styled-components";
import {RalColorsLimited} from "../data/RalColors";
import {useState} from "react";

export default function MyColorPicker({setColorOut, defaultColor, langEn}) {
  const [color, setColor] = useState(defaultColor);
  const [show, setShow] = useState(false);

  function handleClickSelect(e, color) {
    setColor(color);
    setShow(false);
    console.log(color.id);
    setColorOut(color.id)
  }

  function handleClick() {
    setShow(true);
  }

  return (
    <Container>
      <ColorItemOnce
        key={color.id}
        onClick={handleClick}
      >
        <Color style={{backgroundColor: color.id}}/>
        <ColorText>{langEn ? color.en : color.name}</ColorText>
      </ColorItemOnce>

      {!show || <ColorList>
        {RalColorsLimited.map((color) => (
          <ColorItem
            key={color.id}
            onClick={(e) => {
              handleClickSelect(e, color);
            }}
          >
            <Color style={{backgroundColor: color.id}}/>
            <ColorText>{langEn ? color.en : color.name}</ColorText>
          </ColorItem>
        ))}
      </ColorList>}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const ColorList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  width: 192px;
  height: 180px;
  border: 2px solid gray;
  border-top: 1px solid gray;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ColorItem = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  width: 96%;
  border-bottom: 1px solid gray;
  padding: 4px;
  cursor: pointer;
  background-color: white;
`;

const ColorItemOnce = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  width: 200px;
  border: 2px solid gray;
  border-radius: 8px;
  padding: 4px;
  cursor: pointer;
  background-color: white;
`;

const Color = styled.div`
  background-color: white;
  width: 30px;
  height: 20px;
`;

const ColorText = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1em;
  margin-left: 8px;
`;
