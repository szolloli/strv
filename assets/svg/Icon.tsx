import Colors from "@/constants/Colors";
import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function Icon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M0 24V0H14.1818V4.40056H4.40786V9.88434H13.2555V14.048H4.40786V19.5994H14.1818V24H0ZM18.5455 21.2727C18.5455 20.5135 18.8087 19.8691 19.3353 19.3397C19.8619 18.8102 20.5027 18.5455 21.2578 18.5455C21.6354 18.5455 21.993 18.6154 22.3308 18.7552C22.6687 18.8951 22.9617 19.0899 23.2101 19.3397C23.4585 19.5894 23.6523 19.8791 23.7914 20.2088C23.9305 20.5385 24 20.8931 24 21.2727C24 21.6523 23.9305 22.007 23.7914 22.3367C23.6523 22.6663 23.4585 22.956 23.2101 23.2058C22.9617 23.4555 22.6687 23.6503 22.3308 23.7902C21.993 23.9301 21.6354 24 21.2578 24C20.5027 24 19.8619 23.7353 19.3353 23.2058C18.8087 22.6763 18.5455 22.032 18.5455 21.2727Z"
        fill={Colors.black}
      />
    </Svg>
  );
}
