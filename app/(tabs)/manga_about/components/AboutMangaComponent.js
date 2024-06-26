import { Link } from "expo-router";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { AccentColorContext } from "../../context/accent_color_context";
import {
  Pressable,
  View,
  Text, ToastAndroid
} from "react-native";
import { useColorScheme } from "nativewind";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import LibraryStorage from "../../library_storage/library_storage";

export function AboutMangaComponent(props) {
  const removeFromLibrary = useCallback(async (mangaTitleToRemove) => {
    try {
      const existingLibraryData = await LibraryStorage.load({ key: "library" });

      const indexToRemove = existingLibraryData.findIndex(
        (item) => item.mangaTitle === mangaTitleToRemove
      );

      existingLibraryData.splice(indexToRemove, 1);

      await LibraryStorage.save({ key: "library", data: existingLibraryData });
    } catch (error) {
      console.error("Error removing manga from library:", error);
    }
  }, []);

  const saveToLibrary = useCallback(async (newData) => {
    try {
      const existingLibraryData = await LibraryStorage.load({ key: "library" });

      const updatedLibraryData = existingLibraryData
        ? [...existingLibraryData, newData]
        : [newData];

      await LibraryStorage.save({ key: "library", data: updatedLibraryData });
    } catch (error) {
      console.error("Error saving data to library:", error);
    }
  }, []);

  const [isExpanded, setIsExpanded] = useState(false);
  const colorContext = useContext(AccentColorContext);
  const { colorScheme } = useColorScheme();

  const [isInLibrary, setIsInLibrary] = useState(false);

  useEffect(() => {
    const findInLibrary = async () => {
      try {
        const ret = await LibraryStorage.load({
          key: "library",
          autoSync: true,
        });

        let findItem = ret.find((elem) => elem.mangaTitle === props.mangaTitle);

        if (findItem == undefined) {
          setIsInLibrary(false);
        } else {
          setIsInLibrary(true);
        }
      } catch (error) {
        console.error("Error loading library data:", error);
        ToastAndroid.show("Error loading library data.", ToastAndroid.SHORT);
        setIsInLibrary(false);
      }
    };

    findInLibrary();
  }, []);

  return (
    <>
      <View className="flex flex-row gap-2">
        <Image
          source={props.mangaImgSrc}
          className="w-[128px] h-[240px] object-contain flex-1 rounded-lg" />
        <View className="flex flex-col flex-1">
          <Text
            style={{ fontFamily: "WorkSans_700Bold" }}
            className="text-xl text-[#484848] dark:text-white"
          >
            {props.mangaTitle}
          </Text>
          <View className="flex flex-row gap-1 my-1 items-center">
            <MaterialCommunityIcons
              name="progress-alert"
              size={24}
              color={colorScheme === "dark" ? "white" : colorContext[0].hex} />
            <Text
              style={{ fontFamily: "WorkSans_400Regular" }}
              className="text-[#484848] dark:text-white"
            >
              {props.mangaStatus}
            </Text>
          </View>
          <View className="flex flex-row gap-1 my-1 items-center">
            <MaterialCommunityIcons
              name="calendar-clock"
              size={24}
              color={colorScheme === "dark" ? "white" : colorContext[0].hex} />
            <Text
              style={{ fontFamily: "WorkSans_400Regular" }}
              className="text-[#484848] dark:text-white flex-1"
            >
              {props.mangaLastUpdated}
            </Text>
          </View>
          <View className="flex flex-row gap-1 mx-[0.4px] my-1 items-center ">
            <FontAwesome
              name="user"
              size={24}
              color={colorScheme === "dark" ? "white" : colorContext[0].hex} />
            <Text
              style={{ fontFamily: "WorkSans_400Regular" }}
              className="text-[#484848] dark:text-white flex-1"
            >
              {props.mangaAuthor}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex flex-row my-2">
        {isInLibrary ? (
          <>
            <Pressable
              className="p-2 flex flex-1 flex-row mr-1 justify-center items-center rounded-lg"
              style={{
                backgroundColor: colorScheme === "dark" ? "white" : colorContext[0].hex,
              }}
              onPress={() => {
                ToastAndroid.show("Removed from library.", ToastAndroid.SHORT);
                removeFromLibrary(props.mangaTitle);
                setIsInLibrary(false);
              }}
            >
              <AntDesign
                name="heart"
                size={16}
                color={colorScheme === "dark" ? "#242424" : "white"} />
              <Text
                className="text-white dark:text-slate-950 mx-2"
                style={{ fontFamily: "WorkSans_700Bold" }}
              >
                Remove
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable
              className="p-2 flex flex-1 flex-row mr-1 justify-center items-center rounded-lg"
              style={{
                backgroundColor: colorScheme === "dark" ? "white" : colorContext[0].hex,
              }}
              onPress={() => {
                ToastAndroid.show("Added to library.", ToastAndroid.SHORT);
                saveToLibrary({
                  mangaImgSrc: props.mangaImgSrc,
                  mangaTitle: props.mangaTitle,
                  mangaStatus: props.mangaStatus,
                  mangaLink: props.link,
                });
                setIsInLibrary(true);
              }}
            >
              <AntDesign
                name="hearto"
                size={16}
                color={colorScheme === "dark" ? "#242424" : "white"} />
              <Text
                className="text-white dark:text-slate-950 mx-2"
                style={{ fontFamily: "WorkSans_700Bold" }}
              >
                Add
              </Text>
            </Pressable>
          </>
        )}
        <Link href={props.link} asChild>
          <Pressable
            className="p-2 flex flex-1 flex-row ml-1 justify-center items-center rounded-lg"
            style={{
              backgroundColor: colorScheme === "dark" ? "white" : colorContext[0].hex,
            }}
          >
            <MaterialCommunityIcons
              name="web"
              size={16}
              color={colorScheme === "dark" ? "#242424" : "white"} />
            <Text
              className=" text-white dark:text-slate-950 mx-2"
              style={{ fontFamily: "WorkSans_700Bold" }}
            >
              WebView
            </Text>
          </Pressable>
        </Link>
      </View>
      <Pressable
        className="bg-gray-200 rounded-lg dark:bg-slate-800"
        style={{ height: isExpanded ? "auto" : 128 }}
        onPress={() => {
          if (isExpanded == true) {
            setIsExpanded(false);
          } else {
            setIsExpanded(true);
          }
        }}
      >
        <View
          className={"absolute flex flex-row justify-between items-center bottom-0 w-full z-10 rounded-lg p-4 " +
            (isExpanded ? "bg-[#0F172A10]" : "bg-[#0F172AEF]")}
        >
          {isExpanded ? (
            <AntDesign name="caretup" size={16} color="white" />
          ) : (
            <AntDesign name="caretdown" size={16} color="white" />
          )}

          <Text
            className="text-white text-center"
            style={{
              fontFamily: "WorkSans_700Bold",
              color: isExpanded ? "#FFFFFF00" : "#FFFFFF",
            }}
          >
            EXPAND
          </Text>
        </View>

        <Text
          style={{
            fontFamily: "WorkSans_400Regular",
          }}
          className="text-[#484848] dark:text-white px-4 py-2"
        >
          {props.mangaDescription}
        </Text>
      </Pressable>
    </>
  );
}
