import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  ToastAndroid,
  View,
  Pressable,
} from "react-native";
import { AccentColorContext } from "../context/accent_color_context";
import { useColorScheme } from "nativewind";
import LibraryStorage from "../library_storage/library_storage";
import { Link } from "expo-router";
import { MangaComponent } from "./components/MangaComponent";

export default function Page() {
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const [libraryData, setLibraryData] = useState(null);

  const { colorScheme } = useColorScheme();
  const colorContext = useContext(AccentColorContext);

  const loadLibraryData = useCallback(async () => {
    try {
      const ret = await LibraryStorage.load({
        key: "library",
        autoSync: true,
      });
      setLibraryData(ret);
      setIsLibraryLoaded(true);
    } catch (error) {
      ToastAndroid.show(
        "No library storage found, creating new one...",
        ToastAndroid.SHORT
      );
      LibraryStorage.save({ key: "library", data: [] });
      setIsLibraryLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadLibraryData();

    const intervalId = setInterval(loadLibraryData, 5000);

    return () => clearInterval(intervalId);
  }, [loadLibraryData]);

  if (!libraryData || libraryData.length === 0) {
    return (
      <SafeAreaProvider className="bg-white dark:bg-slate-950">
        <SafeAreaView className="px-8 flex flex-col justify-center items-center h-[100vh]">
          <Text
            style={{ fontFamily: "WorkSans_700Bold" }}
            className="text-[#484848] text-2xl dark:text-white"
          >
            No saved manga.
          </Text>
          <Link href="hottest_manga" asChild>
            <Pressable
              style={{
                backgroundColor:
                  colorScheme === "dark" ? "white" : colorContext[0].hex,
              }}
              className="p-2 my-2 rounded-lg"
            >
              <Text
                style={{ fontFamily: "WorkSans_400Regular" }}
                className="text-white dark:text-black"
              >
                Browse some manga
              </Text>
            </Pressable>
          </Link>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider className="bg-white dark:bg-slate-950">
      <SafeAreaView className="px-2 flex-1">
        {isLibraryLoaded ? (
          <>
            <FlatList
              renderItem={({ item }) => (
                <MangaComponent
                  mangaTitle={item.mangaTitle}
                  mangaImgSrc={item.mangaImgSrc}
                  mangaLink={item.mangaLink}
                  mangaLatestChapter={item.mangaLatestChapter}
                  mangaDescription={item.mangaDescription}
                />
              )}
              data={libraryData}
              ItemSeparatorComponent={<View className="h-2 flex-1"></View>}
              className="mb-16"
            />
          </>
        ) : (
          <ActivityIndicator
            size={128}
            color={colorScheme === "dark" ? "white" : colorContext[0].hex}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
