import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase"; // Import Supabase

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Logout Gagal", error.message);
    } else {
      Alert.alert("Logout Berhasil", "Anda telah keluar.");
      router.replace("/welcome");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-black">Selamat Datang!</Text>

      {/* Button Logout */}
      <TouchableOpacity
        className="mt-5 px-5 py-3 bg-red-500 rounded-lg"
        onPress={handleLogout}
      >
        <Text className="text-white text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
