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

export default function Two() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [value, onChangeText] = useState("");
  const [items, setItems] = useState([]);
  const router = useRouter()
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
        const cat = selectedCategory?.id || '';
        const response = await api.get(
          `/items?category=${cat}&name=${value}`
        );
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

      <Text
        style={{
          fontSize: 16,
          textAlign: "left",
          fontWeight: "bold",
          marginTop: 24,
          marginLeft: 24,
          marginBottom: 8,
        }}
      >
        Categories
      </Text>

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

      <Text
        style={{
          fontSize: 16,
          textAlign: "left",
          fontWeight: "bold",
          marginTop: 24,
          marginLeft: 24,
          marginBottom: 8,
        }}
      >
        Trending Items
      </Text>

      <ScrollView
  contentContainerStyle={{
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 24
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
        style={{ width: '100%', height: 150, borderRadius: 30 }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: "bold", fontSize: 12 }}>{item.name}</Text>
        <Text style={{ fontWeight: "bold", fontSize: 12 }}>₮{item.price.toLocaleString()}</Text>
      </View>

      <Text style={{ color: '#fc9ac4', fontSize: 12 }}>
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
    backgroundColor: "#fff",
    paddingTop: 30,
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
