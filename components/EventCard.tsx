import { View, StyleSheet } from "react-native";
import React from "react";
import Text from "./Text";
import Button from "./Button";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import {
  EventioEventsGetAll200ItemAttendeesItem,
  EventioEventsGetById200Owner,
  useEventioEventsAttend,
  useEventioEventsUnattend,
} from "@/api/eventio";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/context/AuthContext";
import { formatDate } from "@/utils/formatters";
import { router, useSegments } from "expo-router";

function CapacityIndicator({
  attending,
  maxCapacity,
}: {
  attending: number;
  maxCapacity: number;
}) {
  return (
    <View style={styles.capacityIndicator}>
      <Ionicons
        size={20}
        color={Colors.text.darkGray}
        name={"person"}
      ></Ionicons>
      <Text variant="bodySmall" style={styles.capacityIndicatorText}>
        {attending} of {maxCapacity}
      </Text>
    </View>
  );
}

export default function EventCard({
  hideButton = false,
  short = false,
  id,
  date,
  title,
  owner,
  description,
  attendees,

  capacity,
}: {
  hideButton?: boolean;
  short?: boolean;
  id: string;
  date: string;
  title: string;
  owner: EventioEventsGetById200Owner;
  description: string;
  attendees: EventioEventsGetAll200ItemAttendeesItem[];
  capacity: number;
}) {
  const queryClient = useQueryClient();
  const mutationOptions = {
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["/events"],
        });
      },
    },
  };

  const { mutate: join, isPending: isJoinPending } =
    useEventioEventsAttend(mutationOptions);
  const { mutate: leave, isPending: isLeavePending } =
    useEventioEventsUnattend(mutationOptions);
  const { session } = useSession();
  const segments = useSegments();

  const CustomButton = (
    <Button
      theme={
        owner.id == session?.id
          ? "disabled"
          : attendees.map((item) => item.id).includes(session?.id)
          ? "danger"
          : "success"
      }
      onPress={() => {
        if (owner.id == session?.id) {
          router.push({
            pathname: `${segments[1]}/editEvent`,
            params: {
              id,
            },
          });
        } else if (attendees.map((item) => item.id).includes(session?.id))
          leave({
            id,
          });
        else
          join({
            id,
          });
      }}
      loading={isJoinPending || isLeavePending}
      title={
        owner.id == session?.id
          ? "EDIT"
          : attendees.some((attendee) => attendee.id == session?.id)
          ? "LEAVE"
          : "JOIN"
      }
    />
  );

  return (
    <View style={[styles.container, short && styles.row]}>
      <View style={short && styles.flex}>
        <Text variant="bodyXSmall" style={{ color: Colors.text.lightGray }}>
          {formatDate(date)}
        </Text>
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
        <Text variant="bodySmall" style={styles.name}>
          {`${owner.firstName} ${owner.lastName}`}
        </Text>
      </View>

      <>
        {!short && <Text style={styles.description}>{description}</Text>}
        <View style={styles.buttonFooter}>
          {!short && (
            <CapacityIndicator
              attending={attendees.length}
              maxCapacity={capacity}
            />
          )}
          {!hideButton && CustomButton}
        </View>
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: Colors.text.black,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    borderRadius: 8,
    padding: 20,
    backgroundColor: Colors.background.secondary,
  },
  capacityIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  capacityIndicatorText: {
    color: Colors.text.darkGray,
    marginLeft: 8,
  },
  flex: {
    flex: 1,
  },
  title: {
    marginTop: 4,
    flexWrap: "wrap",
  },
  name: {
    color: Colors.text.darkGray,
    marginTop: 4,
  },
  description: {
    marginTop: 24,
  },
  buttonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
});
