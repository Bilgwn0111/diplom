import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Link, useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons'; // Importing Ionicons
import api from "../../api";
import { useRouter } from "expo-router";


export default function RegisterScreen() {
  const navigation = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [name, setName] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility toggle
  const handleRegister = async () => {
    if (email && password && name) {
      try {
        const response = await api.post('/register', {
          name: name,
          email: email,
          password: password,
          password_confirmation: confirmPassword,

        });
        console.log(response.status);
        
        if (response.status === 200) {
          alert('Registration successful!');
          navigation.push("/guest/login"); // Navigate to login
        }
      } catch (error) {
        console.log(error);
        
        if (error.response && error.response.data && error.response.data.errors) {
          const messages = Object.values(error.response.data.errors)
            .flat()
            .join("\n");
          alert(messages);
        } else {
          alert("Something went wrong. Please try again.");
        }
      }
    } else {
      alert("Please fill in all fields.");
    }
  };
  

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState); // Toggle password visibility
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/whitelogo.png")} style={styles.image}  />
      <View style={styles.form}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}> Enter your email and password</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#121212B2" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Name"
            autoCapitalize="none"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Email Input with Icon */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#121212B2" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password Input with Icon and Eye Toggle */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#121212B2" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!isPasswordVisible} // Toggle password visibility
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <Ionicons 
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} // Change icon based on visibility
              size={20} 
              color="#121212B2" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
  <Ionicons name="lock-closed-outline" size={20} color="#121212B2" style={styles.icon} />
  <TextInput
    style={styles.input}
    placeholder="Confirm Password"
    secureTextEntry={!isPasswordVisible}
    value={confirmPassword}
    onChangeText={setConfirmPassword}
  />
</View>


        <Link to="/guest/forgotpassword" style={{ marginBottom: 24 }}>
          <Text style={{ color: "#121212B2", textAlign: "right", fontSize: 10, fontWeight: "bold" }}>Forgot Password?</Text>
        </Link>
        
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <View style={{ height: 1, backgroundColor: "#0000004D", flex: 1 }}></View>
          <Text style={{ marginHorizontal: 8, marginVertical: 16, color: "#0000004D" }}>or</Text>
          <View style={{ height: 1, backgroundColor: "#0000004D", flex: 1 }}></View>
        </View>
        
        <TouchableOpacity style={styles.buttonWhite} onPress={() => navigation.push("/guest/login")}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingTop: 50,
  },
  form: {
    flex: 1,
    backgroundColor: '#FFFDF2',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#121212B2",
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#121212",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    padding: 5,
  },
  button: {
    backgroundColor: "#E3CED7",
    borderRadius: 50,
    padding: 18,
    alignItems: "center",
  },
  buttonText: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonWhite: {
    backgroundColor: "#FFFDF2",
    borderRadius: 50,
    padding: 18,
    alignItems: "center",
    borderColor: "#0000004D",
    borderWidth: 1
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "SpaceMono",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    fontWeight: "italic",
    textAlign: "center",
  },
  image: {
    width: 280,
    height: 180,
    alignSelf: "center",
    marginBottom: 24,
  }
});
