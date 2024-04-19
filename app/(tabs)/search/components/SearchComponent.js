import React, { useContext } from "react";
import {
  View,
  TextInput,
  Pressable
} from "react-native";
import { useColorScheme } from "nativewind";
import { AccentColorContext } from "../../context/accent_color_context";
import { FontAwesome } from "@expo/vector-icons";

export function SearchComponent(props) {
  const colorContext = useContext(AccentColorContext);
  const { colorScheme } = useColorScheme();

  return (
    <View className="flex flex-row items-center gap-2 mb-2">
      <TextInput
        className="rounded-md border p-2 flex-1"
        cursorColor={colorScheme === "dark" ? "white" : colorContext[0].hex}
        style={{
          borderColor: colorScheme === "dark" ? "white" : colorContext[0].hex,
          fontFamily: "WorkSans_400Regular",
          color: colorScheme === "dark" ? "white" : "#484848",
        }}
        placeholder="Search"
        placeholderTextColor={colorScheme === "dark" ? "white" : "#969696"}
        onChangeText={props.onChangeSearchValue}
        value={props.searchValue} />
      <Pressable onPress={props.onPress}>
        <FontAwesome
          name="search"
          size={24}
          color={colorScheme === "dark" ? "white" : colorContext[0].hex} />
      </Pressable>
    </View>
  );
}
