import { styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";
import { gray, matblack } from "../../constants/color";
export const VisuallyHiddenInpute = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

export const Link = styled(LinkComponent)`
  text-decoration: none;
  color: inherit;
  padding: 1rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const InputBox = styled("input")`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 1rem;
  border-radius: 1.5rem;
  background-color: ${gray};
`;

export const CurveButton = styled("button")`
  border: none;
  outline: none;
  border-radius: 1.5rem;
  background-color: ${matblack};
  font-size: 1.1rem;
  padding: 1rem 2rem;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

export const SearchBox = styled("input")`
  padding: 1rem 2rem;
  width: 20vmax;
  border: none;
  outline: none;
  border-radius: 1.5rem;
  background-color: ${gray};
  font-size: 1.1rem;
`;
