import {
  StyleSheet,
  FlatList,
  Pressable,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import Colors from "@/constants/Colors";
import Text from "@/components/Text";
import { router, useNavigation } from "expo-router";
import EventCard from "@/components/EventCard";
import GridIcon from "@/assets/svg/GridIcon";
import ListIcon from "@/assets/svg/ListIcon";
import { useEventioEventsGetAll } from "@/api/eventio";

export default function EventsScreen() {
  const [selected, setSelected] = useState("ALL");
  const [view, setView] = useState<"grid" | "list">("grid");
  const navigation = useNavigation();
  const { data, refetch, isLoading, isError } = useEventioEventsGetAll();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
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
      ),
    });
  }, [navigation, view]);

  const events = useMemo(() => {
    if (!data) return [];
    switch (selected) {
      case "ALL":
        return data.data;
      case "FUTURE":
        return data.data.filter(
          (event) => new Date(event.startsAt).getTime() >= new Date().getTime(),
        );
      case "PAST":
        return data.data.filter(
          (event) => new Date(event.startsAt).getTime() < new Date().getTime(),
        );
    }
  }, [selected, data]);

  if (isError || (!data && !isLoading))
    return (
      <View style={styles.container}>
        <Text>Somethin went wrong.</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.eventOptionsContainer}>
        {["ALL", "FUTURE", "PAST"].map((item) => {
          return (
            <Pressable
              key={item}
              onPress={() => setSelected(item)}
              style={[styles.option, selected == item && styles.selectedOption]}
            >
              <Text
                style={
                  selected == item
                    ? styles.selectedOptionText
                    : styles.optionText
                }
                variant="overlineSmall"
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {isLoading ? (
        <View style={styles.container}>
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <FlatList
          refreshing={isLoading}
          onRefresh={refetch}
          contentContainerStyle={styles.eventListContainer}
          ListEmptyComponent={() => (
            <View style={styles.container}>
              <Text>No events</Text>
            </View>
          )}
          style={styles.eventList}
          data={events}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                router.push(`/(tabs)/events/${item.id}`);
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: "red",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background.primary,
    paddingTop: 16,
  },
  option: {
    borderRadius: 4,
    padding: 8,
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.background.secondary,
  },
  optionText: {
    color: Colors.text.lightGray,
  },
  selectedOption: {
    backgroundColor: Colors.black,
  },
  selectedOptionText: {
    color: Colors.background.primary,
  },
  eventOptionsContainer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 8,
    marginHorizontal: 16,
  },
  eventListContainer: {
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  eventList: {
    alignSelf: "stretch",
    marginTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
