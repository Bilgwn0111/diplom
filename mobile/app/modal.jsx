import { StatusBar } from "expo-status-bar";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import api from "../api";
import { BASE } from "@/url";
export default function ModalScreen() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/favorites");
        setItems(response.data.items);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: 20,
        }}
      >
        <Ionicons
          name="arrow-back"
          size={32}
          color="black"
          style={{ width: "30%" }}
          onPress={() => router.back()}
        />
        <Text
          style={{
            width: "30%",
            textAlign: "center",
            fontSize: 23,
            fontWeight: "bold",
          }}
        >
          Favorite
        </Text>
        <Text style={{ width: "30%" }}></Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          paddingHorizontal: 24,
        }}
      >
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push(`/item/${item.id}`)}
            style={{
              width: "48%",
              borderWidth: 1,
              borderColor: "#B2B2B2",
              borderRadius: 30,
              marginBottom: 20,
              paddingHorizontal: 10,
              backgroundColor: "white",
            }}
          >
            <Ionicons
              name="heart"
              size={24}
              color="#FC9AC4"
              style={{ marginRight: 10, alignSelf: "flex-end", marginTop: 10 }}
            />
            <Image
              source={{ uri: `${BASE}/storage/${item?.first_image?.url}` }}
              style={{ width: "100%", height: 150, borderRadius: 30 }}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                {item.name}
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                ₮{item.price.toLocaleString()}
              </Text>
            </View>

            <Text style={{ color: "#fc9ac4", fontSize: 12 }}>
              {item.subname}
            </Text>
            <Ionicons
              name="add-circle-outline"
              size={24}
              color="#FC9AC4"
              style={{ alignSelf: "flex-end", marginBottom: 8 }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    paddingHorizontal: 20,
  },
});
