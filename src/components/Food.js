import styled from "styled-components";
import {useState} from "react";

export default function Food({id, name, onSelect, active, color}) {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <StyledH3 style={{backgroundColor: color, borderColor: isHovering ? 'white' : color}}
              variante={active}
              id={id}
              onClick={(e) => onSelect(e)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
    >
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
  color: black;
  border-radius: 6px;
  min-width: 80px;
  border-style: solid;
  border-width: 1px;
  cursor: pointer;
`;
