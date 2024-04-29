import {
  StyleSheet,
  FlatList,
  Pressable,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import Text from "@/components/Text";
import { router } from "expo-router";
import EventCard from "@/components/EventCard";
import GridIcon from "@/assets/svg/GridIcon";
import ListIcon from "@/assets/svg/ListIcon";
import { useEventioEventsGetAll } from "@/api/eventio";
import { useSession } from "@/context/AuthContext";
import { formatInitials } from "@/utils/formatters";

export default function ProfileScreen() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const { session } = useSession();

  const { data: response, isLoading, isError } = useEventioEventsGetAll();

  if (isLoading)
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} />
      </View>
    );

  if (isError || !response)
    return (
      <View style={styles.container}>
        <Text>Somethin went wrong</Text>
      </View>
    );

  const data = response.data;

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profilePicture}>
          <Text>
            {formatInitials(session?.firstName ?? "", session?.lastName ?? "")}
          </Text>
        </View>
        <Text textAling="center" variant="bodyLarge" style={styles.name}>
          {session?.firstName} {session?.lastName}
        </Text>
        <Text textAling="center" style={styles.email}>
          {session?.email}
        </Text>
      </View>
      <View style={styles.myEventsHeader}>
        <Text>My events</Text>
        <View style={styles.row}>
          <Pressable onPress={() => setView("grid")}>
            <GridIcon
              color={view == "grid" ? Colors.text.black : Colors.text.lightGray}
            />
          </Pressable>
          <Pressable onPress={() => setView("list")}>
            <ListIcon
              color={view == "list" ? Colors.text.black : Colors.text.lightGray}
            />
          </Pressable>
        </View>
      </View>
      <FlatList
        contentContainerStyle={styles.eventListContainer}
        ListEmptyComponent={() => <Text>No events</Text>}
        style={styles.eventList}
        data={data.filter((event) => event.ownerId == session?.id) ?? []}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              router.push(`/profile/${item.id}`);
            }}
          >
            <EventCard
              short={view == "list"}
              id={item.id}
              date={item.startsAt}
              title={item.title}
              owner={item.owner}
              description={item.description}
              attendees={item.attendees}
              capacity={item.capacity}
            />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    height: 164,
    alignSelf: "stretch",
    marginHorizontal: 16,
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    marginTop: 80,
    backgroundColor: Colors.text.white,
  },
  myEventsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
    marginTop: 24,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  eventListContainer: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  name: {
    marginTop: 24,
  },
  email: {
    color: Colors.text.lightGray,
  },
  eventList: {
    alignSelf: "stretch",
  },
  row: {
    flexDirection: "row",
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.disabled,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -60,
  },
  container: {
    flex: 1,
    padding: 0,
    alignItems: "center",
    backgroundColor: Colors.background.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
