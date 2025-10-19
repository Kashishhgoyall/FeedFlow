const feed = document.getElementById("feed");
let savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];
let allPosts = [];

const searchInput = document.getElementById("search");
let currentQuery = "";

let storedLikes = JSON.parse(localStorage.getItem("likes")) || {};


const imageMap = {
  "nature": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=550&q=80",
  "tech": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=550&q=80",
  "food": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=550&q=80",
  "city": "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=550&q=80",
  "travel": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=550&q=80",
};


function generatePosts(count = 6, query = "") {
  const keywords = Object.keys(imageMap);

  for (let i = 0; i < count; i++) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];

    const post = {
      id: id,
      title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Post #${Math.floor(Math.random() * 500)}`,
      text: "This is a sample post loaded dynamically to simulate a live feed experience.",
      img: imageMap[keyword]
    };

    allPosts.push(post);

    if (query === "" || post.title.toLowerCase().includes(query.toLowerCase())) {
      createCard(post);
    }
  }
}


function createCard(post) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-id", post.id);
  card.innerHTML = `
    <img src="${post.img}" alt="Post Image">
    <div class="card-content">
      <h3>${post.title}</h3>
      <p>${post.text}</p>
      <div class="buttons">
        <button class="like-btn ${storedLikes[post.title] ? 'liked' : ''}">
          ${storedLikes[post.title] ? '❤️ Liked' : '❤️ Like'}
        </button>
        <button class="save-btn">${savedPosts.find(p => p.id === post.id) ? '💾 Saved' : '💾 Save'}</button>
      </div>
    </div>
  `;

  feed.appendChild(card);

  const likeBtn = card.querySelector(".like-btn");
  const saveBtn = card.querySelector(".save-btn");
  const img = card.querySelector("img");

  
  img.onerror = () => {
    img.src = "https://via.placeholder.com/550x300?text=Image+Not+Available";
  };

 
  likeBtn.addEventListener("click", () => {
    if (likeBtn.classList.contains("liked")) {
      likeBtn.classList.remove("liked");
      likeBtn.textContent = "❤️ Like";
      delete storedLikes[post.title]; // 
    } else {
      likeBtn.classList.add("liked");
      likeBtn.textContent = "❤️ Liked";
      storedLikes[post.title] = true; 
    }
    localStorage.setItem("likes", JSON.stringify(storedLikes));
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


generatePosts();

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    generatePosts(4, currentQuery);
  }
});

searchInput.addEventListener("input", () => {
  currentQuery = searchInput.value.trim().toLowerCase();
  feed.innerHTML = "";

  const filtered = allPosts.filter(post => post.title.toLowerCase().includes(currentQuery));

  if (filtered.length === 0) {
    const noPostsMsg = document.createElement("div");
    noPostsMsg.style.textAlign = "center";
    noPostsMsg.style.fontSize = "1.2rem";
    noPostsMsg.style.color = "#555";
    noPostsMsg.style.marginTop = "50px";
    noPostsMsg.textContent = "😔 No posts found for your search!";
    feed.appendChild(noPostsMsg);
  } else {
    filtered.forEach(post => createCard(post));
  }
});
