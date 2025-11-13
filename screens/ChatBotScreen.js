// ChatBotScreen.js
import React, { useState, useEffect, useRef } from "react";
import { 
  View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator,
  TouchableOpacity, KeyboardAvoidingView, Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { GoogleGenAI } from "@google/genai";

const ChatBotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userData, setUserData] = useState(null);
  const flatListRef = useRef(null);

  // Initialize Google AI with your API key
  const ai = new GoogleGenAI({ 
    apiKey: "AIzaSyBA2ou4gaLSZ_9svh-NX1HHHuMmabdEPbE" 
  });

  const quickQuestions = [
    "What is normal heart rate?",
    "How does bone conduction work?",
    "What are healthy SpO2 levels?",
    "Benefits of daily walking?",
    "Importance of hydration?",
    "How to use BoneTune device?"
  ];

  useEffect(() => {
    setMessages([{
      text: "Hello! I'm your BoneTune AI health assistant. I can help you understand health metrics, device usage, and provide personalized wellness advice. What would you like to know?",
      user: false,
      isWelcome: true
    }]);
    
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = getAuth().currentUser;
      if (user) {
        const userRef = ref(getDatabase(), `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserName(data.name || "User");
          setUserData(data);
        }
      }
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };

  // 🧠 AI RESPONSE FUNCTION USING @google/genai
  const getAIResponse = async (userMessage) => {
    try {
      console.log("🔄 Calling Gemini 2.5 Flash...");

      // Create user context for personalized responses
      const userContext = userData ? `
User Profile:
- Name: ${userData.name || 'User'}
- Age: ${userData.age || 'Not specified'}
- Gender: ${userData.gender || 'Not specified'} 
- Weight: ${userData.weight || 'Not specified'} kg
- Height: ${userData.height || 'Not specified'} cm
- Health Condition: ${userData.disease || 'None reported'}
      ` : "User profile information not available.";

      const systemPrompt = `You are BoneTune AI, a specialized health assistant for bone conduction health monitoring headphones.

CONTEXT:
BoneTune is a wearable device that tracks:
- Heart rate in real-time
- Blood oxygen saturation (SpO2) 
- Body temperature
- Daily steps and activity
- Hydration levels

USER PROFILE:
${userContext}

INSTRUCTIONS:
1. Provide accurate, evidence-based health information
2. Keep responses concise (2-3 sentences maximum)
3. Be empathetic and professional
4. Focus on health monitoring and device usage
5. For emergencies, advise consulting healthcare providers
6. Use simple, clear language

USER QUESTION: "${userMessage}"

Please provide a helpful response:`;

      // Use the new @google/genai package
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash", // Using gemini-2.0-flash which is available
        contents: systemPrompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 300,
        }
      });

      console.log("✅ AI Response received");

      if (response.text) {
        return response.text;
      } else {
        throw new Error("No response text from AI");
      }

    } catch (error) {
      console.log("❌ AI Error:", error.message);
      
      // If gemini-2.0-flash fails, try gemini-1.5-flash
      if (error.message.includes('model') || error.message.includes('not found')) {
        console.log("🔄 Trying gemini-1.5-flash...");
        try {
          const fallbackResponse = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: `As a BoneTune health assistant, answer this question about health monitoring: "${userMessage}" in 2-3 sentences.`,
          });
          
          if (fallbackResponse.text) {
            return fallbackResponse.text;
          }
        } catch (fallbackError) {
          console.log("❌ Fallback also failed:", fallbackError.message);
        }
      }
      
      throw error;
    }
  };

  // 🎯 RULE-BASED FALLBACK RESPONSES
  const getRuleBasedResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('heart') || message.includes('pulse') || message.includes('bpm')) {
      return "A normal resting heart rate for adults is 60-100 beats per minute (BPM). Your BoneTune device monitors heart rate in real-time. Regular exercise can help maintain a healthy heart rate.";
    }
    
    if (message.includes('oxygen') || message.includes('spo2') || message.includes('blood oxygen')) {
      return "Normal blood oxygen saturation (SpO2) levels are 95-100%. Levels below 90% may indicate hypoxemia and require medical attention. BoneTune tracks your SpO2 levels continuously.";
    }
    
    if (message.includes('temperature') || message.includes('temp') || message.includes('fever')) {
      return "Normal body temperature is around 37°C (98.6°F). A fever is typically considered 38°C (100.4°F) or higher. BoneTune monitors temperature changes throughout the day.";
    }
    
    if (message.includes('step') || message.includes('walk') || message.includes('exercise')) {
      return "Aiming for 7,000-10,000 steps daily is beneficial for cardiovascular health. Walking helps maintain healthy weight, improves mood, and boosts energy levels. BoneTune tracks your daily step count automatically.";
    }
    
    if (message.includes('water') || message.includes('hydrat') || message.includes('drink')) {
      return "Adults should drink 2-3 liters of water daily. Proper hydration improves cognitive function, energy levels, and overall health. You can set water reminders in the BoneTune app.";
    }
    
    if (message.includes('bone conduction') || message.includes('how work') || message.includes('technology')) {
      return "Bone conduction technology sends sound vibrations through your cheekbones directly to the inner ear, bypassing the eardrum. This allows you to hear ambient sounds while using the device, making it safer for outdoor activities.";
    }
    
    if (message.includes('battery') || message.includes('charge') || message.includes('power')) {
      return "BoneTune typically provides 8-10 hours of continuous use. Charging takes about 2 hours using the magnetic charging cable. Battery status is displayed in the app.";
    }
    
    if (message.includes('support') || message.includes('help') || message.includes('problem')) {
      return "For technical support, please go to the Support section in your profile, email support@bonetune.com, or call our helpline. We're here to help you!";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return `Hello ${userName}! I'm your BoneTune health assistant. How can I help you today?`;
    }
    
    return "I understand you're interested in health and wellness. BoneTune helps monitor heart rate, blood oxygen, temperature, steps, and hydration. Could you tell me more about what you'd like to know?";
  };

  // 💬 MAIN MESSAGE HANDLER
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newUserMessage = { text: userInput, user: true };
    setMessages(prev => [...prev, newUserMessage]);
    const currentInput = userInput;
    setUserInput("");
    setLoading(true);

    try {
      const aiResponse = await getAIResponse(currentInput);
      
      const newBotMessage = { 
        text: aiResponse, 
        user: false,
        isAI: true
      };
      setMessages(prev => [...prev, newBotMessage]);
      
    } catch (aiError) {
      console.log("Using rule-based fallback");
      const fallbackResponse = getRuleBasedResponse(currentInput);
      const newBotMessage = { 
        text: fallbackResponse, 
        user: false,
        isFallback: true
      };
      setMessages(prev => [...prev, newBotMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setUserInput(question);
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.user ? styles.userMessage : styles.botMessage,
      item.isWelcome && styles.welcomeMessage,
      item.isAI && styles.aiMessage,
      item.isFallback && styles.fallbackMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.user ? styles.userText : styles.botText,
        item.isWelcome && styles.welcomeText,
        item.isAI && styles.aiText,
        item.isFallback && styles.fallbackText
      ]}>
        {item.text}
      </Text>
    </View>
  );

  const renderQuickQuestions = () => (
    <View style={styles.quickQuestionsContainer}>
      <Text style={styles.quickQuestionsTitle}>Quick Questions:</Text>
      <View style={styles.questionsGrid}>
        {quickQuestions.map((question, index) => (
          <TouchableOpacity
            key={index}
            style={styles.questionChip}
            onPress={() => handleQuickQuestion(question)}
            disabled={loading}
          >
            <Text style={styles.questionChipText}>{question}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BoneTune Assistant</Text>
        <Text style={styles.headerSubtitle}>Hello, {userName}</Text>
        <Text style={styles.headerStatus}>
          {loading ? "thinking..." : "Online"}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        style={styles.chatList}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {messages.length <= 2 && !loading && renderQuickQuestions()}

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Ask me anything about health or BoneTune..."
            multiline
            onSubmitEditing={handleSendMessage}
            editable={!loading}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              (!userInput.trim() || loading) && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!userInput.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.inputHint}>
          {loading ? "Gemini is generating response..." : "Press enter or tap send"}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

// Styles (same as before)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: { 
    backgroundColor: "#023a75", 
    paddingVertical: 20, 
    paddingHorizontal: 16, 
    paddingTop: 50 
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#fff", 
    textAlign: "center" 
  },
  headerSubtitle: {
    fontSize: 14, 
    color: "#a0c8ff", 
    textAlign: "center", 
    marginTop: 4 
  },
  headerStatus: {
    fontSize: 12, 
    color: "#66bb6a", 
    textAlign: "center", 
    marginTop: 2, 
    fontWeight: "500" 
  },
  chatList: { flex: 1 },
  chatContent: { padding: 16 },
  messageContainer: {
    maxWidth: "85%", 
    padding: 12, 
    marginVertical: 6, 
    borderRadius: 16, 
    position: "relative" 
  },
  userMessage: {
    alignSelf: "flex-end", 
    backgroundColor: "#007AFF", 
    borderBottomRightRadius: 4 
  },
  botMessage: {
    alignSelf: "flex-start", 
    backgroundColor: "#ffffff", 
    borderBottomLeftRadius: 4, 
    borderWidth: 1, 
    borderColor: "#e0e0e0" 
  },
  welcomeMessage: {
    alignSelf: "center", 
    backgroundColor: "#023a75", 
    maxWidth: "90%" 
  },
  aiMessage: {
    alignSelf: "flex-start", 
    backgroundColor: "#e8f5e8", 
    borderColor: "#4caf50", 
    borderWidth: 1 
  },
  fallbackMessage: {
    alignSelf: "flex-start", 
    backgroundColor: "#fff3cd", 
    borderColor: "#ffc107", 
    borderWidth: 1 
  },
  messageText: { fontSize: 16, lineHeight: 20 },
  userText: { color: "#ffffff" },
  botText: { color: "#333333" },
  welcomeText: { color: "#ffffff", textAlign: "center" },
  aiText: { color: "#1b5e20" },
  fallbackText: { color: "#856404" },
  aiBadge: {
    fontSize: 10, 
    color: "#4caf50", 
    fontWeight: "bold", 
    marginTop: 4, 
    textAlign: "right" 
  },
  fallbackBadge: {
    fontSize: 10, 
    color: "#ff9800", 
    fontWeight: "bold", 
    marginTop: 4, 
    textAlign: "right" 
  },
  quickQuestionsContainer: {
    padding: 16, 
    backgroundColor: "#ffffff", 
    borderTopWidth: 1, 
    borderColor: "#e0e0e0" 
  },
  quickQuestionsTitle: {
    fontSize: 16, 
    fontWeight: "600", 
    color: "#023a75", 
    marginBottom: 12 
  },
  questionsGrid: {
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 8 
  },
  questionChip: {
    backgroundColor: "#e3f2fd", 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: "#bbdefb" 
  },
  questionChipText: {
    fontSize: 12, 
    color: "#023a75", 
    fontWeight: "500" 
  },
  inputContainer: {
    backgroundColor: "#ffffff", 
    padding: 16, 
    borderTopWidth: 1, 
    borderColor: "#e0e0e0" 
  },
  inputWrapper: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1, 
    borderWidth: 1, 
    borderColor: "#ddd", 
    borderRadius: 20, 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    marginRight: 12, 
    backgroundColor: "#f8f9fa", 
    fontSize: 16, 
    maxHeight: 100 
  },
  sendButton: {
    backgroundColor: "#007AFF", 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  sendButtonDisabled: { backgroundColor: "#ccc" },
  inputHint: {
    fontSize: 12, 
    color: "#666", 
    textAlign: "center", 
    marginTop: 8 
  },
});

export default ChatBotScreen;