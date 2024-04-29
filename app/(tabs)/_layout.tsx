import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, router, Tabs } from "expo-router";
import { Pressable, View, StyleSheet } from "react-native";

import Colors from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSession } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  initialRouteName: "events",
};

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

// BottomTabBarProps can't be imported
function MyTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.createEventButtonContainer}>
        <Pressable
          style={styles.createEventButton}
          onPress={() => {
            router.push("/createEvent");
          }}
        >
          <MaterialIcons name="add" size={24} color={Colors.text.white} />
        </Pressable>
      </View>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ alignItems: "center" }}
          >
            <View style={{ height: 4 }} />
            <Ionicons
              name={label == "Events" ? "calendar" : "person"}
              size={24}
              style={{
                color: isFocused ? Colors.text.black : Colors.text.darkGray,
              }}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const { session, isLoading } = useSession();

  if (!session && !isLoading) {
    return <Redirect href="/signin" />;
  }

  return (
    <>
      {/* <SafeAreaView style={{ flex: 1 }}> */}
      <Tabs
        tabBar={(props) => <MyTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="events"
          options={{
            title: "Events",
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          }}
        />
      </Tabs>
      {/* </SafeAreaView> */}
    </>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    paddingVertical: 24,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Colors.background.secondary,
    shadowColor: Colors.text.black,
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: -2,
    },
  },
  createEventButton: {
    width: 56,
    height: 56,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.black,
  },
  createEventButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
  },
});
