import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Contact, downloadAvatar } from "../lib/api";
import Avatar from "./Avatar";
import { Text, View } from "./Themed";

interface Props {
  contact: Contact;
  onPressItem: () => void;
}

export default function ContactItem({ contact, onPressItem }: Props) {
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (contact.avatar_url)
      downloadAvatar(contact.avatar_url).then(setAvatarUrl);
  }, [contact]);
  return (
    <TouchableOpacity style={styles.container} onPress={onPressItem}>
      <Avatar uri={avatarUrl} size={40} />
      <Text style={styles.title}>{contact.username}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});
