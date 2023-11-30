import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import User from "../components/User";

const jwt_decode = require("jwt-decode");

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          HELLO APP
        </Text>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Ionicons
            onPress={() => navigation.navigate("Chats")}
            name="chatbubble-ellipses-outline"
            size={24}
            color="black"
          />
          <Ionicons
            onPress={() => navigation.navigate("Friends")}
            name="people-outline"
            size={24}
            color="black"
          />
        </View>
      ),
    });
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const decodeToken = await jwt_decode(token);
        const currUserId = await decodeToken._id;
        await setUserId(currUserId);
        const res = await axios.get(
          `http://192.168.176.79:3000/api/v1/auth/users/${currUserId}`
        );

        if (res?.data.success) {
          setUsers(res?.data.users);
        } else {
          console.log(res?.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);
  console.log("users", users);
  return (
    <ScrollView>
      <View>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
