// Handle Form Submission
document.getElementById("blogForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;

    db.collection("posts").add({
        title: title,
        content: content,
        date: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("Post Published!");
        document.getElementById("blogForm").reset();
    }).catch(error => {
        alert("Error publishing post: " + error);
    });
});
