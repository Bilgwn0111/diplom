import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import api from "../../api";
import { BASE } from "../../url";
import { useRouter } from "expo-router";

export default function SearchScreen() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [value, onChangeText] = useState("");
  const [items, setItems] = useState([]);
  const router = useRouter();

  const onChange = (text) => {
    onChangeText(text);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const cat = selectedCategory?.id || "";
        const response = await api.get(`/items?category=${cat}&name=${value}`);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, [selectedCategory, value]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#121212B2",
          borderRadius: 60,
          padding: 12,
          marginHorizontal: 24,
          marginBottom: 20,
        }}
      >
        <Ionicons name="search" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={value}
          onChangeText={onChange}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ height: 50 }} // or just `height: 50`
        contentContainerStyle={{ alignItems: "center", paddingHorizontal: 23 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            onPress={() => setSelectedCategory(category)}
            key={category.id}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderWidth: 1,
              borderRadius: 15,
              margin: 3,
              borderColor:
                selectedCategory?.id === category.id
                  ? "transparent"
                  : "#A8A8A8",
              backgroundColor:
                selectedCategory?.id === category.id
                  ? "#FC9AC4"
                  : "transparent",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color:
                  selectedCategory?.id === category.id ? "white" : "#FC9AC4",
              }}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView
        contentContainerStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 24,
          gap: 10,
          marginTop: 20,
        }}
      >
        {items.map((item) => (
            <TouchableOpacity onPress={() => router.push(`/item/${item.id}`)} key={item.id} style={{ flexDirection: "row", gap: 10, marginVertical: 10,  alignItems: "center" }}>
                <Image source={{ uri: `${BASE}/storage/${item.first_image.url}` }} style={{ width: 150, height: 150, borderRadius: 10 }} />  
                <View>
                    <Text style={{fontFamily:'SpaceMono', fontSize: 32}}>{item.name}</Text>
                    <Text style={{ color: "#12112B2", fontSize: 16 }}>{item.price} ₮</Text>
                    <Text style={{ color: "#121212B2" }}>Quantity: 1</Text>
                </View>
            </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
