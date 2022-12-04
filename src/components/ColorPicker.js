import styled from "styled-components";
import {RalColorsLimited} from "../data/RalColors";
import {useState} from "react";

export default function MyColorPicker({setColor1}) {
  const [color, setColor] = useState({
    ral: "1001",
    rgb: "194-176-120",
    id: "#C2B078",
    name: "Beige",
    en: "Beige",
  });
  const [show, setShow] = useState(true);

  function handleClickSelect(e, color) {
    setColor(color);
    setShow(false);

    setColor1(color.id)
  }

  function handleClick(e, color) {
    setShow(true);
  }

  return (
    <Container>
      {show || <StyledInput
        className="search"
        id="color"
        value={color.name}
        style={{backgroundColor: color.id}}
        readOnly={true}
        type="text"
        placeholder="Color" onClick={handleClick}
      >
      </StyledInput>}

      {!show || <ColorList>
        {RalColorsLimited.map((color) => (
          <ColorItem
            key={color.id}
            onClick={(e) => {
              handleClickSelect(e, color);
            }}
          >
            <Color style={{backgroundColor: color.id}}/>
            <ColorText>{color.name}</ColorText>
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
  width: 200px;
`;

const ColorList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  width: 100%;
  height: 180px;
  border: 1px solid black;
  overflow-y: scroll;
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
  border-bottom: 1px solid black;
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

const StyledInput = styled.input`
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 18px;
  width: 100%;
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
