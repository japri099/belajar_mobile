import React from "react";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text
        className="text-3xl font-bold text-black"
        style={{ fontFamily: "SpaceMono-Regular" }}
      >
        Selamat Datang!
      </Text>

      {/* Button Login */}
      <TouchableOpacity
        className="mt-5 px-5 py-3 bg-blue-500 rounded-lg"
        onPress={() => router.push("/login")}
      >
        <Text className="text-white text-lg">Login</Text>
      </TouchableOpacity>

      {/* Button Masuk Tanpa Login */}
      <TouchableOpacity
        className="mt-3 px-5 py-3 bg-gray-500 rounded-lg"
        onPress={() => router.push("/home")}
      >
        <Text className="text-white text-lg">Masuk Tanpa Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
