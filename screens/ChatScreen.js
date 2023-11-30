import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import UserChat from "../components/UserChat";

const ChatScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchAcceptedFriends = async () => {
      try {
        const res = await fetch(
          `http://192.168.176.79:3000/api/v1/friend/accepted-friends/${userId}`
        );
        // console.log(res.data);
        const data = await res.json();
        if (res?.status === 200) {
          setAcceptedFriends(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAcceptedFriends();
  }, []);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Pressable>
        {acceptedFriends.map((item, index) => (
          <UserChat key={index} item={item} />
        ))}
      </Pressable>
    </ScrollView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
