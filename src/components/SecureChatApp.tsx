import { useState, useEffect } from "react";
import { AuthForm } from "./AuthForm";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isAiGenerated?: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isGroup: boolean;
  participants?: User[];
}

export function SecureChatApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>();
  const [darkMode, setDarkMode] = useState(true);
  const { toast } = useToast();

  // Mock data - in real app, this would come from Supabase
  const [chats] = useState<Chat[]>([
    {
      id: "1",
      name: "Alice Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b6121593?w=150&h=150&fit=crop&crop=face",
      lastMessage: "Hey! How's the new project going?",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 2,
      isGroup: false
    },
    {
      id: "2", 
      name: "Development Team",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop",
      lastMessage: "The backend API is ready for testing",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
      isGroup: true
    },
    {
      id: "3",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      lastMessage: "Thanks for the file! 📎",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unreadCount: 0,
      isGroup: false
    }
  ]);

  const [messages] = useState<{ [chatId: string]: Message[] }>({
    "1": [
      {
        id: "m1",
        senderId: "user-alice",
        senderName: "Alice Johnson",
        content: "Hey! How's the new project going?",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        type: 'text'
      },
      {
        id: "m2",
        senderId: "current-user",
        senderName: "You",
        content: "It's going great! Just implemented the chat interface.",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        type: 'text'
      },
      {
        id: "m3",
        senderId: "user-alice",
        senderName: "Alice Johnson",
        content: "That sounds awesome! Can't wait to see it.",
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        type: 'text'
      }
    ],
    "2": [
      {
        id: "m4",
        senderId: "user-dev1",
        senderName: "Mike Rodriguez",
        content: "The backend API is ready for testing",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'text'
      },
      {
        id: "m5",
        senderId: "current-user",
        senderName: "You",
        content: "Perfect! I'll start integration testing today.",
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        type: 'text'
      }
    ],
    "3": [
      {
        id: "m6",
        senderId: "current-user",
        senderName: "You",
        content: "Here's the design mockup you requested",
        timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
        type: 'file',
        fileName: "design-mockup.pdf",
        fileSize: 2048576,
        fileUrl: "#"
      },
      {
        id: "m7",
        senderId: "user-sarah",
        senderName: "Sarah Chen",
        content: "Thanks for the file! 📎",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        type: 'text'
      }
    ]
  });

  useEffect(() => {
    // Set theme on mount
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleAuth = (user: User) => {
    setCurrentUser(user);
    toast({
      title: "Welcome to SecureChat!",
      description: "You have successfully signed in.",
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedChatId(undefined);
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const handleSendMessage = (content: string, type: 'text' | 'file') => {
    // In real app, this would send to Supabase and trigger real-time updates
    toast({
      title: "Message sent",
      description: "Your message has been delivered.",
    });
  };

  const handleFileUpload = (file: File) => {
    // In real app, this would upload to Supabase Storage
    toast({
      title: "File uploaded",
      description: `${file.name} has been uploaded successfully.`,
    });
  };

  const handleGenerateAiReply = () => {
    // In real app, this would call Gemini API via Supabase Edge Function
    toast({
      title: "AI Reply Generated",
      description: "Smart reply suggestions are ready.",
    });
  };

  const handleNewChat = () => {
    toast({
      title: "New Chat",
      description: "Search for users to start a new conversation.",
    });
  };

  const selectedChat = chats.find(chat => chat.id === selectedChatId);
  const chatMessages = selectedChatId ? messages[selectedChatId] || [] : [];

  if (!currentUser) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return (
    <div className="h-screen bg-gradient-background flex">
      <ChatSidebar
        currentUser={currentUser}
        chats={chats}
        selectedChatId={selectedChatId}
        onChatSelect={setSelectedChatId}
        onNewChat={handleNewChat}
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
      
      {selectedChat ? (
        <ChatWindow
          chatId={selectedChat.id}
          chatName={selectedChat.name}
          chatAvatar={selectedChat.avatar}
          isGroup={selectedChat.isGroup}
          currentUserId="current-user"
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
          onGenerateAiReply={handleGenerateAiReply}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gradient-background">
          <div className="text-center">
            <div className="bg-gradient-primary rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-glow">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to SecureChat</h2>
            <p className="text-muted-foreground">Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}