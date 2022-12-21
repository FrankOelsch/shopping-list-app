import styled from "styled-components";
import {createRef, useEffect, useState} from "react";

export default function MyColorPicker({colors, onColorSelect, defaultColor, langEn}) {
  const [selectedColor, setSelectedColor] = useState(colors.find((color) => color.id === defaultColor));
  const [show, setShow] = useState(false);
  const ref = createRef();

  useEffect(() => {
    if (show) {
      // funktioniert, wird aber durch focus() überlagert
      // ref.current.scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'start',
      // });

      // funktioniert nur bei vorhandenem tabIndex:
      ref.current.focus();
    }
  }, [show])

  function handleClickSelect(e, color) {
    setSelectedColor(color);
    setShow(false);
    onColorSelect(color);
  }

  function handleClick() {
    setShow(!show);
  }

  function handleBlur(e) {
    if (e.relatedTarget === null) {
      // clicking outside
      setShow(false);
    }
  }

  return (
    <Container>
      <ColorItemOnce
        key={selectedColor.id}
        onClick={handleClick}
      >
        <Color style={{backgroundColor: selectedColor.id}}/>
        <ColorText>{langEn ? selectedColor.en : selectedColor.name}</ColorText>
      </ColorItemOnce>

      {!show || <ColorList tabIndex={1000} onBlur={handleBlur}>
        {colors.map((color, index) => {
          return (
            <ColorItem
              key={color.id}
              tabIndex={index}
              ref={color.id === selectedColor.id ? ref : null}
              onClick={(e) => {
                handleClickSelect(e, color);
              }}
            >
              <Color style={{backgroundColor: color.id}}/>
              <ColorText>{langEn ? color.en : color.name}</ColorText>
            </ColorItem>
          )
        })}
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
  color: black;
`;

const ColorList = styled.ul`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  width: 194px;
  height: 180px;
  border: 2px solid gray;
  border-top: 1px solid gray;
  overflow-y: auto;
  overflow-x: hidden;
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const ColorItem = styled.li`
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
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

  &:hover {
    background-color: #d8dfe6;
  }

  &:focus {
    background-color: #d8dfe6;
  }
`;

const ColorItemOnce = styled.button`
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
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

  &:hover {
    border: 2px solid #155e99;
  }

  &:focus {
    border: 2px solid #155e99;
    outline: none;
  }
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
