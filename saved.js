const savedFeed = document.getElementById("saved-feed");
let savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];
let storedLikes = JSON.parse(localStorage.getItem("likes")) || {};

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
        <div class="buttons">
          <button class="like-btn ${storedLikes[post.title] ? 'liked' : ''}">
            ${storedLikes[post.title] ? '❤️ Liked' : '❤️ Like'}
          </button>
        </div>
      </div>
    `;

    savedFeed.appendChild(card);

    const likeBtn = card.querySelector(".like-btn");
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
  });
}

displaySaved();
