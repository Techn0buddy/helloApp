import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const ChatMessageScreen = () => {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedmesaages, setSelectedmesaages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [recepeintData, setRecepeintData] = useState();
  const { userId, setUserId } = useContext(UserType);
  const route = useRoute();
  const { recepientId } = route.params;
  const navigation = useNavigation();
  const ScrollViewref = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `http://192.168.176.79:3000/api/v1/chat/messages/${userId}/${recepientId}`
      );
      const data = await res.json();
      if (res.status === 200) {
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

  const scrollToBottom = () => {
    if (ScrollViewref.current) {
      ScrollViewref.current.scrollToEnd({ animated: false });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleContentSizeChange = () => {
    scrollToBottom();
  };
  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };
  useEffect(() => {
    const fetchRecepeintData = async () => {
      try {
        const res = await axios.get(
          `http://192.168.176.79:3000/api/v1/chat/user/${recepientId}`
        );
        const data = await res.data.recepientId;
        if (res.data.success) {
          setRecepeintData(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecepeintData();
  }, []);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("result = ", result.uri);
    if (!result.canceled) {
      console.log(result.assets[0].uri);
      handleSend("image", result.uri);
    }
  };
  const handleSend = async (messageType, imageUri) => {
    try {
      const formData = new FormData();
      formData.append("senderId", userId);
      formData.append("recepientId", recepientId);
      // console.log(message);
      console.log("ImageURL = ", imageUri);
      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("messageText", message);
      }

      console.log(formData);

      // console.log( "Form data = ", formData);
      // const res = await axios.post(
      //   "http://192.168.176.79:3000/api/v1/chat/message",
      //   formData
      // );
      const res = await fetch(
        "http://192.168.176.79:3000/api/v1/chat/message",
        {
          method: "POST",
          body: formData,
        }
      );
      console.log(res);
      if (res.status === 200) {
        console.log("IMAGE");
        setMessage("");
        setSelectedImage("");

        fetchMessages();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <AntDesign
            onPress={() => navigation.goBack()}
            name="back"
            size={24}
            color="black"
          />
          {selectedmesaages.length > 0 ? (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {selectedmesaages.length}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  resizeMode: "cover",
                }}
                source={{ uri: recepeintData?.image }}
              />
              <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                {recepeintData?.name}
              </Text>
            </View>
          )}
        </View>
      ),
      headerRight: () =>
        selectedmesaages.length > 0 ? (
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Ionicons name="md-arrow-redo" size={24} color="black" />
            <Ionicons name="md-arrow-undo" size={24} color="black" />
            <FontAwesome name="star" size={24} color="black" />
            <MaterialIcons
              onPress={() => handleDelete(selectedmesaages)}
              name="delete-outline"
              size={24}
              color="black"
            />
          </View>
        ) : null,
    });
  }, [recepeintData, selectedmesaages]);
  const handleDelete = async (messagesIds) => {
    try {
      const data = {
        messages: messagesIds,
      };
      const res = await axios.post(
        "http://192.168.176.79:3000/api/v1/chat/delete-messages",
        data
      );

      if (res.status === 200) {
        setSelectedmesaages((prevMessages) =>
          prevMessages.filter((id) => !messagesIds.includes(id))
        );
        fetchMessages();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const handleSelectedMessage = (message) => {
    const isSelected = selectedmesaages.includes(message._id);

    if (isSelected) {
      setSelectedmesaages((prevMessages) => {
        prevMessages.filter((id) => id !== message._id);
      });
    } else {
      setSelectedmesaages((prevMessages) => [...prevMessages, message._id]);
    }
  };
  console.log(messages);
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView
        ref={ScrollViewref}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={handleContentSizeChange}
      >
        {messages.map((item, index) => {
          if (item.messageType === "text") {
            const isSelected = selectedmesaages.includes(item._id);
            return (
              <Pressable
                onLongPress={() => handleSelectedMessage(item)}
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },

                  isSelected && { width: "100%", backgroundColor: "#F8FFFF" },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: isSelected ? "right" : "left",
                  }}
                >
                  {item?.messageText}
                </Text>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    color: "gray",
                    marginTop: 5,
                  }}
                >
                  {formatTime(item.timeStamp)}
                </Text>
              </Pressable>
            );
          }
          if (item.messageType === "image") {
            const baseUrl =
              "/Users/chssi/Desktop/sem5 Project/chatApp2.0/helloApp/api/files/";
            const imageUrl = item.imageUrl;
            const filename = imageUrl.split("/").pop();
            const source = { uri: baseUrl + filename };

            return (
              <Pressable
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },
                ]}
              >
                <View>
                  <Image
                    source={source}
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                  />
                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 9,
                      color: "gray",
                      position: "absolute",
                      color: "white",
                      marginTop: 5,
                      bottom: 7,
                      right: 10,
                    }}
                  >
                    {formatTime(item?.timeStamp)}
                  </Text>
                </View>
              </Pressable>
            );
          }
        })}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 25,
        }}
      >
        <Entypo
          onPress={handleEmojiPress}
          style={{ marginRight: 5 }}
          name="emoji-happy"
          size={24}
          color="gray"
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type your message..."
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          <Entypo onPress={pickImage} name="camera" size={24} color="gray" />
          <Feather name="mic" size={24} color="gray" />
        </View>
        <Pressable
          onPress={() => handleSend("text")}
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </Pressable>
      </View>
      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prevMessage) => prevMessage + emoji);
          }}
          style={{ height: 300 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessageScreen;

const styles = StyleSheet.create({});
