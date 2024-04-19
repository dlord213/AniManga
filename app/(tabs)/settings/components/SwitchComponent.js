import React, { useState } from "react";
import { Switch, Text, View } from "react-native";
import { useColorScheme } from "nativewind";

export function SwitchComponent(props) {
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
        thumbColor={colorScheme === "dark"
          ? isEnabled
            ? "white"
            : "#f4f3f4"
          : isEnabled
            ? "#EF4444"
            : "#f4f3f4"}
        onValueChange={toggleSwitch}
        value={isEnabled} />
    </View>
  );
}
