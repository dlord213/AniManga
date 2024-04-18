import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  ToastAndroid,
  FlatList,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useColorScheme } from "nativewind";
import { AccentColorContext } from "../context/accent_color_context";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import * as cheerio from "cheerio";
import { Link } from "expo-router";

function SearchSomethingComponent(props) {
  const colorContext = useContext(AccentColorContext);
  const { colorScheme } = useColorScheme();

  return (
    <View className="flex flex-col flex-1 justify-center items-center gap-4">
      <FontAwesome
        name="search"
        size={64}
        color={colorScheme === "dark" ? "white" : colorContext[0].hex + "96"}
      />
      <Text
        className="text-[#969696] dark:text-white text-2xl"
        style={{ fontFamily: "WorkSans_300Light" }}
      >
        Search something...
      </Text>
    </View>
  );
}

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

function SearchComponent(props) {
  const colorContext = useContext(AccentColorContext);
  const { colorScheme } = useColorScheme();

  return (
    <View className="flex flex-row items-center gap-2 mb-2">
      <TextInput
        className="rounded-md border p-2 flex-1"
        cursorColor={colorScheme === "dark" ? "white" : colorContext[0].hex}
        style={{
          borderColor: colorScheme === "dark" ? "white" : colorContext[0].hex,
          fontFamily: "WorkSans_400Regular",
          color: colorScheme === "dark" ? "white" : "#484848",
        }}
        placeholder="Search"
        placeholderTextColor={colorScheme === "dark" ? "white" : "#969696"}
        onChangeText={props.onChangeSearchValue}
        value={props.searchValue}
      />
      <Pressable onPress={props.onPress}>
        <FontAwesome
          name="search"
          size={24}
          color={colorScheme === "dark" ? "white" : colorContext[0].hex}
        />
      </Pressable>
    </View>
  );
}

export default function Page() {
  const [searchValue, onChangeSearchValue] = useState("");
  const [data, setData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(null);
  const colorContext = useContext(AccentColorContext);
  const { colorScheme } = useColorScheme();

  const fetchData = useCallback(async () => {
    setIsDataFetched(false);
    setData([]);
    try {
      const response = await axios.get(
        `https://manganato.com/search/story/${searchValue
          .trim()
          .replace(/\s+/g, "_")}`
      );

      const $ = cheerio.load(response.data);

      let tempData = [];

      $(".panel-search-story")
        .children("div")
        .each((index, element) => {
          const mangaTitle = $(element).find("a").attr("title");
          const mangaImgSrc = $(element).find("img").attr("src");
          const mangaLink = $(element).find("a").attr("href");

          tempData.push({ mangaLink, mangaImgSrc, mangaTitle });
        });

      setData(tempData);
      setIsDataFetched(true);
    } catch (err) {
      console.log("Error: ", err);
      if (err instanceof TypeError) {
        ToastAndroid.show(
          "Enter something on the search bar.",
          ToastAndroid.SHORT
        );
        setData([]);
      } else {
        ToastAndroid.show(
          "An error occurred while fetching data.",
          ToastAndroid.SHORT
        );
      }
    }
  });

  if (isDataFetched == null) {
    return (
      <SafeAreaProvider className="bg-white dark:bg-slate-950">
        <SafeAreaView className="px-2 flex-1">
          <SearchComponent
            searchValue={searchValue}
            onChangeSearchValue={onChangeSearchValue}
            onPress={() => fetchData()}
          />
          <SearchSomethingComponent />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider className="bg-white dark:bg-slate-950">
      <SafeAreaView className="px-2 flex-1">
        {isDataFetched ? (
          <>
            <FlatList
              renderItem={({ item }) => <MangaComponent {...item} />}
              data={data}
              className="mb-16"
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={<View className="h-2 flex-1"></View>}
              ListHeaderComponent={
                <SearchComponent
                  searchValue={searchValue}
                  onChangeSearchValue={onChangeSearchValue}
                  onPress={() => fetchData()}
                />
              }
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
