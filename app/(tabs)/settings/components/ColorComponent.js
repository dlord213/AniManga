import React, { useContext } from "react";
import { Pressable, View } from "react-native";
import { AccentColorContext } from "../../context/accent_color_context";

export function ColorComponent(props) {
  const [currentAccentColor, setAccentColor] = useContext(AccentColorContext);

  return (
    <Pressable
      onPress={() => setAccentColor({ hex: props.hex, css_code: props.color })}
      className="p-1"
    >
      <View
        style={{
          height: 36,
          width: 36,
          backgroundColor: props.hex,
          borderRadius: 36,
        }} />
    </Pressable>
  );
}
