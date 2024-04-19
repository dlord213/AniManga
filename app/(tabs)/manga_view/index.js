import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useContext } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as cheerio from "cheerio";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useColorScheme } from "nativewind";
import { AccentColorContext } from "../context/accent_color_context";
import { Image } from "expo-image";
import React from "react";
import WebView from "react-native-webview";
import { StatusBar } from "expo-status-bar";

export default function Page() {
  const { link } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const colorContext = useContext(AccentColorContext);

  const injectedJavaScript = `
    const scriptToRemove = document.querySelector('script[src="//platform.bidgear.com/ads.php?domainid=1623&sizeid=16&zoneid=8431"]');
      if (scriptToRemove) {
        scriptToRemove.parentNode.removeChild(scriptToRemove);
      }
    setTimeout(() => {
      const container = document.querySelector('.container-chapter-reader');
      if (container) {
        const images = Array.from(container.querySelectorAll('img'));
        document.body.innerHTML = '';
        images.forEach(img => {
          img.style.width = '100%';
          img.style.height = 'auto';
          img.style.marginTop = '0';
          document.body.appendChild(img);
        });
      }
    }, 500);
  `;

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ uri: link }}
      injectedJavaScript={injectedJavaScript}
      style={{ backgroundColor: "transparent" }}
      domStorageEnabled={true}
      scalesPageToFit={true}
      onShouldStartLoadWithRequest={() => false}
    />
  );
}
