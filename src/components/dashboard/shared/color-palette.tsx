import { Dispatch, FC, SetStateAction } from "react";


interface ColorPaletteProps {
  colors?: { color: string}[];
  colorsData?: { color: string }[];
  setColors: Dispatch<SetStateAction<{color: string}[]>>;
}

const ColorPalette: FC<ColorPaletteProps> = ({ colors, colorsData, setColors}) => {
  return <div></div>
}

export default ColorPalette;