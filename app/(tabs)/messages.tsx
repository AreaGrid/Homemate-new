import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Send, Phone, Video, MoveVertical as MoreVertical, Shield } from 'lucide-react-native';
import ConversationStarters from '@/components/ConversationStarters';
import { ConversationStarter } from '@/types/matching';

const conversations = [
  {
    id: 1,
    name: 'Emma Rodriguez',
    lastMessage: 'Thanks for the detailed questions! I think we have very similar living preferences.',
    timestamp: '2m ago',
    unread: 2,
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    verified: true,
    compatibility: 92,
  },
  {
    id: 2,
    name: 'Liam Chen',
    lastMessage: 'Would you be interested in scheduling a video call this week?',
    timestamp: '1h ago',
    unread: 0,
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    verified: true,
    compatibility: 88,
  },
  {
    id: 3,
    name: 'Sophia Kim',
    lastMessage: 'The apartment viewing went great! Let me know your thoughts.',
    timestamp: '3h ago',
    unread: 1,
    image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    verified: true,
    compatibility: 85,
  },
  {
    id: 4,
    name: 'Marcus Johnson',
    lastMessage: 'Looking forward to meeting you at the coffee shop tomorrow!',
    timestamp: '1d ago',
    unread: 0,
    image: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    verified: false,
    compatibility: 78,
  },
];

const chatMessages = [
  {
    id: 1,
    text: 'Hi Emma! I saw we matched and I\'m really excited about the possibility of living together. Your profile shows we have a lot in common!',
    sender: 'me',
    timestamp: '10:30 AM',
  },
  {
    id: 2,
    text: 'Hi! Thanks for reaching out. I\'m excited too! I love that you\'re into yoga and cooking - those are two of my favorite ways to unwind after work.',
    sender: 'them',
    timestamp: '10:35 AM',
  },
  {
    id: 3,
    text: 'That\'s perfect! I actually teach yoga classes on weekends as a side thing. And I love experimenting with new recipes. What\'s your work schedule like?',
    sender: 'me',
    timestamp: '10:37 AM',
  },
  {
    id: 4,
    text: 'That sounds amazing! I work pretty standard hours, 9-6 most days, remote on Fridays. I usually get home around 7 PM. I love that you teach yoga - I\'ve been looking for classes in the area!',
    sender: 'them',
    timestamp: '10:42 AM',
  },
  {
    id: 5,
    text: 'Thanks for the detailed questions! I think we have very similar living preferences.',
    sender: 'them',
    timestamp: '2m ago',
  },
];

export default function MessagesScreen() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showStarters, setShowStarters] = useState(true);

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  // Sample conversation starters based on compatibility
  const conversationStarters: ConversationStarter[] = [
    {
      id: '1',
      text: 'I noticed we both value cleanliness - what\'s your favorite way to keep common areas organized?',
      category: 'lifestyle',
      basedOn: ['Cleanliness preferences', 'Shared living values']
    },
    {
      id: '2',
      text: 'We both enjoy cooking! Do you have any go-to recipes you\'d be willing to share?',
      category: 'interests',
      basedOn: ['Cooking interest', 'Shared activities']
    },
    {
      id: '3',
      text: 'I see we have similar schedules - how do you usually handle shared expenses?',
      category: 'practical',
      basedOn: ['Financial habits', 'Practical alignment']
    },
    {
      id: '4',
      text: 'What\'s your ideal balance between socializing and having quiet time at home?',
      category: 'social',
      basedOn: ['Social preferences', 'Living compatibility']
    }
  ];

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      console.log('Sending:', newMessage);
      setNewMessage('');
      setShowStarters(false);
    }
  };

  const handleStarterSelect = (starter: ConversationStarter) => {
    setNewMessage(starter.text);
    setShowStarters(false);
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return '#735510';
    if (score >= 80) return '#debd72';
    return '#c9a55a';
  };

  if (selectedConversation) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedConversation(null)}
            >
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            
            <View style={styles.chatHeaderInfo}>
              <Image
                source={{ uri: selectedConv?.image }}
                style={styles.chatHeaderImage}
              />
              <View style={styles.chatHeaderText}>
                <View style={styles.chatHeaderName}>
                  <Text style={styles.chatHeaderNameText}>{selectedConv?.name}</Text>
                  {selectedConv?.verified && (
                    <Shield size={16} color="#A3B18A" style={{ marginLeft: 4 }} />
                  )}
                </View>
                <Text style={styles.chatHeaderStatus}>
                  {selectedConv?.compatibility}% compatible
                </Text>
              </View>
            </View>
            
            <View style={styles.chatHeaderActions}>
              <TouchableOpacity style={styles.chatHeaderAction}>
                <Phone size={20} color="#735510" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatHeaderAction}>
                <Video size={20} color="#735510" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatHeaderAction}>
                <MoreVertical size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages */}
          <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
            {/* Conversation Starters */}
            {showStarters && chatMessages.length <= 2 && (
              <ConversationStarters
                starters={conversationStarters}
                onSelect={handleStarterSelect}
              />
            )}
            
            {chatMessages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.sender === 'me' ? styles.myMessage : styles.theirMessage,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    message.sender === 'me' ? styles.myMessageBubble : styles.theirMessageBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.sender === 'me' ? styles.myMessageText : styles.theirMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
                <Text style={styles.messageTime}>{message.timestamp}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Message Input */}
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, newMessage.trim() ? styles.sendButtonActive : null]}
              onPress={sendMessage}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.headerSubtitle}>
          <Text style={styles.subtitle}>
            {conversations.filter(c => c.unread > 0).length} unread conversations
          </Text>
        </View>
      </View>

      <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
        {conversations.map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            style={styles.conversationItem}
            onPress={() => setSelectedConversation(conversation.id)}
          >
            <View style={styles.conversationImageContainer}>
              <Image
                source={{ uri: conversation.image }}
                style={styles.conversationImage}
              />
              {conversation.verified && (
                <View style={styles.verificationBadge}>
                  <Shield size={12} color="#FFFFFF" />
                </View>
              )}
              <View
                style={[
                  styles.compatibilityDot,
                  { backgroundColor: getCompatibilityColor(conversation.compatibility) },
                ]}
              />
            </View>

            <View style={styles.conversationContent}>
              <View style={styles.conversationHeader}>
                <Text style={styles.conversationName}>{conversation.name}</Text>
                <Text style={styles.conversationTime}>{conversation.timestamp}</Text>
              </View>
              
              <View style={styles.conversationFooter}>
                <Text 
                  style={[
                    styles.conversationMessage,
                    conversation.unread > 0 ? styles.unreadMessage : null,
                  ]}
                  numberOfLines={2}
                >
                  {conversation.lastMessage}
                </Text>
                {conversation.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>{conversation.unread}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.compatibilityContainer}>
                <Text style={styles.compatibilityText}>
                  {conversation.compatibility}% compatible
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Safety Notice */}
      <View style={styles.safetyNotice}>
        <Shield size={16} color="#E07A5F" />
        <Text style={styles.safetyText}>
          Always meet in public places and verify identity before sharing personal information.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 92, // Account for tab bar height
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Outfit-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  conversationImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  conversationImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  verificationBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    backgroundColor: '#A3B18A',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  compatibilityDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
  },
  conversationTime: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#9CA3AF',
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  conversationMessage: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    lineHeight: 18,
  },
  unreadMessage: {
    fontFamily: 'Outfit-Medium',
    color: '#1F2937',
  },
  unreadBadge: {
    backgroundColor: '#735510',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: 12,
    fontFamily: 'Outfit-SemiBold',
    color: '#FFFFFF',
  },
  compatibilityContainer: {
    alignSelf: 'flex-start',
  },
  compatibilityText: {
    fontSize: 12,
    fontFamily: 'Outfit-Medium',
    color: '#735510',
  },
  safetyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f1e8',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginHorizontal: 24,
    marginBottom: 20,
    borderRadius: 12,
  },
  safetyText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#5d4409',
    marginLeft: 8,
    lineHeight: 16,
  },
  // Chat screen styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatHeaderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  chatHeaderText: {
    flex: 1,
  },
  chatHeaderName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatHeaderNameText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#1F2937',
  },
  chatHeaderStatus: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  chatHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chatHeaderAction: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 4,
  },
  myMessageBubble: {
    backgroundColor: '#735510',
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  theirMessageText: {
    color: '#1F2937',
  },
  messageTime: {
    fontSize: 11,
    fontFamily: 'Outfit-Regular',
    color: '#9CA3AF',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    backgroundColor: '#9CA3AF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#735510',
  },
});