import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import uuid from 'react-native-uuid';
import { getAIResponse } from '../services/chat';
import { useChatSessions, Message } from '../context/ChatSessionContext';

const ChatScreen: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const {
    currentSessionId,
    addSession,
    addMessage,
    getMessages,
  } = useChatSessions();

  // Load session messages or initialize new session with welcome
  useEffect(() => {
    if (!currentSessionId) return;

    addSession(currentSessionId);
    const sessionMessages = getMessages(currentSessionId);

    if (sessionMessages.length === 0) {
      const welcomeMessage: Message = {
        id: uuid.v4().toString(),
        text: '👋 Hello! I\'m your Travel assistant. Ask me anything!',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      addMessage(currentSessionId, welcomeMessage);
      setMessages([welcomeMessage]);
    } else {
      setMessages(sessionMessages);
    }
  }, [currentSessionId]);

  const sendMessage = async () => {
    if (!inputText.trim() || !currentSessionId) return;

    const userMessage: Message = {
      id: uuid.v4().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    addMessage(currentSessionId, userMessage);
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      const fullContext = [...messages, userMessage];
      const aiText = await getAIResponse(fullContext);

      const aiMessage: Message = {
        id: uuid.v4().toString(),
        text: aiText,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      addMessage(currentSessionId, aiMessage);
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI error:', error);
      const errorMessage: Message = {
        id: uuid.v4().toString(),
        text: '⚠️ Failed to get response from AI.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      addMessage(currentSessionId, errorMessage);
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === 'user' ? styles.userMessage : styles.aiMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender === 'user' && { color: '#000000' },
                  item.sender === 'ai' && { color: '#FFFFFF' },
                ]}
              >
                {item.text}
              </Text>
            </View>
          )}
          style={styles.messageList}
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        <View style={styles.inputWrapper}>
          <View style={styles.chatBar}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor="#999"
              multiline
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendIcon}>
              <Text style={styles.sendIconText}>↑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F1' },
  messageList: { flex: 1, padding: 16 },
  messageBubble: {
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#EDD9B3',
    borderTopRightRadius: 16,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#000',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  messageText: {
    fontSize: 15,
    fontFamily: Platform.select({ ios: 'Courier New', android: 'monospace' }),
  },
  inputWrapper: {
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: '#FAF7F1',
  },
  chatBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: Platform.select({ ios: 'Courier New', android: 'monospace' }),
    color: '#000',
    paddingVertical: 6,
  },
  sendIcon: {
    marginLeft: 12,
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIconText: {
    color: '#000',
    fontSize: 16,
  },
});

export default ChatScreen;
