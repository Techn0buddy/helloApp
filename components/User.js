import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";
import axios from "axios";

const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const res = await fetch(
          `http://192.168.176.79:3000/api/v1/friend/friend-requests/sent/${userId}`
        );

        const data = await res.json();
        if (res.status === 200) {
          setFriendRequests(data);
        } else {
          console.log("error : ", response.status);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFriendRequests();
  }, []);

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const res = await fetch(
          `http://192.168.176.79:3000/api/v1/friend/friends/${userId}`
        );
        const data = await res.json();
        if (res.status === 200) {
          setUserFriends(data);
        } else {
          console.log("error occured: ", res.status);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserFriends();
  }, []);
  const sendFriendRequest = async (currUserId, selectedUserId) => {
    try {
      const Data = {
        currUserId: currUserId,
        selectedUserId: selectedUserId,
      };
      const res = await axios.post(
        "http://192.168.176.79:3000/api/v1/friend/friend-request",
        Data
      );

      if (res.data.success) {
        console.log("success");
        setRequestSent(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log("friends sent req : ", friendRequests);
  console.log("user's friends : ", userFriends);
  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        padding: 3,
      }}
    >
      <View>
        <Image
          style={{
            width: 60,
            height: 60,
            borderRadius: 100,
            resizeMode: "cover",
          }}
          source={{ uri: item.image }}
        />
      </View>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
        <Text style={{ marginTop: 4, color: "gray" }}>{item?.email}</Text>
      </View>
      {userFriends.includes(item._id) ? (
        <Pressable
          style={{
            backgroundColor: "#82CD47",
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>Friends</Text>
        </Pressable>
      ) : requestSent ||
        friendRequests.some((friend) => {
          friend._id === item._id;
        }) ? (
        <Pressable
          style={{
            backgroundColor: "gray",
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Request Sent
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => sendFriendRequest(userId, item._id)}
          style={{
            backgroundColor: "#567189",
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Add Friend
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({});
