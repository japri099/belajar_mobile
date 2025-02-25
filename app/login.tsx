import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginWithEmail = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password harus diisi!");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Login Gagal", error.message);
    } else {
      Alert.alert("Login Berhasil", "Selamat datang!");
      router.push("/home");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-black">Login</Text>

      {/* Input Email */}
      <TextInput
        className="w-3/4 p-3 mt-5 border border-gray-300 rounded-lg"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />

      {/* Input Password */}
      <TextInput
        className="w-3/4 p-3 mt-3 border border-gray-300 rounded-lg"
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      {/* Tombol Login */}
      <TouchableOpacity
        className="mt-5 px-5 py-3 bg-blue-500 rounded-lg"
        onPress={handleLoginWithEmail}
      >
        <Text className="text-white text-lg">Login</Text>
      </TouchableOpacity>
    </View>
  );
}
