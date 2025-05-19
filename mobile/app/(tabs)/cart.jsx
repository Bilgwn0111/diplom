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
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Cart() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const cartData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("cart");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await cartData();
      setCart(data);
    };
    fetchData();
  }, []);

  const decreaseQty = async (item) => {
    const updatedCart = cart.map((cartItem) => {
      if (cartItem.id === item.id) {
        return { ...cartItem, qty: cartItem.qty - 1 };
      }
      return cartItem;
    });
    setCart(updatedCart);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  const increaseQty = async (item) => {
    const updatedCart = cart.map((cartItem) => {
      if (cartItem.id === item.id) {
        return { ...cartItem, qty: cartItem.qty + 1 };
      }
      return cartItem;
    });
    setCart(updatedCart);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const createCart = async () => {
    try {
      const essentials = cart.map(item => ({
        id: item.id,
        qty: item.qty,
      }));
      const response = await api.post("/cart", essentials );
      if (response.status === 200) {
        router.push(`/(tabs)/profile/order/${response.data.cart_id}`);
        await AsyncStorage.removeItem("cart");
      } 
    } catch (error) {
      console.error("Error creating cart:", error);
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
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
          My Cart
        </Text>
        <Text style={{ width: "30%" }}></Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexDirection: "row",
          gap: 10,
          width: "100%",
          justifyContent: "space-between",
          paddingVertical: 20,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "30%",
          }}
        >
          <View
            style={{
              height: 30,
              width: 30,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#FC9AC4",
              borderRadius: 50,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
              1
            </Text>
          </View>
          <Text
            style={{ color: step === 1 ? "#FC9AC4" : "black", fontSize: 15 }}
          >
            Cart
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "30%",
          }}
        >
          <View
            style={{
              height: 30,
              width: 30,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#FC9AC4",
              borderRadius: 50,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
              2
            </Text>
          </View>
          <Text
            style={{ color: step === 2 ? "#FC9AC4" : "black", fontSize: 15 }}
          >
            Payment
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "30%",
          }}
        >
          <View
            style={{
              height: 30,
              width: 30,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#FC9AC4",
              borderRadius: 50,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
              3
            </Text>
          </View>
          <Text
            style={{ color: step === 3 ? "#FC9AC4" : "black", fontSize: 15 }}
          >
            Order Placed
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexWrap: "wrap",
          justifyContent: "space-between",
          paddingHorizontal: 24,
        }}
      >
        {cart &&
          cart.length > 0 &&
          cart.map((item) => (
            <View
              key={item.id}
              style={{
                flex: 1,
                marginBottom: 20,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: 'space-between'
              }}
            >
              <Image
                source={{ uri: `${BASE}/storage/${item.image}` }}
                style={{ width: 137, height: 137, borderRadius: 10, marginRight: 10 }}
              />
              <View>
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", marginTop: 10 }}
                >
                  {item.name}
                </Text>
                <Text style={{ fontSize: 16, color: "#FC9AC4" }}>
                  {item.price} ₮
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 20,
                  gap: 10,
                  marginLeft: 30,
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 20,
                    width: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    if (item.qty > 1) {
                      decreaseQty(item);
                    }
                  }}
                >
                  <Text style={{ color: "black", fontSize: 16 }}>-</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 16, marginVertical: 10 }}>
                  {item.qty}
                </Text>
                <TouchableOpacity
                  style={{
                    height: 20,
                    width: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                  onPress={() => increaseQty(item)}
                >
                  <Text style={{ color: "black", fontSize: 16 }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 40,
        }}
      >
        <TouchableOpacity style={{ width: "40%" }}>
          <Text
            style={{
              backgroundColor: "#FC9AC4",
              padding: 10,
              borderRadius: 10,
              width: "100%",
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
              color: "white",
            }}
            onPress={() => {
              router.back();
            }}
          >
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={createCart} style={{ width: "40%" }}>
          <Text
            style={{
              backgroundColor: "#FC9AC4",
              padding: 10,
              borderRadius: 10,
              width: "100%",
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Next
          </Text>
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
    paddingHorizontal: 20,
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
