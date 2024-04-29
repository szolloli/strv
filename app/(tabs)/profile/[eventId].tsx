import { useEventioEventsDelete, useEventioEventsGetById } from "@/api/eventio";
import { useSession } from "@/context/AuthContext";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import Text from "@/components/Text";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Pressable,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import EventCard from "@/components/EventCard";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import AttendeeLabel from "@/components/AttendeeLabel";

export default function EventDetailScreen() {
  const { eventId } = useLocalSearchParams<{
    eventId: string;
  }>();
  const { session } = useSession();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    isError,
  } = useEventioEventsGetById(eventId);
  const { mutate: deleteEvent } = useEventioEventsDelete({
    mutation: {
      onSuccess: () => {
        // Refetch events and navigate back after deleting
        queryClient.invalidateQueries({
          queryKey: ["/events"],
        });
        router.back();
      },
      onError: () => {
        Alert.alert("Something went wrong. Please try again later.");
      },
    },
  });

  useEffect(() => {
    if (response?.data.ownerId != session?.id) return;
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={openEventActionSheet}>
          <FontAwesome name="gear" size={24} />
        </Pressable>
      ),
    });
  }, [navigation, response]);

  // Edit action sheet
  const openEventActionSheet = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Edit Event", "Delete"],
        title: "Event Settings",
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: "dark",
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          router.push({
            pathname: "/(tabs)/profile/editEvent",
            params: {
              id: eventId,
            },
          });
        } else if (buttonIndex === 2) {
          openDeleteActionSheet();
        }
      },
    );

  // Delete action sheet
  const openDeleteActionSheet = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Delete"],
        title: "Delete Event",
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        userInterfaceStyle: "dark",
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          deleteEvent({
            id: eventId,
          });
        }
      },
    );

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
      <EventCard
        hideButton={session?.id == data.ownerId}
        id={eventId}
        date={data.startsAt}
        title={data.title}
        owner={data.owner}
        description={data.description}
        attendees={data.attendees}
        capacity={data.capacity}
      />
      <View style={styles.attendeesContainer}>
        <Text variant="titleMedium">Attendees</Text>
        <View style={styles.attendeesLabelContainer}>
          {!data.attendees.length && <Text>No attendees</Text>}

          {/* Display "YOU" if user is attendee */}
          {data.attendees.some((attendee) => attendee.id == session?.id) && (
            <AttendeeLabel key={session?.id} self={true} name="You" />
          )}

          {/* Display name of everyone except for user */}
          {data.attendees
            .filter((attendee) => attendee.id != session?.id)
            .map((attendee) => {
              return (
                <AttendeeLabel
                  key={attendee.id}
                  name={`${attendee.firstName} ${attendee.lastName}`}
                />
              );
            })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background.primary,
    paddingHorizontal: 16,
  },
  attendeesContainer: {
    marginTop: 16,
    padding: 20,
    backgroundColor: Colors.text.white,
    borderRadius: 8,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
  },
  attendeesLabelContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 24,
  },
});
