import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useGlobalSearchParams, useRouter } from "expo-router";
import api from "../../api";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { BASE } from "../../url";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

/**
 * Renders a single item page with details fetched from an API.
 * Allows users to view item images in a carousel, adjust quantity,
 * add the item to a favorites list or shopping cart, and access
 * an external AR camera link. Displays the item's name, description,
 * and price, and includes interactive elements for navigation and
 * cart management.
 */

export default function Single() {
  const param = useGlobalSearchParams();
  const [data, setData] = useState(null); // Set initial data state to null
  const [currentIndex, setCurrentIndex] = useState(0); // Track current carousel index
  const [qty, setQty] = useState(1);
  const router = useRouter();
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get(`/items/${param.id}`);
        setData(response.data); // Set data when response is received
        if (response.status !== 200) {
          console.error("Error fetching item:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };
    if (param.id) {
      fetchItems(); // Fetch item data when component mounts
    }
  }, [param.id]);

  // Render loading state while fetching data
  if (!data) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const addFavorite = async () => {
    try {
      const response = await api.post("/favorites", { item_id: data.id });
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  // Handle carousel index change
  const handleCarouselChange = (index) => {
    setCurrentIndex(index); // Update current index for indicator bullets
  };

  // Function to add item to cart and save it in AsyncStorage
  const addToCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem("cart");
      const parsedCartData = cartData ? JSON.parse(cartData) : [];

      const itemIndex = parsedCartData.findIndex((item) => item.id === data.id);

      if (itemIndex !== -1) {
        // Item exists: update quantity
        parsedCartData[itemIndex].qty += qty;
      } else {
        // Add full item data with quantity
        parsedCartData.push({
          id: data.id,
          name: data.name,
          price: data.price,
          image: data.first_image?.url || (data.images?.[0]?.url ?? null),
          qty,
        });
      }

      await AsyncStorage.setItem("cart", JSON.stringify(parsedCartData));
      router.push("/(tabs)/cart");
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const openExternalLink = () => {
    const url = 'https://trillion.jewelry/widget.html?id=demo-store2';
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => router.back()}
        />
        <Ionicons
          name="heart-outline"
          size={24}
          color="black"
          onPress={addFavorite}
        />
      </View>

      <Text style={styles.title}>{data.name}</Text>

      {/* Using react-native-reanimated-carousel for image slider */}
      <Carousel
        loop
        width={300}
        height={300}
        autoPlay={false}
        data={data.images}
        renderItem={({ item }) => (
          <Image
            source={{ uri: `${BASE}/storage/${item.url}` }}
            style={styles.image}
          />
        )}
        onSnapToItem={handleCarouselChange}
      />

      {/* Carousel Indicator Bullets */}
      <View style={styles.indicatorContainer}>
        {data.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>

      <View
        style={{
          justifyContent: "center",
          height: 200,
          width: "100%",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text>{data.description}</Text>
      </View>

      <View
        style={{
          alignSelf: "flex-start",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          marginTop: 20,
        }}
      >
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Price</Text>
          <Text style={{ fontWeight: "bold", fontSize: 22 }}>
            {data.price.toLocaleString()} ₮
          </Text>
        </View>

        <TouchableOpacity onPress={openExternalLink}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>AR Camera </Text>
          <Ionicons 
            name="camera-outline"
            size={30}
            color="black"
            style={{ alignSelf: "flex-end" }}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          marginTop: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 19,
            padding: 10,
          }}
        >
          <Pressable
            onPress={() => setQty(qty - 1)}
            style={{
              height: 30,
              width: 30,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderRadius: 10,
            }}
            disabled={qty <= 1}
          >
            <Text style={{ color: "black", fontSize: 16 }}>-</Text>
          </Pressable>
          <Text style={{ fontSize: 16, marginVertical: 10 }}>{qty}</Text>
          <Pressable
            onPress={() => setQty(qty + 1)}
            style={{
              height: 30,
              width: 30,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "black", fontSize: 16 }}>+</Text>
          </Pressable>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#FC9AC4",
            padding: 10,
            borderRadius: 10,
            width: "40%",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={addToCart} // Call the addToCart function
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            + Add to Cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    paddingTop: 50,
    alignItems: "center",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  subname: {
    fontSize: 16,
    color: "gray",
  },
  description: {
    fontSize: 14,
    marginVertical: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    alignSelf: "center",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  indicator: {
    width: 10,
    height: 6,
    margin: 3,
    borderRadius: 5,
    backgroundColor: "gray",
  },
  activeIndicator: {
    backgroundColor: "black",
    width: 20,
  },
});
