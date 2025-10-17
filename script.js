const feed = document.getElementById("feed");

// Fetch saved posts from localStorage
let savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];

function generatePosts(count = 6) {
  for (let i = 0; i < count; i++) {
    const id = Date.now() + Math.floor(Math.random() * 1000); // unique id
    const post = {
      id: id,
      title: `FeedFlow Post #${Math.floor(Math.random() * 500)}`,
      text: "This is a sample post loaded dynamically to simulate a live feed experience.",
      img: `https://picsum.photos/seed/${Math.random()}/550/300`
    };

    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-id", post.id);
    card.innerHTML = `
      <img src="${post.img}" alt="Post Image">
      <div class="card-content">
        <h3>${post.title}</h3>
        <p>${post.text}</p>
        <div class="buttons">
          <button class="like-btn">❤️ Like</button>
          <button class="save-btn">${savedPosts.find(p => p.id === post.id) ? '💾 Saved' : '💾 Save'}</button>
        </div>
      </div>
    `;

    feed.appendChild(card);

    // Button logic
    const likeBtn = card.querySelector(".like-btn");
    const saveBtn = card.querySelector(".save-btn");

    likeBtn.addEventListener("click", () => {
      likeBtn.classList.toggle("liked");
      if (likeBtn.classList.contains("liked")) {
        likeBtn.textContent = "💖 Liked";
      } else {
        likeBtn.textContent = "❤️ Like";
      }
    });

    saveBtn.addEventListener("click", () => {
      if (savedPosts.find(p => p.id === post.id)) {
        savedPosts = savedPosts.filter(p => p.id !== post.id);
        saveBtn.textContent = "💾 Save";
      } else {
        savedPosts.push(post);
        saveBtn.textContent = "💾 Saved";
      }
      localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
    });
  }
}

// Initial posts
generatePosts();

// Infinite scroll
window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    generatePosts(4);
  }
});
