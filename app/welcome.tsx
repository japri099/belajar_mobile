import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { responsiveFontSize } from "react-native-responsive-fontsize";
import { router } from "expo-router";

export default function Welcome() {
  const [fontsLoaded] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text
        className="text-3xl font-bold text-black"
        style={{ fontFamily: "SpaceMono-Regular" }}
      >
        Selamat Datang!
      </Text>
      <TouchableOpacity
        className="mt-5 px-5 py-3 bg-blue-500 rounded-lg"
        onPress={() => router.push("/login")}
      >
        <Text className="text-white text-lg">Login dengan Google</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
