const API_URL = "http://localhost:3000";

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
        // Store the JWT token in localStorage
        localStorage.setItem("authToken", result.token);
        alert("Login successful!");

        // Redirect to the main page
        window.location.href = "index.html";
    } else {
        alert(`Error: ${result.error}`);
    }

    e.target.reset();
});