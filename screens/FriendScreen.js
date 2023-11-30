import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";
import axios from "axios";
import FriendRequest from "../components/FriendRequest";

const FriendScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [friendRequests, setFriendRequests] = useState([]);
  console.log(userId);
  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const res = await axios.get(
        `http://192.168.176.79:3000/api/v1/friend/friend-requests/${userId}`
      );
      if (res.data.success) {
        const friendRequestsData = res.data.friendRequests.map(
          (friendRequest) => ({
            _id: friendRequest._id,
            name: friendRequest.name,
            email: friendRequest.email,
            image: friendRequest.image,
          })
        );
        setFriendRequests(friendRequestsData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(friendRequests);
  return (
    <View style={{ padding: 10, marginHorizontal: 12 }}>
      {friendRequests.length > 0 && <Text>Your Friend Requests!</Text>}
      {friendRequests.map((item, index) => (
        <FriendRequest
          key={index}
          item={item}
          friendRequests={friendRequests}
          setFriendRequests={setFriendRequests}
        />
      ))}
      {friendRequests.length === 0 && <Text>FriendScreen</Text>}
    </View>
  );
};

export default FriendScreen;

const styles = StyleSheet.create({});
