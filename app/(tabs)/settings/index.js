import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { useContext, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useColorScheme } from "nativewind";
import { AccentColorContext } from "../context/accent_color_context";
import { FontAwesome } from "@expo/vector-icons";
import LibraryStorage from "../library_storage/library_storage";
import DropDownPicker from "react-native-dropdown-picker";
import { SwitchComponent } from "./components/SwitchComponent";
import { sources } from "./sources";
import { colors } from "./colors";
import { ColorComponent } from "./components/ColorComponent";

export default function Page() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const colorContext = useContext(AccentColorContext);

  return (
    <SafeAreaProvider className="bg-white dark:bg-slate-950 ">
      <SafeAreaView className="flex flex-col px-4">
        <Text
          style={{ fontFamily: "WorkSans_900Black" }}
          className="text-[#363636] dark:text-white mb-2 text-xl"
        >
          Theme
        </Text>
        <SwitchComponent
          onEnabled={() => setColorScheme("dark")}
          onDisabled={() => setColorScheme("light")}
          title="Dark Mode"
        />
        <View className="flex flex-col">
          <Text
            style={{ fontFamily: "WorkSans_400Regular" }}
            className="text-[#484848] dark:text-white my-2"
          >
            Accent Color (Light Mode only)
          </Text>
          <ScrollView
            horizontal
            className="flex flex-row bg-gray-200 dark:bg-slate-900 rounded-lg"
            contentContainerStyle={{ padding: 8 }}
          >
            {colors.map((elem) => (
              <ColorComponent
                color={elem.color}
                hex={elem.hex}
                key={elem.hex}
              />
            ))}
          </ScrollView>
        </View>
        <Text
          style={{ fontFamily: "WorkSans_900Black" }}
          className="text-[#363636] dark:text-white my-2 text-xl"
        >
          Library
        </Text>
        <Pressable
          className="bg-gray-200 p-2 rounded-lg flex flex-row justify-between items-center dark:bg-slate-900"
          onPress={() => {
            LibraryStorage.remove({ key: "library" });
          }}
        >
          <Text
            style={{ fontFamily: "WorkSans_400Regular" }}
            className="text-[#484848] dark:text-white"
          >
            Clear library
          </Text>
          <FontAwesome
            name="trash"
            size={24}
            color={colorScheme === "dark" ? "white" : colorContext[0].hex}
          />
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
