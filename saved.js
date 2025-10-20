const savedFeed = document.getElementById("saved-feed");
let savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];
let storedLikes = JSON.parse(localStorage.getItem("likes")) || {};

function displaySaved() {
  savedFeed.innerHTML = "";

  if (savedPosts.length === 0) {
    const msg = document.createElement("div");
    msg.style.textAlign = "center";
    msg.style.fontSize = "1.2rem";
    msg.style.color = "#555";
    msg.style.marginTop = "50px";
    msg.textContent = "💾 No saved posts yet!";
    savedFeed.appendChild(msg);
    return;
  }

  savedPosts.forEach(post => {
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
          <button class="delete-btn">🗑️ Delete</button>
        </div>
      </div>
    `;

    savedFeed.appendChild(card);

    const likeBtn = card.querySelector(".like-btn");
    const deleteBtn = card.querySelector(".delete-btn");
    const img = card.querySelector("img");

    img.onerror = () => {
      img.src = "https://via.placeholder.com/550x300?text=Image+Not+Available";
    };


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

  
    deleteBtn.addEventListener("click", () => {
      const confirmed = confirm(`Are you sure you want to delete "${post.title}"?`);
      if (confirmed) {
        savedPosts = savedPosts.filter(p => p.id !== post.id);
        localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
        displaySaved(); 
      }
    });
  });
}

displaySaved();
