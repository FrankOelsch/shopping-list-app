import styled from "styled-components";

export default function Food({id, name, onSelect, active}) {
  return (
    <StyledH3 variante={active} id={id} onClick={(e) => onSelect(e)}>
      {name}
    </StyledH3>
  );
}

const StyledH3 = styled.h3`
  font-family: Arial, sans-serif;
  font-size: 18px;
  font-style: normal;
  font-weight: bold;
  margin: 0;
  padding: 3px 6px;
  background-color: ${(prop) =>
          prop.variante === true ? "#61dafb" : "burlywood"};
  border-radius: 6px;
  min-width: 80px;
  border-style: solid;
  border-width: 2px;
  border-color: ${(prop) => (prop.variante === true ? "#61dafb" : "burlywood")};
  cursor: pointer;

  :hover {
    border-color: black;
  }
`;
