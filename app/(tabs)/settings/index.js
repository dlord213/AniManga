import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { useContext, useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { useColorScheme } from "nativewind";
import { AccentColorContext } from "../context/accent_color_context";
import { FontAwesome } from "@expo/vector-icons";
import LibraryStorage from "../library_storage/library_storage";
import DropDownPicker from "react-native-dropdown-picker";

const colors = [
  { color: "red", hex: "#EF4444" },
  { color: "orange", hex: "#F97316" },
  { color: "amber", hex: "#F59E0B" },
  { color: "yellow", hex: "#EAB308" },
  { color: "lime", hex: "#84CC16" },
  { color: "green", hex: "#22C55E" },
  { color: "emerald", hex: "#10B981" },
  { color: "sky", hex: "#0EA5E9" },
  { color: "blue", hex: "#3B82F6" },
  { color: "indigo", hex: "#6366F1" },
  { color: "purple", hex: "#A855F7" },
  { color: "pink", hex: "#EC4899" },
  { color: "rose", hex: "#F43F5E" },
  { color: "slate", hex: "#64748B" },
];

const sources = [
  {
    label: "Mangakakalot",
    value: "mangakakalot",
  },
  {
    label: "MangaSee",
    value: "mangasee",
  },
];

function SwitchComponent(props) {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled((prev) => !prev);
    if (!isEnabled) {
      props.onEnabled();
    } else {
      props.onDisabled();
    }
  };

  const { colorScheme } = useColorScheme();

  return (
    <View className="flex flex-row items-center justify-between bg-gray-200 p-2 rounded-lg dark:bg-gray-900">
      <Text
        style={{ fontFamily: "WorkSans_400Regular" }}
        className="text-[#484848] dark:text-white"
      >
        {props.title}
      </Text>
      <Switch
        trackColor={{ false: "#646464", true: "#969696" }}
        thumbColor={
          colorScheme === "dark"
            ? isEnabled
              ? "white"
              : "#f4f3f4"
            : isEnabled
            ? "#EF4444"
            : "#f4f3f4"
        }
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
}

function ColorComponent(props) {
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
        }}
      />
    </Pressable>
  );
}

export default function Page() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const colorContext = useContext(AccentColorContext);

  const [selectedProviderValue, setSelectedProviderValue] = useState();
  const [dropdownState, setDropdownState] = useState(false);

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
        <Text
          style={{ fontFamily: "WorkSans_400Regular" }}
          className="text-[#484848] dark:text-white px-2 my-2"
        >
          Sources
        </Text>
        <DropDownPicker
          open={dropdownState}
          items={sources}
          setOpen={setDropdownState}
          setValue={setSelectedProviderValue}
          value={selectedProviderValue}
          placeholder="Select a source "
          placeholderStyle={{ color: "#969696" }}
          textStyle={{
            fontFamily: "WorkSans_400Regular",
            color: colorScheme === "dark" ? "white" : "#484848",
          }}
          listItemContainerStyle={{
            backgroundColor: colorScheme === "dark" ? "#1E293B" : "#E5E7EB",
          }}
          listItemLabelStyle={{
            color: colorScheme === "dark" ? "white" : "#484848",
          }}
          dropDownContainerStyle={{ borderWidth: 0 }}
          style={{
            borderWidth: 0,
            backgroundColor: colorScheme === "dark" ? "#0F172A" : "#E5E7EB",
          }}
          theme={colorScheme === "dark" ? "DARK" : "LIGHT"}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
