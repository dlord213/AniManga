import React from "react";
import {
  ImageBackground,
  Text, View,
  Pressable
} from "react-native";
import { Link } from "expo-router";

export function MangaComponent(props) {
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
