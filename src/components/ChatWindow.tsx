import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Phone, 
  Video,
  Bot,
  Download,
  FileText,
  Image as ImageIcon
} from "lucide-react";

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

interface ChatWindowProps {
  chatId: string;
  chatName: string;
  chatAvatar?: string;
  isGroup: boolean;
  currentUserId: string;
  messages: Message[];
  onSendMessage: (content: string, type: 'text' | 'file') => void;
  onFileUpload: (file: File) => void;
  onGenerateAiReply: () => void;
}

export function ChatWindow({
  chatId,
  chatName,
  chatAvatar,
  isGroup,
  currentUserId,
  messages,
  onSendMessage,
  onFileUpload,
  onGenerateAiReply
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim(), 'text');
      setNewMessage("");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderMessage = (message: Message) => {
    const isOwn = message.senderId === currentUserId;
    
    return (
      <div
        key={message.id}
        className={`flex mb-4 animate-slide-in ${isOwn ? 'justify-end' : 'justify-start'}`}
      >
        {!isOwn && (
          <Avatar className="h-8 w-8 mr-2 mt-1">
            <AvatarImage src={chatAvatar} />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
              {message.senderName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className={`max-w-xs lg:max-w-md ${isOwn ? 'ml-auto' : ''}`}>
          {!isOwn && isGroup && (
            <p className="text-xs text-muted-foreground mb-1 px-2">{message.senderName}</p>
          )}
          
          <div
            className={`rounded-2xl px-4 py-2 relative ${
              isOwn
                ? 'bg-chat-sent text-white'
                : 'bg-chat-received text-foreground'
            } ${message.isAiGenerated ? 'border border-primary/30 bg-gradient-accent' : ''}`}
          >
            {message.isAiGenerated && (
              <div className="flex items-center gap-1 mb-2">
                <Bot className="h-3 w-3 text-primary" />
                <span className="text-xs text-primary font-medium">AI Generated</span>
              </div>
            )}

            {message.type === 'text' && (
              <p className="text-sm break-words">{message.content}</p>
            )}

            {message.type === 'image' && (
              <div className="space-y-2">
                <img
                  src={message.fileUrl}
                  alt={message.fileName}
                  className="rounded-lg max-w-full h-auto"
                />
                {message.content && (
                  <p className="text-sm break-words">{message.content}</p>
                )}
              </div>
            )}

            {message.type === 'file' && (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-background/10 rounded-lg">
                  <div className="bg-primary/20 p-2 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{message.fileName}</p>
                    <p className="text-xs opacity-70">
                      {message.fileSize && formatFileSize(message.fileSize)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-current hover:bg-background/20"
                    onClick={() => window.open(message.fileUrl, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                {message.content && (
                  <p className="text-sm break-words">{message.content}</p>
                )}
              </div>
            )}

            <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-muted-foreground'}`}>
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-border/50 bg-gradient-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={chatAvatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {chatName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{chatName}</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chat-online" />
                <span className="text-sm text-muted-foreground">Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-1">
          {messages.map(renderMessage)}
          {isTyping && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Avatar className="h-6 w-6">
                <AvatarImage src={chatAvatar} />
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                  {chatName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* AI Suggestions */}
      <div className="px-4 py-2 border-t border-border/50">
        <Button
          variant="glassmorphism"
          size="sm"
          onClick={onGenerateAiReply}
          className="w-full"
        >
          <Bot className="h-4 w-4 mr-2" />
          Generate AI Reply
        </Button>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border/50 bg-gradient-card/30 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="pr-20 resize-none"
              maxLength={1000}
            />
            <div className="absolute right-2 top-2 flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            variant="chat" 
            size="icon"
            disabled={!newMessage.trim()}
            className="h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
      </div>
    </div>
  );
}