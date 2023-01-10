import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import ContactItem from "../components/ContactItem";
import { Contact, Contacts, fetchContacts } from "../lib/api";
import { useUserInfo } from "../lib/userContext";
import { RootTabScreenProps } from "../types";

export default function ContactsScreen({
  navigation,
}: RootTabScreenProps<"Contacts">) {
  const [contacts, setContacts] = useState<Contacts>([]);
  const { profile } = useUserInfo();

  useEffect(() => {
    if (profile) fetchContacts(profile.id).then(setContacts);
  }, [profile]);

  const handleContactPress = (contact: Contact) => {
    navigation.navigate("Chat", {
      contactId: contact.id,
      username: contact.username || "",
    });
  };

  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ContactItem
          contact={item}
          onPressItem={() => handleContactPress(item)}
        />
      )}
    />
  );
}
const styles = StyleSheet.create({});
