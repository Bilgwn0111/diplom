import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../../../api";

export default function Profile() {
  const router = useRouter();
  const [data, setData] = useState({});
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/user");
        setData(response.data);
        setForm({
          name: response.data.name,
          email: response.data.email,
          address: response.data.address,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const response = await api.put("/user", form);
      setData(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
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
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Ionicons name="create-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Image
        source={require("../../../../assets/images/profile.png")}
        style={styles.image}
      />

      {/* Name */}
      <View style={styles.infoBlock}>
        <Ionicons
          name="person-outline"
          size={24}
          color="black"
          style={styles.icon}
        />
        <View style={styles.info}>
          <Text style={styles.label}>Name</Text>
          {isEditing ? (
            <TextInput
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              style={styles.input}
            />
          ) : (
            <Text>{data.name}</Text>
          )}
        </View>
      </View>

      {/* Email */}
      <View style={styles.infoBlock}>
        <Ionicons
          name="mail-outline"
          size={24}
          color="black"
          style={styles.icon}
        />
        <View style={styles.info}>
          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text>{data.email}</Text>
          )}
        </View>
      </View>

      {/* Phone (static for now) */}
      <View style={styles.infoBlock}>
        <Ionicons
          name="call-outline"
          size={24}
          color="black"
          style={styles.icon}
        />
        <View style={styles.info}>
          <Text style={styles.label}>Phone</Text>
          <Text>+976 99299620</Text>
        </View>
      </View>

      {/* Address */}
      <View style={styles.infoBlock}>
        <Ionicons
          name="location-outline"
          size={24}
          color="black"
          style={styles.icon}
        />
        <View style={styles.info}>
          <Text style={styles.label}>Address</Text>
          {isEditing ? (
            <TextInput
              value={form.address}
              onChangeText={(text) => setForm({ ...form, address: text })}
              style={styles.input}
            />
          ) : (
            <Text>{data.address}</Text>
          )}
        </View>
      </View>

      {/* Save Button */}
      {isEditing && (
        <TouchableOpacity onPress={handleSave} style={{ width: "40%" }}>
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
              marginTop: 30,
            }}
          >
            Save
          </Text>
        </TouchableOpacity>
      )}
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
  image: {
    width: 150,
    height: 150,
    borderRadius: 20,
    marginVertical: 10,
  },
  infoBlock: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    borderBottomWidth: 2,
    borderBottomColor: "lightgray",
    paddingBottom: 10,
    marginTop: 20,
  },
  icon: {
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  label: {
    color: "gray",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 4,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "green",
    borderRadius: 8,
  },
});
