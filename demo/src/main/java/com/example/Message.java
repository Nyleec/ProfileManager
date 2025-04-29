package com.example;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Message {
    private String sender;
    private String recipient;
    private String content;
    private LocalDateTime timestamp;

    private static final String MESSAGES_FILE_PATH = "messages.json";

// Write messages to JSON file
public static void writeMessagesToFile(List<Message> messages) throws IOException {
    ObjectMapper mapper = new ObjectMapper();
    mapper.writeValue(new File(MESSAGES_FILE_PATH), messages);
}

// Read messages from JSON file
public static List<Message> readMessagesFromFile() throws IOException {
    ObjectMapper mapper = new ObjectMapper();
    return mapper.readValue(new File(MESSAGES_FILE_PATH), new TypeReference<List<Message>>() {});
}

public static void sendMessage(String sender, String recipient, String content) throws IOException {
    // Create a new message
    Message message = new Message(sender, recipient, content);

    // Read existing messages
    List<Message> messages = new ArrayList<>();
    File file = new File(MESSAGES_FILE_PATH);
    if (file.exists()) {
        messages = readMessagesFromFile();
    }

    // Add the new message
    messages.add(message);

    // Write messages back to the file
    writeMessagesToFile(messages);
    System.out.println("Message sent from " + sender + " to " + recipient);
}

public static void viewMessages(String user) throws IOException {
    // Read messages from file
    List<Message> messages = readMessagesFromFile();

    // Filter messages for the user
    System.out.println("Messages for " + user + ":");
    for (Message message : messages) {
        if (message.getRecipient().equals(user)) {
            System.out.println(message);
        }
    }
}

    // Constructors
    public Message() {}

    public Message(String sender, String recipient, String content) {
        this.sender = sender;
        this.recipient = recipient;
        this.content = content;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "Message{" +
                "sender='" + sender + '\'' +
                ", recipient='" + recipient + '\'' +
                ", content='" + content + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }

    public static void main(String[] args) {
        try {
            // Example: Sending messages
            sendMessage("Alice", "Bob", "Hi Bob, how are you?");
            sendMessage("Bob", "Alice", "I'm good, Alice. Thanks!");
    
            // Example: Viewing messages
            viewMessages("Bob");
            viewMessages("Alice");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}