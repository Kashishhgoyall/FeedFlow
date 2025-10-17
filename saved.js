const savedFeed = document.getElementById("saved-feed");
let savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];

function displaySaved() {
  savedFeed.innerHTML = "";
  savedPosts.forEach(post => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${post.img}" alt="Post Image">
      <div class="card-content">
        <h3>${post.title}</h3>
        <p>${post.text}</p>
      </div>
    `;
    savedFeed.appendChild(card);
  });
}

displaySaved();
