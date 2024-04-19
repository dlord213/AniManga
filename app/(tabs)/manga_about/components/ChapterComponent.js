import { Link } from "expo-router";
import React, { useContext } from "react";
import { AccentColorContext } from "../../context/accent_color_context";
import {
  Pressable,
  View,
  Text
} from "react-native";
import { useColorScheme } from "nativewind";
import { AntDesign } from "@expo/vector-icons";

export function ChapterComponent(props) {
  const { colorScheme } = useColorScheme();
  const colorContext = useContext(AccentColorContext);

  return (
    <Link
      href={{
        pathname: "manga_view/",
        params: { link: props.link },
      }}
      asChild
    >
      <Pressable>
        <View className="flex flex-row justify-between items-center p-2 bg-gray-300 my-1 rounded-lg dark:bg-slate-800">
          <View className="flex flex-col">
            <Text
              style={{ fontFamily: "WorkSans_700Bold" }}
              className="text-[#484848] dark:text-white"
            >
              {props.title}
            </Text>
            <Text
              style={{ fontFamily: "WorkSans_400Regular" }}
              className="text-[#969696] dark:text-white"
            >
              {props.time}
            </Text>
          </View>
          <AntDesign
            name="caretright"
            size={16}
            color={colorScheme === "dark" ? "white" : colorContext[0].hex} />
        </View>
      </Pressable>
    </Link>
  );
}
