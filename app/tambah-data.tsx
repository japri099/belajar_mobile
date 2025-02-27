import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";
import { uploadImage } from "../lib/upload";

export default function TambahData() {
  const router = useRouter();

  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("");
  const [gambar, setGambar] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Cek apakah user sudah login
  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.replace("/login"); // Redirect ke login jika tidak login
      } else {
        setUser(data.user);
      }
    };
    checkUser();
  }, []);

  // Pilih Gambar dari Galeri
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setGambar(result.assets[0].uri);
      setUrl(""); // Hapus URL jika memilih gambar
    }
  };

  // Generate ID Unik
  const generateId = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetters = Array(4)
      .fill(null)
      .map(() => letters[Math.floor(Math.random() * letters.length)])
      .join("");
    const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    return `${randomLetters}-${randomNumbers}`;
  };

  // Simpan Data ke Supabase
  const handleSubmit = async () => {
    if (!deskripsi || !kategori || (!gambar && !url)) {
      Alert.alert("Error", "Semua field harus diisi.");
      return;
    }

    setLoading(true);
    let imageUrl = url; // Default pakai URL

    if (gambar) {
      try {
        const fileName = `${generateId()}.jpg`;
        const file = await fetch(gambar).then((res) => res.blob());
        const path = await uploadImage(file, fileName);
        imageUrl = supabase.storage.from("gambar").getPublicUrl(path)
          .data.publicUrl;
      } catch (error) {
        Alert.alert("Upload Gagal", error.message);
        setLoading(false);
        return;
      }
    }

    // Simpan ke database Supabase
    const { data, error } = await supabase.from("gambar").insert([
      {
        id: generateId(),
        deskripsi,
        kategori,
        gambar: imageUrl,
      },
    ]);

    setLoading(false);

    if (error) {
      Alert.alert("Gagal Menyimpan", error.message);
    } else {
      Alert.alert("Sukses", "Data berhasil ditambahkan!", [
        { text: "OK", onPress: () => router.replace("/home") },
      ]);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-5">
      <Text className="text-2xl font-bold mb-4">Tambah Data</Text>

      {/* Input Deskripsi */}
      <TextInput
        placeholder="Deskripsi"
        className="border w-full p-3 rounded-lg mb-3"
        value={deskripsi}
        onChangeText={setDeskripsi}
      />

      {/* Input Kategori */}
      <TextInput
        placeholder="Kategori"
        className="border w-full p-3 rounded-lg mb-3"
        value={kategori}
        onChangeText={setKategori}
      />

      {/* Pilih Gambar */}
      <TouchableOpacity
        className="bg-gray-200 p-3 rounded-lg mb-3"
        onPress={pickImage}
      >
        <Text>Pilih Gambar</Text>
      </TouchableOpacity>

      {gambar && (
        <Image source={{ uri: gambar }} className="w-32 h-32 mt-2 rounded-lg" />
      )}

      {/* Input URL Gambar */}
      <TextInput
        placeholder="Atau Masukkan URL Gambar"
        className="border w-full p-3 rounded-lg mb-3"
        value={url}
        onChangeText={(text) => {
          setUrl(text);
          setGambar(null); // Hapus gambar jika input URL
        }}
      />

      {/* Tombol Simpan */}
      <TouchableOpacity
        className="bg-blue-500 p-3 rounded-lg"
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-lg">Simpan</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
