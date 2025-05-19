import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import api from "../../../api";
import * as SecureStore from 'expo-secure-store';

export default function Profile() {
  const router = useRouter();
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/user");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    router.push("guest/login"); 
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingBottom: 6,
          width: "100%",
          justifyContent: "space-between",
            paddingHorizontal: 20,
        }}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => router.back()}
        />
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Profile</Text>
        <Ionicons
          name="heart-outline"
          size={24}
          color="black"
          style={{ marginRight: 10 }}
          onPress={() => router.push("/modal")}
        />
      </View>

      <Image
        source={require("../../../assets/images/profile.png")}
        style={{ width: 150, height: 150, borderRadius: 20 }}
      />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>
        {data.name}
      </Text>
      <Text style={{ fontSize: 16, color: "#121212B2", marginTop: 10 }}>
        {data.email}
      </Text>

      <View style={{ width: "100%", width: "100%", paddingHorizontal: 20, backgroundColor: "#FFFEF9", marginTop: 20 }}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/profile/myProfile")} style={{ flexDirection: "row", alignItems: "center", paddingBottom: 6, width: "100%", justifyContent: "space-between" }} >
            <Ionicons name="person-outline" size={24} color="black" style={{ marginTop: 20 }} />
            <Text style={{ fontSize: 16, color: "#121212B2", marginTop: 20 }}>
                My Profile
            </Text>
            <Ionicons name="chevron-forward-outline" size={24} color="black" style={{ marginTop: 20, marginLeft: 200 }} />
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", paddingBottom: 6, width: "100%", justifyContent: "space-between" }} onPress={() => router.push("/(tabs)/profile/order")}>
            <Ionicons name="bag-check-outline" size={24} color="black" style={{ marginTop: 20 }} />
            <Text style={{ fontSize: 16, color: "#121212B2", marginTop: 20 }}>
                My Orders
            </Text>
            <Ionicons name="chevron-forward-outline" size={24} color="black" style={{ marginTop: 20, marginLeft: 200 }} />
        </TouchableOpacity>

        <TouchableOpacity
  style={{
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 6,
    width: "100%",
    justifyContent: "space-between"
  }}
  onPress={handleLogout}
>
            <Ionicons name="log-out-outline" size={24} color="black" style={{ marginTop: 20 }} />
            <Text style={{ fontSize: 16, color: "#121212B2", marginTop: 20 }}>
                Log Out
            </Text>
            <Ionicons name="chevron-forward-outline" size={24} color="black" style={{ marginTop: 20, marginLeft: 200 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    alignItems: "center",
  },
});
