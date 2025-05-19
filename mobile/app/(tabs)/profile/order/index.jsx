import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import api from "../../../../api";
import { BASE } from "../../../../url";

export default function Order() {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/carts");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    router.push("guest/login");
  };

  const getStatusIcon = (status) => {
    if (status === "pending") return "ellipsis-horizontal-outline";
    if (status === "paid") return "checkmark-done-outline";
    return "close-circle-outline";
  };

  const getStatusColor = (status) => {
    if (status === "pending") return "#FFA500"; // orange
    if (status === "paid") return "#4CAF50";    // green
    return "#F44336";                           // red
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" onPress={() => router.back()} />
        <Text style={styles.title}>My Orders</Text>
        <Ionicons name="heart-outline" size={24} color="black" onPress={() => router.push("/modal")} />
      </View>

      <ScrollView style={styles.scroll}>
        {data.map((item, index) => {
          const firstImage = item?.items?.[0]?.item?.first_image?.url;
          return (
            <TouchableOpacity onPress={() => router.push(`(tabs)/profile/order/${item.id}`)} key={index} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.status}>{item.status}</Text>
                <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
              </View>

              <View style={styles.orderInfo}>
                <View style={styles.imageRow}>
                  <Image
                    source={{ uri: firstImage ? BASE + '/storage/' + firstImage : 'https://via.placeholder.com/50' }}
                    style={styles.image}
                  />
                  <Text style={styles.total}>₮{item.total.toLocaleString()}</Text>
                </View>
                <Ionicons name={getStatusIcon(item.status)} size={24} color={getStatusColor(item.status)} />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 6,
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  scroll: {
    width: "100%",
    padding: 20,
  },
  orderCard: {
    width: "100%",
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ddd",
    marginBottom: 20,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  status: {
    textTransform: "capitalize",
  },
  date: {
    color: "#999",
  },
  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  total: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
