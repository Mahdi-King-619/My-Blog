const blogForm = document.getElementById("blogForm");
const publishButton = blogForm.querySelector("button[type='submit']");
const publishStatus = document.getElementById("publishStatus");

blogForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!title || !content) {
        publishStatus.textContent = "Add a title and story before publishing.";
        publishStatus.classList.add("is-error");
        return;
    }

    publishStatus.textContent = "Publishing your story...";
    publishStatus.classList.remove("is-error");
    publishButton.disabled = true;

    try {
        await db.collection("posts").add({
            title,
            content,
            date: firebase.firestore.FieldValue.serverTimestamp()
        });
        blogForm.reset();
        publishStatus.textContent = "Your story is live. Nice work!";
    } catch (error) {
        console.error("Error publishing post:", error);
        publishStatus.textContent = "We couldn't publish your story. Please try again.";
        publishStatus.classList.add("is-error");
    } finally {
        publishButton.disabled = false;
    }
});
