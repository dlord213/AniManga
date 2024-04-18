import React, { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import { AccentColorContext } from "./context/accent_color_context";
import { FontAwesome6 } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { HottestMangaPageContext } from "./context/hottest_manga_page_context";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  const [currentAccentColor, setAccentColor] = useState({
    hex: "#EF4444",
    css_code: "red",
  });

  const [currentPage, setCurrentPage] = useState(1);

  return (
    <HottestMangaPageContext.Provider value={[currentPage, setCurrentPage]}>
      <AccentColorContext.Provider value={[currentAccentColor, setAccentColor]}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "#646464",
            tabBarInactiveBackgroundColor: "#F1F1F1",
            tabBarActiveBackgroundColor:
              colorScheme === "dark" ? "#020617" : currentAccentColor.hex,
            tabBarLabelStyle: { fontFamily: "WorkSans_500Medium" },
            tabBarStyle: {
              position: "absolute",
              shadowOpacity: 0,
              overflow: "hidden",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              backgroundColor: colorScheme === "dark" ? "#020617" : "white",
              borderColor: colorScheme === "dark" ? "#020617" : "white",
            },
            headerStyle: {
              backgroundColor: colorScheme === "dark" ? "#020617" : "white",
            },
            headerTitleAlign: "center",
            headerTintColor:
              colorScheme === "dark" ? "white" : currentAccentColor.hex,
            headerTitleStyle: { fontFamily: "WorkSans_900Black" },
            headerShadowVisible: false,
          }}
        >
          <Tabs.Screen
            name="library/index"
            options={{
              title: "Library",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={28} name="th-list" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="index"
            options={{ href: null, headerShown: false }}
          />
          <Tabs.Screen
            name="hottest_manga/index"
            options={{
              title: "Hottest",
              tabBarIcon: ({ color }) => (
                <FontAwesome6
                  name="fire-flame-curved"
                  size={24}
                  color={color}
                />
              ),
              headerLeft: () => {
                if (currentPage > 1) {
                  return (
                    <Pressable
                      className="flex px-2 flex-row gap-2 items-center"
                      onPress={() => setCurrentPage(currentPage - 1)}
                    >
                      <AntDesign
                        name="arrowleft"
                        size={24}
                        color={
                          colorScheme === "dark"
                            ? "white"
                            : currentAccentColor.hex
                        }
                      />
                    </Pressable>
                  );
                }
              },
              headerRight: () => (
                <Pressable
                  className="flex px-2 flex-row gap-2 items-center"
                  onPress={() => {
                    setCurrentPage(currentPage + 1);
                  }}
                >
                  <AntDesign
                    name="arrowright"
                    size={24}
                    color={
                      colorScheme === "dark" ? "white" : currentAccentColor.hex
                    }
                  />
                </Pressable>
              ),
            }}
          />
          <Tabs.Screen
            name="search/index"
            options={{
              headerTitle: "Search",
              title: "Search",
              tabBarIcon: ({ color }) => (
                <FontAwesome name="search" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="settings/index"
            options={{
              title: "Settings",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={28} name="gear" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="manga_about/index"
            options={{
              href: null,
              headerShown: false,
            }}
          />
          <Tabs.Screen name="modal/index" options={{ href: null }} />
          <Tabs.Screen
            name="library_storage/library_storage"
            options={{ href: null }}
          />
        </Tabs>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </AccentColorContext.Provider>
    </HottestMangaPageContext.Provider>
  );
}
