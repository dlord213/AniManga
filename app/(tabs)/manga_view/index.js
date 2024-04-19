import { Link, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import WebView from "react-native-webview";
import { View, Text, Pressable } from "react-native";
import { useColorScheme } from "nativewind";
import { AccentColorContext } from "../context/accent_color_context";
import { AntDesign } from "@expo/vector-icons";

export default function Page() {
  const { link } = useLocalSearchParams();

  const { colorScheme } = useColorScheme();
  const colorContext = useContext(AccentColorContext);

  const [isScriptInjected, setIsScriptInjected] = useState(false);

  const handleScriptInjection = () => {
    setIsScriptInjected(true);
  };

  const handleMessage = (event) => {
    if (event.nativeEvent.data === "ScriptInjected") {
      handleScriptInjection();
    }
  };

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
      window.ReactNativeWebView.postMessage('ScriptInjected');
    }, 1000);
  `;

  useEffect(() => {
    setIsScriptInjected(false);
  }, [link]);

  return (
    <>
      <WebView
        originWhitelist={["*"]}
        source={{ uri: link }}
        style={{ opacity: isScriptInjected ? 1 : 0 }}
        injectedJavaScript={injectedJavaScript}
        domStorageEnabled={true}
        scalesPageToFit={true}
        onMessage={handleMessage}
      />
    </>
  );
}
