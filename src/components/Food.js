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
  
  function isDarkColor(clr) {
    let c = clr.substring(1);      // strip #
    let rgb = parseInt(c, 16);   // convert rrggbb to decimal
    let r = (rgb >> 16) & 0xff;  // extract red
    let g = (rgb >>  8) & 0xff;  // extract green
    let b = (rgb >>  0) & 0xff;  // extract blue
    let darkness = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    return darkness < 128;
  }

  return (
    <StyledH3 style={{backgroundColor: color,
      borderColor: isHovering ? 'white' : color,
      color: (isDarkColor(color) === true) ? "white" : "black"}}
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
  text-align: center;
  margin: 0;
  padding: 3px 6px;
  color: black;
  border-radius: 6px;
  min-width: 80px;
  border-style: solid;
  border-width: 1px;
  cursor: pointer;
`;