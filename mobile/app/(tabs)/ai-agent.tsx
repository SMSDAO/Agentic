import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAgentScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'assistant', content: 'Hello! I\'m your Solana AI agent. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length, role: 'user', content: text },
      { id: prev.length + 1, role: 'assistant', content: 'Processing your request...' },
    ]);
    setInput('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.messages} contentContainerStyle={{ padding: 16 }}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.bubble,
              msg.role === 'user' ? styles.userBubble : styles.assistantBubble,
            ]}
          >
            <Text style={msg.role === 'user' ? styles.userText : styles.assistantText}>
              {msg.content}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask your AI agent..."
          placeholderTextColor="#6b7280"
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={send}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  messages: { flex: 1 },
  bubble: {
    maxWidth: '80%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(176, 38, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(176, 38, 255, 0.3)',
  },
  userText: { color: '#00d4ff' },
  assistantText: { color: '#e5e7eb' },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 212, 255, 0.2)',
    backgroundColor: '#0a0a0f',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#141420',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sendButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  sendText: { color: '#000', fontWeight: '700' },
});
