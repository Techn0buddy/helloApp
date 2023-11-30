import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();

  const acceptRequest = async (friendRequestId) => {
    try {
      const data = {
        senderId: friendRequestId,
        recepientId: userId,
      };
      const res = await axios.post(
        "http://192.168.176.79:3000/api/v1/friend/friend-request/accept",
        data
      );
      if (res.data.success) {
        setFriendRequests(
          friendRequests.filter((request) => request._id !== friendRequestId)
        );
        navigation.navigate("Chats");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25 }}
        source={{ uri: item.image }}
      />
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          flex: 1,
          alignItems: "center",
          marginLeft: 3,
        }}
      >
        {item?.name} sent you a friend request
      </Text>
      <Pressable
        onPress={() => acceptRequest(item._id)}
        style={{ backgroundColor: "#0066B2", padding: 10, borderRadius: 6 }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>Accept</Text>
      </Pressable>
    </Pressable>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({});
