const API_URL = "http://localhost:3000";

// Retrieve the JWT token from localStorage
const authToken = localStorage.getItem("authToken");

// Create a user profile
document.getElementById("createProfileForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const age = parseInt(document.getElementById("age").value);
    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;

    const response = await fetch(`${API_URL}/profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age, location, description }),
    });

    const result = await response.json();
    alert(result.message);
    e.target.reset();
});

// Send a message
document.getElementById("sendMessageForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Retrieve the JWT token from localStorage
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        alert("You must log in first.");
        return;
    }

    const recipient = document.getElementById("recipient").value;
    const content = document.getElementById("messageContent").value;

    // Send the message without including the sender field
    const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ recipient, content }), // No sender field
    });

    const result = await response.json();
    if (response.ok) {
        alert(result.message);
    } else {
        alert(`Error: ${result.error}`);
    }

    e.target.reset();
});

// View messages for a user
document.getElementById("viewMessagesForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = document.getElementById("viewUser").value;

    const response = await fetch(`${API_URL}/messages/${user}`);
    const messages = await response.json();

    const messageList = document.getElementById("messageList");
    messageList.innerHTML = ""; // Clear previous messages

    if (messages.length === 0) {
        messageList.innerHTML = "<li>No messages found for this user.</li>";
    } else {
        messages.forEach((msg) => {
            const li = document.createElement("li");
            li.textContent = `${msg.sender} -> ${msg.recipient}: ${msg.content} (${msg.timestamp})`;
            messageList.appendChild(li);
        });
    }
});

// Register a user
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    alert(result.message);
    e.target.reset();
});

// Login a user
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    if (response.ok) {
        authToken = result.token;
        alert("Login successful!");
    } else {
        alert(`Error: ${result.error}`);
    }

    e.target.reset();
});

// View messages for the logged-in user
document.getElementById("viewMessagesForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!authToken) {
        alert("You must log in first.");
        return;
    }

    // Fetch messages for the logged-in user
    const response = await fetch(`${API_URL}/messages`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.error}`);
        return;
    }

    const messages = await response.json();
    const messageList = document.getElementById("messageList");
    messageList.innerHTML = ""; // Clear previous messages

    if (messages.length === 0) {
        messageList.innerHTML = "<li>No messages found.</li>";
    } else {
        messages.forEach((msg) => {
            const li = document.createElement("li");
            li.textContent = `${msg.sender}: ${msg.content} (${msg.timestamp})`;
            messageList.appendChild(li);
        });
    }
});

// Logout a user
document.getElementById("logoutButton").addEventListener("click", () => {
    // Clear the JWT token from localStorage
    localStorage.removeItem("authToken");

    // Redirect to the login page
    window.location.href = "login.html";
});