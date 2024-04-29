export function combineDateAndTime(date: Date, time: Date) {
  return new Date(
    `${date.toISOString().split("T")[0]}T${time.toISOString().split("T")[1]}`,
  );
}
