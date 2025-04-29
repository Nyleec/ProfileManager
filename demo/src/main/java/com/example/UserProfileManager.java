package com.example;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

class UserProfile {
    private String name;
    private int age;
    private String location;
    private String description;

    // Constructors
    public UserProfile() {}

    public UserProfile(String name, int age, String location, String description) {
        this.name = name;
        this.age = age;
        this.location = location;
        this.description = description;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "UserProfile{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", location='" + location + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}


public class UserProfileManager {
    private static final String FILE_PATH = "user_profiles.json";

    // Write user profiles to JSON file
    public static void writeProfilesToFile(List<UserProfile> profiles) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(new File(FILE_PATH), profiles);
    }

    // Read user profiles from JSON file
    public static List<UserProfile> readProfilesFromFile() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(new File(FILE_PATH), new TypeReference<List<UserProfile>>() {});
    }

    public static void main(String[] args) {
        try {
            // Create sample user profiles
            List<UserProfile> profiles = new ArrayList<>();
            profiles.add(new UserProfile("Alice", 25, "New York", "Software Engineer"));
            profiles.add(new UserProfile("Bob", 30, "San Francisco", "Data Scientist"));
            profiles.add(new UserProfile("Charlie", 28, "Chicago", "Product Manager"));

            // Write profiles to JSON file
            writeProfilesToFile(profiles);
            System.out.println("Profiles written to file.");

            // Read profiles from JSON file
            List<UserProfile> readProfiles = readProfilesFromFile();
            System.out.println("Profiles read from file:");
            for (UserProfile profile : readProfiles) {
                System.out.println(profile);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}