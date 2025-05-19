import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, View, TouchableOpacity, StyleSheet } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

// Icon wrapper
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

// Custom tab bar with a big center button
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBar}>
      {state.routes
        .filter((route) => route.name !== "profile/order/index")
        .filter((route) => route.name !== "profile/order/[id]")
        .filter((route) => route.name !== "profile/myProfile/index")
        .map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            if (index === 2) {
              // Central big button logic
              navigation.navigate("two"); // Navigate or open modal here
              return;
            }

            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const isMiddle = index === 2;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={isMiddle ? styles.middleTab : styles.tab}
            >
              {isMiddle ? (
                <View style={styles.middleButton}>
                  <Ionicons name="bag" size={32} color="#fff" />
                </View>
              ) : (
                <Ionicons
                  name={
                    route.name === "index"
                      ? "home-outline"
                      : route.name === "two"
                      ? "bag-outline"
                      : route.name === "search"
                      ? "search-outline"
                      : route.name === "cart"
                      ? "cart-outline"
                      : route.name === "profile/index"
                      ? "person-outline"
                      : "bag-outline"
                  }
                  size={24}
                  color={isFocused ? "#FC9AC4" : "#999"}
                />
              )}
            </TouchableOpacity>
          );
        })}
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Kalopsia",
          headerTitleAlign: "left",
          headerStyle: {
            borderWidth: 0,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: "SpaceMono",
            fontSize: 32,
            fontWeight: "bold",
          },

          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <Link href="/(tabs)/cart" asChild>
                <Pressable>
                  <Ionicons
                    name="cart-outline"
                    size={24}
                    color="black"
                    style={{ marginRight: 10 }}
                  />
                </Pressable>
              </Link>
              <Link href="/modal" asChild>
                <Pressable>
                  <Ionicons
                    name="heart-outline"
                    size={24}
                    color="black"
                    style={{ marginRight: 10 }}
                  />
                </Pressable>
              </Link>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Tab Three",
          headerTitleAlign: "left",
          headerStyle: {
            borderBottomWidth: 0,
          },
          headerShown: false,
          headerTitleStyle: {
            fontFamily: "YourCustomFont",
            fontSize: 20,
            fontWeight: "bold",
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />

      <Tabs.Screen
        name="two"
        options={{
          title: "Kalopsia",
          headerTitleAlign: "left",
          headerStyle: {
            borderWidth: 0,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: "SpaceMono",
            fontSize: 32,
            fontWeight: "bold",
          },

          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <Link href="/(tabs)/cart" asChild>
                <Pressable>
                  <Ionicons
                    name="cart-outline"
                    size={24}
                    color="black"
                    style={{ marginRight: 10 }}
                  />
                </Pressable>
              </Link>
              <Link href="/modal" asChild>
                <Pressable>
                  <Ionicons
                    name="heart-outline"
                    size={24}
                    color="black"
                    style={{ marginRight: 10 }}
                  />
                </Pressable>
              </Link>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Tab Three",
          headerTitleAlign: "left",
          headerStyle: {
            borderBottomWidth: 0,
          },
          headerShown: false,
          headerTitleStyle: {
            fontFamily: "YourCustomFont",
            fontSize: 20,
            fontWeight: "bold",
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Tab Three",
          headerTitleAlign: "left",
          headerStyle: {
            borderBottomWidth: 0,
          },
          headerShown: false,
          headerTitleStyle: {
            fontFamily: "YourCustomFont",
            fontSize: 20,
            fontWeight: "bold",
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile/order/index"
        options={{
          href: null,
          headerShown: false,
        }}
      />

<Tabs.Screen
        name="profile/myProfile/index"
        options={{
          href: null,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="profile/order/[id]"
        options={{
          href: null,
          headerShown: false,
        }}
      />

    </Tabs>


  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    backgroundColor: "#FFFDF2",
    borderTopWidth: 0.3,
    borderColor: "#ccc",
    elevation: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
  },
  middleTab: {
    position: "relative",
    top: -20,
  },
  middleButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FC9AC4",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
});
