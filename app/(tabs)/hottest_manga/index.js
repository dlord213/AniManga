import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AccentColorContext } from "../context/accent_color_context";
import { useColorScheme } from "nativewind";
import axios from "axios";
import * as cheerio from "cheerio";
import { HottestMangaPageContext } from "../context/hottest_manga_page_context";
import { MangaComponent } from "./components/MangaComponent";

export default function Page() {
  const colorContext = useContext(AccentColorContext);
  const pageContext = useContext(HottestMangaPageContext);
  const [data, setData] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [previousPageContext, setPreviousPageContext] = useState();

  const { colorScheme } = useColorScheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://mangakakalot.com/manga_list?type=topview&category=all&state=all&page=${pageContext[0]}`
        );
        const $ = cheerio.load(response.data);

        const fetchedData = $(".list-truyen-item-wrap")
          .map((index, elem) => ({
            mangaLink: $(elem).find(".list-story-item").attr("href"),
            mangaTitle: $(elem).find(".list-story-item").attr("title"),
            mangaImgSrc: $(elem).find(".list-story-item > img").attr("src"),
            mangaLatestChapter: $(elem)
              .find(".list-story-item-wrap-chapter")
              .text()
              .trim(),
            mangaDescription: $(elem)
              .find("p")
              .text()
              .trim()
              .replace("More.", "...."),
          }))
          .get();

        setData(fetchedData);
        setIsDataFetched(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!isDataFetched || pageContext[0] !== previousPageContext) {
      setIsDataFetched(false);
      fetchData();
      setPreviousPageContext(pageContext[0]);
    }
  }, [isDataFetched, pageContext[0]]);

  return (
    <SafeAreaProvider className="bg-white dark:bg-slate-950">
      <SafeAreaView
        className={
          isDataFetched ? "px-2" : "flex justify-center items-center h-[100vh]"
        }
      >
        {isDataFetched ? (
          <>
            <FlatList
              ItemSeparatorComponent={<View className="h-2 flex-1"></View>}
              data={data}
              renderItem={({ item }) => (
                <MangaComponent
                  mangaTitle={item.mangaTitle}
                  mangaImgSrc={item.mangaImgSrc}
                  mangaLink={item.mangaLink}
                  mangaLatestChapter={item.mangaLatestChapter}
                  mangaDescription={item.mangaDescription}
                />
              )}
              keyExtractor={(item) => item.mangaTitle}
              className="mb-16 rounded-lg"
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <>
            <ActivityIndicator
              size={128}
              color={colorScheme === "dark" ? "white" : colorContext[0].hex}
            />
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
