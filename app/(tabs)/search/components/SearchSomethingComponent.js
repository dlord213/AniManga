import React, { useContext } from "react";
import { View, Text } from "react-native";
import { useColorScheme } from "nativewind";
import { AccentColorContext } from "../../context/accent_color_context";
import { FontAwesome } from "@expo/vector-icons";

export function SearchSomethingComponent() {
  const colorContext = useContext(AccentColorContext);
  const { colorScheme } = useColorScheme();

  return (
    <View className="flex flex-col flex-1 justify-center items-center gap-4">
      <FontAwesome
        name="search"
        size={64}
        color={colorScheme === "dark" ? "white" : colorContext[0].hex + "96"} />
      <Text
        className="text-[#969696] dark:text-white text-2xl"
        style={{ fontFamily: "WorkSans_300Light" }}
      >
        Search something...
      </Text>
    </View>
  );
}
