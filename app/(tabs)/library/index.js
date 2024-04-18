import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Text,
  TextInput,
  ToastAndroid,
  View,
  Pressable,
} from "react-native";
import { AccentColorContext } from "../context/accent_color_context";
import { useColorScheme } from "nativewind";
import { FontAwesome } from "@expo/vector-icons";
import LibraryStorage from "../library_storage/library_storage";
import { Link } from "expo-router";



function MangaComponent(props) {
  return (
    <Link
      href={{
        pathname: "/manga_about",
        params: { link: props.mangaLink },
      }}
      asChild
    >
      <Pressable className="flex-1">
        <ImageBackground
          src={props.mangaImgSrc}
          resizeMode="cover"
          className="flex flex-1 justify-end h-[240px]"
          imageStyle={{ borderRadius: 16 }}
        >
          <View
            style={{
              backgroundColor: "#0F172AAA",
              borderRadius: 16,
            }}
            className="p-4"
          >
            <Text
              className="text-white"
              style={{ fontFamily: "WorkSans_700Bold" }}
            >
              {props.mangaTitle}
            </Text>
          </View>
        </ImageBackground>
      </Pressable>
    </Link>
  );
}

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
      console.error("Error loading library data:", error);
      ToastAndroid.show("Error loading library data.", ToastAndroid.SHORT);
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
