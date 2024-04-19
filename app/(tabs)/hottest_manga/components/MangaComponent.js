import React from "react";
import {
  ImageBackground,
  Pressable,
  Text, View
} from "react-native";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export function MangaComponent(props) {
  return (
    <Link
      href={{
        pathname: "/manga_about",
        params: { link: props.mangaLink },
      }}
      asChild
    >
      <Pressable className="flex-1 overflow-ellipsis">
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
              className="text-white text-xl"
              style={{ fontFamily: "WorkSans_700Bold" }}
            >
              {props.mangaTitle}
            </Text>
            <View className="flex flex-row items-center gap-2">
              <AntDesign name="clockcircle" size={16} color="white" />
              <Text
                style={{ fontFamily: "WorkSans_400Regular" }}
                className="text-white flex-1"
              >
                {props.mangaLatestChapter}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </Pressable>
    </Link>
  );
}
