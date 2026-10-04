const blogSection = document.getElementById("blogPosts");
const subscribeForm = document.getElementById("subscribeForm");
const subscribeButton = document.getElementById("subscribeBtn");
const subscribeStatus = document.getElementById("subStatus");

document.getElementById("adminLogin").addEventListener("click", () => {
    window.location.href = "admin.html";
});

subscribeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("userEmail").value.trim().toLowerCase();
    subscribeStatus.textContent = "";
    subscribeStatus.classList.remove("is-error");
    subscribeButton.disabled = true;

    try {
        await db.collection("subscribers").doc(email).set({ email });
        subscribeStatus.textContent = "You're on the list. Thanks for subscribing!";
        subscribeForm.reset();
    } catch (error) {
        console.error("Error subscribing:", error);
        subscribeStatus.textContent = "We couldn't save your subscription. Please try again.";
        subscribeStatus.classList.add("is-error");
    } finally {
        subscribeButton.disabled = false;
    }
});

function formatPostDate(dateValue) {
    const date = dateValue && typeof dateValue.toDate === "function"
        ? dateValue.toDate()
        : dateValue instanceof Date
            ? dateValue
            : null;

    if (!date || Number.isNaN(date.getTime())) {
        return "Just published";
    }

    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    }).format(date);
}

function renderPost(post) {
    const article = document.createElement("article");
    article.className = "post";

    const meta = document.createElement("div");
    meta.className = "post-meta";

    const date = document.createElement("time");
    date.textContent = formatPostDate(post.date);
    if (post.date && typeof post.date.toDate === "function") {
        date.dateTime = post.date.toDate().toISOString();
    }

    const dot = document.createElement("span");
    dot.className = "post-meta-dot";
    dot.setAttribute("aria-hidden", "true");

    const category = document.createElement("span");
    category.textContent = "A note from Mahdi";

    const title = document.createElement("h3");
    title.textContent = post.title || "Untitled story";

    const content = document.createElement("p");
    content.textContent = post.content || "";

    meta.append(date, dot, category);
    article.append(meta, title, content);
    return article;
}

function loadPosts() {
    db.collection("posts")
        .orderBy("date", "desc")
        .onSnapshot((snapshot) => {
            blogSection.replaceChildren();

            if (snapshot.empty) {
                const emptyMessage = document.createElement("p");
                emptyMessage.className = "feed-message";
                emptyMessage.textContent = "No stories just yet. Check back soon for something new.";
                blogSection.append(emptyMessage);
                return;
            }

            snapshot.forEach((document) => {
                blogSection.append(renderPost(document.data()));
            });
        }, (error) => {
            console.error("Error loading blog posts:", error);
            blogSection.replaceChildren();
            const errorMessage = document.createElement("p");
            errorMessage.className = "feed-message";
            errorMessage.textContent = "We couldn't load the stories right now. Please refresh and try again.";
            blogSection.append(errorMessage);
        });
}

document.getElementById("currentYear").textContent = new Date().getFullYear();
loadPosts();
