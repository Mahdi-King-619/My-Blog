const adminAuth = firebase.auth();
const signInPanel = document.getElementById("signInPanel");
const editorPanel = document.getElementById("editorPanel");
const signInForm = document.getElementById("signInForm");
const signInButton = signInForm.querySelector("button[type='submit']");
const signInStatus = document.getElementById("signInStatus");
const signOutButton = document.getElementById("signOutButton");
const blogForm = document.getElementById("blogForm");
const publishButton = blogForm.querySelector("button[type='submit']");
const publishStatus = document.getElementById("publishStatus");
const publishTimeoutMs = 15000;

function setStatus(element, message, isError = false) {
    element.textContent = message;
    element.classList.toggle("is-error", isError);
}

function getSignInErrorMessage(error) {
    switch (error && error.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
            return "The email or password is incorrect.";
        case "auth/operation-not-allowed":
            return "Email/password sign-in is disabled. Enable it in Firebase Authentication settings.";
        case "auth/too-many-requests":
            return "Too many sign-in attempts. Wait a few minutes, then try again.";
        case "auth/network-request-failed":
            return "Firebase could not be reached. Check your connection and try again.";
        default:
            return `Sign-in failed${error && error.code ? ` (${error.code})` : ""}. Check Firebase Authentication settings and try again.`;
    }
}

function showPublishError(error) {
    const code = error && error.code;
    const message = document.createElement("span");

    if (code === "permission-denied" || code === "unauthenticated") {
        message.textContent = "Firestore rejected this post. Enable Cloud Firestore and check that its security rules allow signed-in administrators to publish.";
    } else if (code === "failed-precondition") {
        message.textContent = "Firestore is not ready to accept posts. Create the database and check the Firebase project setup.";
    } else if (code === "unavailable" || code === "deadline-exceeded" || code === "timeout") {
        message.textContent = "Firebase did not confirm the save. The post may still finish later, so check the blog before trying again.";
    } else {
        message.textContent = `We couldn't publish this story${code ? ` (${code})` : ""}. Check the Firebase project setup and try again.`;
    }

    const consoleLink = document.createElement("a");
    consoleLink.href = "https://console.firebase.google.com/project/my-blog-c7080/firestore";
    consoleLink.target = "_blank";
    consoleLink.rel = "noopener noreferrer";
    consoleLink.textContent = " Open Firestore settings";

    publishStatus.replaceChildren(message, consoleLink);
    publishStatus.classList.add("is-error");
}

adminAuth.onAuthStateChanged((user) => {
    signInPanel.hidden = Boolean(user);
    editorPanel.hidden = !user;
    if (user) {
        setStatus(signInStatus, "");
    }
}, (error) => {
    console.error("Error checking Firebase sign-in state:", error);
    signInPanel.hidden = false;
    editorPanel.hidden = true;
    setStatus(signInStatus, "Unable to check your sign-in. Refresh the page and try again.", true);
});

signInForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;
    setStatus(signInStatus, "Signing in...");
    signInButton.disabled = true;

    try {
        await adminAuth.signInWithEmailAndPassword(email, password);
        signInForm.reset();
    } catch (error) {
        console.error("Error signing in to Firebase:", error);
        setStatus(signInStatus, getSignInErrorMessage(error), true);
    } finally {
        signInButton.disabled = false;
    }
});

signOutButton.addEventListener("click", async () => {
    try {
        await adminAuth.signOut();
    } catch (error) {
        console.error("Error signing out of Firebase:", error);
        setStatus(publishStatus, "Could not sign out. Check your connection and try again.", true);
    }
});

blogForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!adminAuth.currentUser) {
        setStatus(publishStatus, "Sign in with the administrator account before publishing.", true);
        return;
    }

    if (!title || !content) {
        setStatus(publishStatus, "Add a title and story before publishing.", true);
        return;
    }

    setStatus(publishStatus, "Publishing your story...");
    publishButton.disabled = true;

    let timeoutId;
    try {
        const savePost = db.collection("posts").add({
            title,
            content,
            date: firebase.firestore.FieldValue.serverTimestamp()
        });
        const timeout = new Promise((resolve, reject) => {
            timeoutId = window.setTimeout(() => {
                const error = new Error("Timed out waiting for Firestore to confirm the post.");
                error.code = "timeout";
                reject(error);
            }, publishTimeoutMs);
        });

        await Promise.race([savePost, timeout]);
        blogForm.reset();
        setStatus(publishStatus, "Your story is live. Nice work!");
    } catch (error) {
        console.error("Error publishing post:", error);
        showPublishError(error);
    } finally {
        window.clearTimeout(timeoutId);
        publishButton.disabled = false;
    }
});
