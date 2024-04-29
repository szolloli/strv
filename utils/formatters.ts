export function formatDate(dateString: string) {
  const date = Date.parse(dateString);
  return Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeStyle: "short",
  })
    .format(date)
    .replace("at", "-");
}

export function formatInitials(firstName: string, lastName: string) {
  return firstName[0] + lastName[0];
}
