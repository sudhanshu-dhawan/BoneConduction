  import React, { useState, useEffect } from "react";
  import { 
    View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, 
    TouchableOpacity 
  } from "react-native";
  import { GoogleGenerativeAI } from "@google/generative-ai";
  import { getAuth } from "firebase/auth";
  import { getDatabase, ref, get } from "firebase/database";

  // Firebase Setup
  const auth = getAuth();
  const db = getDatabase();

  const GeminiChat = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState("User");

    const API_KEY = "AIzaSyA7a2CHXruLa4_uMnyBG3V8TsPw1SSGO20"; // Secure this key

    useEffect(() => {
      setMessages([{ text: "Welcome to BoneTune!", user: false }]);
      
      // Fetch the user’s name from Firebase Realtime Database
      const fetchUserName = async () => {
        const user = auth.currentUser;
        if (user) {
          const userRef = ref(db, `users/${auth.currentUser.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserName(snapshot.val().name || "User"); // Set username
          } else {
            console.error("No user data found.");
          }
        }
      };

      fetchUserName();
    }, []);

    const SendMessage = async () => {
      if (!userInput.trim()) return;
    
      setLoading(true);
      const userMessage = { text: userInput, user: true };
    
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setUserInput("");
    
      try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro-002" });

        const context = `
          BoneTune is a bone conduction health monitoring headphone that tracks health parameters 
          such as heart rate, oxygen saturation, and temperature. It provides real-time insights 
          to users about their well-being. The chatbot should assist users in understanding their 
          health stats and how to interpret them.
          For customer support, go to Profile > Support.
        `;

        const prompt = `${context}\nUser: ${userInput}\nAssistant:`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const botMessage = { text: response.text(), user: false };

        setMessages(prevMessages => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error generating response:", error);
      }
    
      setLoading(false);
    };

    const renderMessage = ({ item }) => (
      <View style={[styles.messageContainer, item.user ? styles.userMessage : styles.botMessage]}>
        <Text style={[styles.messageText, item.user ? styles.userText : styles.botText]}>
          {item.text}
        </Text>
      </View>
    );

    return (
      <View style={styles.container}>
        {/* Header with User Name */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>WELCOME {userName.toUpperCase()}</Text>
        </View>

        {/* Chat List */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
          style={styles.chatList}
        />

        {/* Input Field */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Type a message..."
            onChangeText={setUserInput}
            value={userInput}
            style={styles.input}
            onSubmitEditing={SendMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={SendMessage} disabled={loading}>
            <Text style={styles.sendButtonText}>{loading ? "..." : "➤"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
      paddingTop: 50,
    },
    headerContainer: {
      alignItems: "center",
      marginBottom: 10,
    },
    headerText: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#023a75",
    },
    chatList: {
      flex: 1,
      paddingHorizontal: 10,
    },
    messageContainer: {
      maxWidth: "80%",
      padding: 12,
      marginVertical: 5,
      borderRadius: 10,
    },
    userMessage: {
      alignSelf: "flex-end",
      backgroundColor: "#007AFF",
    },
    botMessage: {
      alignSelf: "flex-start",
      backgroundColor: "#023a75",
    },
    messageText: {
      fontSize: 16,
    },
    userText: {
      color: "#fff",
    },
    botText: {
      color: "#fff",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      backgroundColor: "#ffffff",
      borderTopWidth: 1,
      borderColor: "#ddd",
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 20,
      paddingHorizontal: 15,
      height: 40,
      backgroundColor: "#fff",
    },
    addButton: {
      backgroundColor: "#f5f5f5",
      borderRadius: 50,
      width: 35,
      height: 35,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    },
    addButtonText: {
      fontSize: 20,
      color: "#000",
    },
    sendButton: {
      marginLeft: 10,
      backgroundColor: "#007AFF",
      borderRadius: 20,
      paddingHorizontal: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    sendButtonText: {
      color: "#fff",
      fontSize: 18,
    },
  });

  export default GeminiChat;