import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
  Modal,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterField, setFilterField] = useState("id");
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editedDeskripsi, setEditedDeskripsi] = useState("");
  const [editedKategori, setEditedKategori] = useState("");
  const [editedGambar, setEditedGambar] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/welcome");
      } else {
        setSession(data.session);
      }
    };

    checkSession();
    fetchData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase.from("gambar").select("*");
    if (error) {
      Alert.alert("Gagal Memuat Data", error.message);
    } else {
      setData(data);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Konfirmasi", "Yakin ingin menghapus data ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        onPress: async () => {
          const { error } = await supabase.from("gambar").delete().eq("id", id);
          if (error) {
            Alert.alert("Gagal Menghapus", error.message);
          } else {
            Alert.alert("Sukses", "Data berhasil dihapus");
            fetchData();
          }
        },
      },
    ]);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setEditedDeskripsi(item.deskripsi);
    setEditedKategori(item.kategori);
    setEditedGambar(item.gambar); // Tambahkan gambar ke modal
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editItem) return;

    const { error } = await supabase
      .from("gambar")
      .update({
        deskripsi: editedDeskripsi,
        kategori: editedKategori,
        gambar: editedGambar,
      })
      .eq("id", editItem.id);

    if (error) {
      Alert.alert("Gagal Mengupdate", error.message);
    } else {
      Alert.alert("Sukses", "Data berhasil diupdate");
      setModalVisible(false);
      fetchData();
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout Gagal", error.message);
    } else {
      Alert.alert("Logout Berhasil", "Anda telah keluar.");
      router.replace("/welcome");
    }
  };

  const filteredData = data.filter((item) =>
    item[filterField]
      ?.toString()
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const getImageUrl = (gambar) => {
    if (!gambar) return null;

    // Jika gambar sudah berupa URL, langsung gunakan
    if (gambar.startsWith("http")) {
      return gambar;
    }

    // Jika gambar adalah path dari Supabase Storage, buat URL-nya
    const { data } = supabase.storage.from("gambar").getPublicUrl(gambar);
    return data.publicUrl;
  };

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row justify-between items-center bg-gray-100 p-4">
        <Text className="text-lg font-bold text-black">Home</Text>

        {session && (
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="px-4 py-2 bg-green-500 rounded-lg"
              onPress={() => router.push("/tambah-data")}
            >
              <Text className="text-white text-sm">Tambah Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-4 py-2 bg-red-500 rounded-lg"
              onPress={handleLogout}
            >
              <Text className="text-white text-sm">Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View className="mt-4">
        <TextInput
          placeholder="Cari..."
          className="border p-2 rounded-lg"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Picker
          selectedValue={filterField}
          onValueChange={(itemValue) => setFilterField(itemValue)}
          className="border p-2 rounded-lg mt-2"
        >
          <Picker.Item label="ID" value="id" />
          <Picker.Item label="Deskripsi" value="deskripsi" />
          <Picker.Item label="Kategori" value="kategori" />
        </Picker>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="border p-3 mt-2 rounded-lg bg-gray-100">
            <Text>ID: {item.id}</Text>
            <Text>Deskripsi: {item.deskripsi}</Text>
            <Text>Kategori: {item.kategori}</Text>

            {item.gambar ? (
              <Image
                source={{ uri: getImageUrl(item.gambar) }}
                className="w-40 h-40 mt-2 rounded-lg"
              />
            ) : (
              <Text className="text-red-500 mt-2">Gambar tidak tersedia</Text>
            )}

            <View className="flex-row space-x-2 mt-2">
              <TouchableOpacity
                className="px-4 py-2 bg-yellow-500 rounded-lg"
                onPress={() => handleEdit(item)}
              >
                <Text className="text-white text-sm">Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="px-4 py-2 bg-red-500 rounded-lg"
                onPress={() => handleDelete(item.id)}
              >
                <Text className="text-white text-sm">Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal Edit */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-lg font-bold mb-4">Edit Data</Text>

            <TextInput
              placeholder="Deskripsi"
              className="border p-2 mb-2 rounded-lg"
              value={editedDeskripsi}
              onChangeText={setEditedDeskripsi}
            />
            <TextInput
              placeholder="Kategori"
              className="border p-2 mb-2 rounded-lg"
              value={editedKategori}
              onChangeText={setEditedKategori}
            />
            <TextInput
              placeholder="URL Gambar"
              className="border p-2 mb-2 rounded-lg"
              value={editedGambar}
              onChangeText={setEditedGambar}
            />

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="px-4 py-2 bg-blue-500 rounded-lg"
                onPress={handleSaveEdit}
              >
                <Text className="text-white text-sm">Simpan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="px-4 py-2 bg-gray-500 rounded-lg"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white text-sm">Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
