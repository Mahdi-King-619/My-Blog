// Admin Login
document.getElementById("adminLogin").addEventListener("click", () => {
    let username = prompt("Enter Admin Username:");
    let password = prompt("Enter Admin Password:");

    if (username === "S.Mahdi Al Hasan" && password === "Iamaboyandsiu") {
        alert("Login Successful!");
        window.location.href = "admin.html";
    } else {
        alert("Invalid credentials!");
    }
});

// Subscribe Users
document.getElementById("subscribeBtn").addEventListener("click", () => {
    let email = document.getElementById("userEmail").value;
    if (email === "") {
        alert("Enter an email to subscribe!");
        return;
    }
    db.collection("subscribers").doc(email).set({ email: email })
    .then(() => {
        document.getElementById("subStatus").innerText = "✅ Subscribed!";
    })
    .catch(error => {
        console.error("Error subscribing: ", error);
    });
});

// Load Blog Posts
function loadPosts() {
    const blogSection = document.getElementById("blogPosts");
    db.collection("posts").orderBy("date", "desc").onSnapshot(snapshot => {
        blogSection.innerHTML = "";
        snapshot.forEach(doc => {
            let post = doc.data();
            let postId = doc.id;

            blogSection.innerHTML += `
                <div class="post">
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                    <small>Posted on ${new Date(post.date).toLocaleDateString()}</small>
                </div>
            `;
        });
    });
}

window.onload = loadPosts;
