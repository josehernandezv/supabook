import { Alert, StyleSheet, Text, View } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { fetchMessages, Message, Messages } from "../lib/api";
import { RootStackScreenProps } from "../types";
import { useUserInfo } from "../lib/userContext";
import { supabase } from "../lib/supabase";

export default function ChatScreen({ route }: RootStackScreenProps<"Chat">) {
  const { contactId } = route.params;
  const [messages, setMessages] = useState<Messages>([]);
  const { profile: user } = useUserInfo();

  useEffect(() => {
    if (!user) return;
    fetchMessages(user.id, contactId).then(setMessages);

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${contactId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.receiver_id === user.id) {
            setMessages((prevMessages) => [newMessage, ...prevMessages]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, contactId]);

  const onSend = useCallback(async (messages = []) => {
    const [message] = messages;
    const { text } = message;

    const { error, data } = await supabase
      .from("messages")
      .insert({
        sender_id: user?.id || "",
        receiver_id: contactId,
        content: text,
      })
      .select("*");
    if (error) {
      Alert.alert("Server Error", error.message);
    } else {
      setMessages((prevMessages) => [data[0], ...prevMessages]);
    }
  }, []);

  return (
    <GiftedChat
      messages={messages.map((message) => ({
        _id: message.id,
        text: message.content,
        createdAt: new Date(message.created_at),
        user: { _id: message.sender_id },
      }))}
      onSend={(messages: any) => onSend(messages)}
      user={{
        _id: user?.id || "",
      }}
    />
  );
}
const styles = StyleSheet.create({});
