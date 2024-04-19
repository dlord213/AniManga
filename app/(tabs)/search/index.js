import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  View,
  ToastAndroid,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useColorScheme } from "nativewind";
import { AccentColorContext } from "../context/accent_color_context";
import axios from "axios";
import * as cheerio from "cheerio";
import { SearchSomethingComponent } from "./components/SearchSomethingComponent";
import { MangaComponent } from "./components/MangaComponent";
import { SearchComponent } from "./components/SearchComponent";

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
