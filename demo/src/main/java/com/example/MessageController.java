package com.example;

import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    private static final String MESSAGES_FILE_PATH = "messages.json";

    // Send a message
    @PostMapping("/send")
    public String sendMessage(@RequestBody Message message) throws IOException {
        List<Message> messages = new ArrayList<>();
        File file = new File(MESSAGES_FILE_PATH);
        if (file.exists()) {
            messages = UserProfileManager.readMessagesFromFile();
        }
        messages.add(message);
        UserProfileManager.writeMessagesToFile(messages);
        return "Message sent from " + message.getSender() + " to " + message.getRecipient();
    }

    // View messages for a user
    @GetMapping("/view/{user}")
    public List<Message> viewMessages(@PathVariable String user) throws IOException {
        List<Message> messages = UserProfileManager.readMessagesFromFile();
        List<Message> userMessages = new ArrayList<>();
        for (Message message : messages) {
            if (message.getRecipient().equals(user)) {
                userMessages.add(message);
            }
        }
        return userMessages;
    }
}