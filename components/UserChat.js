import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";

const UserChat = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const [readyForRender, setreadyForRender] = useState(false);
  const fetchMessages = async () => {
    try {
      // console.log("Item id = ", item._id);
      // console.log("USerId = ", userId);
      // console.log("Item id = ", userId);
      const res = await fetch(
        `http://192.168.176.79:3000/api/v1/chat/messages/${userId}/${item._id}`
      );
      console.log(res);
      if (res.status === 200) {
        const data = await res?.json();
        // console.log("My data = ", data);
        // console.log("res ok = ", res.ok);
        // console.log("res status = ", res.status);
        setMessages(data);
      } else {
        console.log("Error occurred while showing messages");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, []);
  const getLastMessage = () => {
    const userMessages = messages.filter(
      (message) => message.messageType === "text"
    );
    const n = userMessages.length;
    return userMessages[n - 1];
  };
  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };
  console.log(messages);
  const lastMessge = getLastMessage();
  console.log(lastMessge);
  return (
    <Pressable
      onPress={() => {
        navigation.navigate("Messages", {
          recepientId: item._id,
        });
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 0,
        borderBottomWidth: 0.7,
        padding: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }}
        source={{ uri: item?.image }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: 500 }}>{item?.name}</Text>
        {lastMessge && (
          <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}>
            {lastMessge?.messageText}
          </Text>
        )}
      </View>

      <View>
        <Text style={{ fontSize: 11, fontWeight: 400, color: "#585858" }}>
          {lastMessge && formatTime(lastMessge?.timeStamp)}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserChat;

const styles = StyleSheet.create({});
