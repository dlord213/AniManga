import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AccentColorContext } from "../context/accent_color_context";
import {
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useColorScheme } from "nativewind";
import axios from "axios";
import * as cheerio from "cheerio";
import { ChapterComponent } from "./components/ChapterComponent";
import { AboutMangaComponent } from "./components/AboutMangaComponent";

export default function Page() {
  const { link } = useLocalSearchParams();
  const colorContext = useContext(AccentColorContext);
  const { colorScheme } = useColorScheme();

  const [data, setData] = useState({});
  const [chapterData, setChapterData] = useState(null);

  useEffect(() => {
    setChapterData(null);
    setData({});

    const fetchData = async () => {
      try {
        const response = await axios.get(link);
        const $ = cheerio.load(response.data);

        const mangaTitle = $(".panel-story-info .story-info-right > h1")
          .text()
          .trim();
        const mangaImgSrc = $(".panel-story-info .img-loading").attr("src");
        const mangaDescription = $(".panel-story-info-description")
          .text()
          .trim()
          .replace(/^Description\s*:\s*/i, "");
        const mangaAuthor = $("tbody > tr:nth-child(2) > .table-value")
          .text()
          .trim();
        const mangaStatus = $("tbody > tr:nth-child(3) > .table-value")
          .text()
          .trim();
        const mangaLastUpdated = $(
          ".story-info-right-extent > p:nth-child(1) > .stre-value"
        )
          .text()
          .trim();

        const fetchedData = [
          {
            mangaTitle,
            mangaImgSrc,
            mangaDescription,
            mangaAuthor,
            mangaStatus,
            mangaLastUpdated,
          },
        ];

        let tempChapData = [];

        $("li.a-h").each((index, element) => {
          const $li = $(element);
          const $a = $li.find("a");
          const $timeSpan = $li.find("span.chapter-time");

          const href = $a.attr("href");
          const title = $a.text().trim();
          const time = $timeSpan.text().trim().replace(",", ", 20");

          tempChapData.push({ href, title, time });
        });

        setData(fetchedData);
        setChapterData(tempChapData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [link]);

  if (chapterData == null) {
    return (
      <SafeAreaProvider className="bg-white dark:bg-slate-950">
        <SafeAreaView className="flex justify-center items-center h-[100vh]">
          <ActivityIndicator
            size={128}
            color={colorScheme === "dark" ? "white" : colorContext[0].hex}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider className="bg-white dark:bg-slate-950">
      <SafeAreaView className="p-4">
        <FlatList
          data={chapterData}
          ListHeaderComponent={() => (
            <AboutMangaComponent {...data[0]} link={link} />
          )}
          renderItem={({ item }) => (
            <ChapterComponent
              title={item.title}
              time={item.time}
              link={item.href}
            />
          )}
          maxToRenderPerBatch={8}
          key={data[0].mangaTitle}
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
