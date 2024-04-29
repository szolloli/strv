import { isLoading, useFonts } from "expo-font";
import { Stack, usePathname, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import Text from "@/components/Text";
import { Pressable, SafeAreaView, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session, SessionProvider, useSession } from "@/context/AuthContext";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Inter_700Bold,
  Inter_400Regular,
  Inter_500Medium,
} from "@expo-google-fonts/inter";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load custom fonts
  const [loaded, error] = useFonts({
    Inter_700Bold,
    Inter_400Regular,
    Inter_500Medium,
  });

  const queryClient = new QueryClient();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <RootNavigator />
      </SessionProvider>
    </QueryClientProvider>
  );
}

function RootNavigator() {
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) SplashScreen.hideAsync();
  }, [isLoading]);

  if (isLoading) return null;

  return <RootNavigatorInner session={session} />;
}

function RootNavigatorInner({ session }: { session: Session | null }) {
  const segments = useSegments();

  // Navigate to events if user is signed in
  useEffect(() => {
    if (session) {
      // Don't navigate to events if user is already in tab navigator
      if (segments[0] == "(tabs)") return;
      router.navigate("/(tabs)/events");
    } else {
      router.replace("/(signin)/signin");
    }
  }, [session, isLoading]);

  return (
    <>
      <SafeAreaView style={styles.topSafeAreaView} />
      <SafeAreaView
        style={[
          styles.container,
          segments[0] == "(signin)"
            ? styles.darkBackground
            : styles.lightBackground,
        ]}
      >
        <Stack>
          <Stack.Screen name="(signin)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="createEvent"
            options={{
              headerRight: () => (
                <Pressable
                  onPress={() => {
                    router.back();
                  }}
                >
                  <Ionicons
                    color={Colors.text.darkGray}
                    size={24}
                    name="close-sharp"
                  />
                </Pressable>
              ),
              headerStyle: styles.lightBackground,
              headerShadowVisible: false,
              headerTitle: ({ children }) => <Text>{children}</Text>,
              title: "Create new event",
              presentation: "modal",
            }}
          />
        </Stack>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  topSafeAreaView: {
    flex: 0,
    backgroundColor: Colors.background.primary,
  },
  container: {
    flex: 1,
  },
  lightBackground: {
    backgroundColor: Colors.background.secondary,
  },
  darkBackground: {
    backgroundColor: Colors.background.primary,
  },
});
