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
import api from "../../../../api";
import { BASE } from "../../../../url";
import { useGlobalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { use } from "react";

export default function SingleOrder() {
  const router = useRouter();
  const [step, setStep] = useState(2);
  const [user, setUser] = useState({});
  const [total, setTotal] = useState(0);
  const { id } = useLocalSearchParams();
  const [data, setData] = useState(null); 

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const response = await api.get(`/cart/${id}`);
        setTotal(response.data.total);
        setData(response.data);
        
      } catch (error) {
        console.error("Error fetching total:", error);
      }
    };
  
    if (id) {
      fetchTotal();
    }
  }, [id]);
  
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);
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
      const essentials = cart.map((item) => ({
        id: item.id,
        qty: item.qty,
      }));
      const response = await api.post("/cart", essentials);
      if (response.status === 200) {
        router.push("/(tabs)/payment");
        await AsyncStorage.removeItem("cart");
      }
    } catch (error) {
      console.error("Error creating cart:", error);
    }
  };

  console.log(cart);
  

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

      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 20,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 14 }}>Total Amount</Text>
        <Text style={{ fontWeight: "bold", fontSize: 24 }}>₮{total?.toLocaleString()}</Text>
      </View>

        {
          data?.status === "pending" ? (
            <>
                        <Text style={{ fontWeight: "bold", marginVertical: 20 }}>Bank App</Text>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("./../../../../assets/images/khan.png")}
                  style={{ width: 70, height: 70, borderRadius: 20 }}
                />
                <Text style={{ fontSize: 10, fontWeight: "bold" }}>Khan Bank</Text>
              </View>
      
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("./../../../../assets/images/statebank.png")}
                  style={{ width: 70, height: 70, borderRadius: 20 }}
                />
                <Text style={{ fontSize: 10, fontWeight: "bold" }}>State Bank</Text>
              </View>
      
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("./../../../../assets/images/tdb.png")}
                  style={{ width: 70, height: 70, borderRadius: 20 }}
                />
                <Text style={{ fontSize: 10, fontWeight: "bold" }}>TBD Bank</Text>
              </View>
            </View>
            </>
          ) : data?.status === "paid" ? (
            <View style={{ width: "100%", alignItems: "center", paddingVertical: 20 }}>
              <Text style={{ fontWeight: "bold", fontSize: 20, color: "#4CAF50" }}>Order Placed</Text>
              <Text style={{ fontSize: 16, color: "#121212B2" }}>
                Your order has been placed successfully.
              </Text>
            </View>
          ) : (
            <View style={{ width: "100%", alignItems: "center", paddingVertical: 20 }}>
              <Text style={{ fontWeight: "bold", fontSize: 20, color: "red" }}>Order Cancelled</Text>
              <Text style={{ fontSize: 16, color: "#121212B2" }}>
                Your order has been cancelled.
              </Text>
            </View>
          )
        }

      <Text style={{ fontWeight: "bold", marginVertical: 5, fontSize: 20 }}>
        Customer Information
      </Text>

      <View
        style={{
          width: "100%",
          paddingVertical: 20,
          paddingHorizontal: 10,
          backgroundColor: "#FFFEF9",
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
        }}
      >
        <View style={{ borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 10, color: "#121212B2", marginBottom: 5 }}>
            Name
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{user.name}</Text>
        </View>

        <View style={{ borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 10, color: "#121212B2", marginBottom: 5 }}>
            Email
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{user.email}</Text>
        </View>

        <View style={{ borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 10, color: "#121212B2", marginBottom: 5 }}>
            Phone Number
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            +976 80512498
          </Text>
        </View>
      </View>

      <Text style={{ fontWeight: "bold", marginVertical: 5, fontSize: 20 }}>
        Delivery Address
      </Text>
      <View
        style={{
          width: "100%",
          paddingVertical: 20,
          paddingHorizontal: 10,
          backgroundColor: "#FFFEF9",
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
        }}
      >
        <View style={{ borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 10, color: "#121212B2", marginBottom: 5 }}>
            Address
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {user.address}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 30,
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
