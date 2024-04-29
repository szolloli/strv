import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { ColorValue } from "react-native/types";

export default function ListIcon({ color }: { color: ColorValue }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5.76709 11.1187C4.64648 11.1187 4.08252 10.5693 4.08252 9.44141V6.64355C4.08252 5.52295 4.64648 4.98096 5.76709 4.98096H18.2256C19.3462 4.98096 19.9102 5.52295 19.9102 6.64355V9.44141C19.9102 10.5693 19.3462 11.1187 18.2256 11.1187H5.76709ZM5.76709 18.4648C4.64648 18.4648 4.08252 17.9229 4.08252 16.7949V13.9897C4.08252 12.8765 4.64648 12.3271 5.76709 12.3271H18.2256C19.3462 12.3271 19.9102 12.8765 19.9102 13.9897V16.7949C19.9102 17.9229 19.3462 18.4648 18.2256 18.4648H5.76709Z"
        fill={color}
      />
    </Svg>
  );
}
