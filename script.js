const feed = document.getElementById("feed");
let savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];
let allPosts = JSON.parse(localStorage.getItem("allPosts")) || [];
const searchInput = document.getElementById("search");
let currentQuery = "";
let storedLikes = JSON.parse(localStorage.getItem("likes")) || {};

const postModal = document.getElementById("post-modal");
const modalTitle = document.getElementById("modal-title");
const postTitleInput = document.getElementById("post-title");
const postTextInput = document.getElementById("post-text");
const postImgInput = document.getElementById("post-img");
const savePostBtn = document.getElementById("save-post-btn");
const addPostHeaderBtn = document.getElementById("add-post-header-btn");
const closeModal = document.getElementById("close-modal");

let editingPostId = null; 

const imageMap = {
  "nature": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=550&q=80",
  "tech": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=550&q=80",
  "food": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=550&q=80",
  "city": "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=550&q=80",
  "travel": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=550&q=80"
};

function timeAgo(timestamp) {
  const diff = Math.floor((Date.now() - timestamp) / 60000);
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff} minute(s) ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours} hour(s) ago`;
  const days = Math.floor(hours / 24);
  return `${days} day(s) ago`;
}

function createCard(post) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-id", post.id);
  card.innerHTML = `
    <img src="${post.img}" alt="Post Image">
    <div class="card-content">
      <h3>${post.title}</h3>
      <small class="timestamp">Posted ${timeAgo(post.timestamp)}</small>
      <p>${post.text}</p>
      <div class="buttons">
        <button class="like-btn ${storedLikes[post.title] ? 'liked' : ''}">
          ${storedLikes[post.title] ? '❤️ Liked' : '❤️ Like'}
        </button>
        <button class="save-btn">${savedPosts.find(p => p.id === post.id) ? '💾 Saved' : '💾 Save'}</button>
        <button class="edit-btn">✏️ Edit</button>
        <button class="delete-btn">🗑 Delete</button>
      </div>
    </div>
  `;
  feed.appendChild(card);

  const likeBtn = card.querySelector(".like-btn");
  const saveBtn = card.querySelector(".save-btn");
  const editBtn = card.querySelector(".edit-btn");
  const deleteBtn = card.querySelector(".delete-btn");
  const img = card.querySelector("img");

  img.onerror = () => img.src = "https://via.placeholder.com/550x300?text=Image+Not+Available";

  
  likeBtn.addEventListener("click", () => {
    if (likeBtn.classList.contains("liked")) {
      likeBtn.classList.remove("liked");
      likeBtn.textContent = "❤️ Like";
      delete storedLikes[post.title];
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

  
  deleteBtn.addEventListener("click", () => {
    allPosts = allPosts.filter(p => p.id !== post.id);
    savedPosts = savedPosts.filter(p => p.id !== post.id);
    localStorage.setItem("allPosts", JSON.stringify(allPosts));
    localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
    renderPosts();
  });

  
  editBtn.addEventListener("click", () => {
    editingPostId = post.id;
    modalTitle.textContent = "Edit Post";
    savePostBtn.textContent = "Save Changes";
    postTitleInput.value = post.title;
    postTextInput.value = post.text;
    postImgInput.value = "";
    postModal.style.display = "flex";
  });
}

function renderPosts() {
  feed.innerHTML = "";
  storedLikes = JSON.parse(localStorage.getItem("likes")) || {}; // Refresh likes
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

function generatePosts(count = 6) {
  const keywords = Object.keys(imageMap);
  for (let i = 0; i < count; i++) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    const post = {
      id,
      title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Post #${Math.floor(Math.random() * 500)}`,
      text: "This is a sample post loaded dynamically to simulate a live feed experience.",
      img: imageMap[keyword],
      timestamp: Date.now()
    };
    allPosts.push(post);
  }
  localStorage.setItem("allPosts", JSON.stringify(allPosts));
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


addPostHeaderBtn.addEventListener("click", () => {
  editingPostId = null;
  modalTitle.textContent = "Add New Post";
  savePostBtn.textContent = "Add Post";
  postTitleInput.value = "";
  postTextInput.value = "";
  postImgInput.value = "";
  postModal.style.display = "flex";
});


closeModal.addEventListener("click", () => postModal.style.display = "none");
window.addEventListener("click", (e) => {
  if (e.target === postModal) postModal.style.display = "none";
});


savePostBtn.addEventListener("click", () => {
  const title = postTitleInput.value.trim();
  const text = postTextInput.value.trim();
  const file = postImgInput.files[0];
  if (!title || !text) return alert("Please enter title and content!");

  let imgURL = "https://via.placeholder.com/550x300?text=No+Image";
  if (file) imgURL = URL.createObjectURL(file);

  if (editingPostId) {
    allPosts = allPosts.map(post => {
      if (post.id === editingPostId) {
        return { ...post, title, text, img: file ? imgURL : post.img };
      }
      return post;
    });
  } else {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    allPosts.unshift({ id, title, text, img: imgURL, timestamp: Date.now() });
  }

  localStorage.setItem("allPosts", JSON.stringify(allPosts));
  postModal.style.display = "none";
  renderPosts();
});  