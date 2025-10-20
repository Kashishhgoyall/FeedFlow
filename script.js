const feed = document.getElementById("feed");
let savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];
let allPosts = JSON.parse(localStorage.getItem("allPosts")) || [];
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
        <button class="like-btn ${storedLikes[post.id] ? 'liked' : ''}">
          ${storedLikes[post.id] ? '❤️ Liked' : '❤️ Like'}
        </button>
        <button class="save-btn">${savedPosts.find(p => p.id === post.id) ? '💾 Saved' : '💾 Save'}</button>
        <button class="delete-btn">🗑 Delete</button>
      </div>
    </div>
  `;
  feed.appendChild(card);

  const likeBtn = card.querySelector(".like-btn");
  const saveBtn = card.querySelector(".save-btn");
  const deleteBtn = card.querySelector(".delete-btn");
  const img = card.querySelector("img");

  img.onerror = () => img.src = "https://via.placeholder.com/550x300?text=Image+Not+Available";

  likeBtn.addEventListener("click", () => {
    if (likeBtn.classList.contains("liked")) {
      likeBtn.classList.remove("liked");
      likeBtn.textContent = "❤️ Like";
      delete storedLikes[post.id];
    } else {
      likeBtn.classList.add("liked");
      likeBtn.textContent = "❤️ Liked";
      storedLikes[post.id] = true;
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

  deleteBtn.addEventListener("click", () => {
    allPosts = allPosts.filter(p => p.id !== post.id);
    savedPosts = savedPosts.filter(p => p.id !== post.id);
    localStorage.setItem("allPosts", JSON.stringify(allPosts));
    localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
    renderPosts();
  });
}

function generatePosts(count = 6) {
  const keywords = Object.keys(imageMap);
  for (let i = 0; i < count; i++) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    const post = {
      id,
      title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Post #${Math.floor(Math.random() * 500)}`,
      text: "This is a sample post loaded dynamically to simulate a live feed experience.",
      img: imageMap[keyword]
    };
    allPosts.push(post);
  }
  localStorage.setItem("allPosts", JSON.stringify(allPosts));
}

function renderPosts() {
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
}

searchInput.addEventListener("input", () => {
  currentQuery = searchInput.value.trim().toLowerCase();
  renderPosts();
});

if (allPosts.length === 0) generatePosts();
renderPosts();


window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    generatePosts(3);
    renderPosts();
  }
});

const addPostBtnHeader = document.getElementById("add-post-header-btn");
const addPostModal = document.getElementById("add-post-modal");
const closeModal = document.getElementById("close-modal");
const newTitle = document.getElementById("new-title");
const newText = document.getElementById("new-text");
const newImg = document.getElementById("new-img");
const addPostBtn = document.getElementById("add-post-btn");

addPostBtnHeader.addEventListener("click", () => addPostModal.style.display = "flex");
closeModal.addEventListener("click", () => addPostModal.style.display = "none");
window.addEventListener("click", (e) => { if(e.target === addPostModal) addPostModal.style.display = "none"; });

addPostBtn.addEventListener("click", () => {
  const title = newTitle.value.trim();
  const text = newText.value.trim();
  const file = newImg.files[0];
  if (!title || !text) return alert("Please enter title and content!");

  const id = Date.now() + Math.floor(Math.random() * 1000);
  let imgURL = "https://via.placeholder.com/550x300?text=No+Image";
  if (file) imgURL = URL.createObjectURL(file);

  const post = { id, title, text, img: imgURL };
  allPosts.unshift(post);
  localStorage.setItem("allPosts", JSON.stringify(allPosts));

  newTitle.value = "";
  newText.value = "";
  newImg.value = "";
  addPostModal.style.display = "none";

  renderPosts();
});
