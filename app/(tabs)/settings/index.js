import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { useContext, useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { useColorScheme } from "nativewind";
import { AccentColorContext } from "../context/accent_color_context";

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
    <View className="flex flex-row items-center justify-between">
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
  const { setColorScheme } = useColorScheme();

  return (
    <SafeAreaProvider className="bg-white dark:bg-slate-950 ">
      <SafeAreaView className="flex flex-col px-8">
        <SwitchComponent
          onEnabled={() => setColorScheme("dark")}
          onDisabled={() => setColorScheme("light")}
          title="Dark Mode"
        />
        <View className="flex flex-col">
          <Text
            style={{ fontFamily: "WorkSans_400Regular" }}
            className="text-[#484848] dark:text-white my-4"
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
