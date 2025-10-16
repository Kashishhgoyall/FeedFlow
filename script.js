const feed = document.getElementById("feed");


function generatePosts(count = 6) {
  for (let i = 0; i < count; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="https://picsum.photos/seed/${Math.random()}/550/300" alt="Post Image">
      <div class="card-content">
        <h3>FeedFlow Post #${Math.floor(Math.random() * 500)}</h3>
        <p>This is a sample post </p>
      </div>
    `;
    feed.appendChild(card);
  }
}


generatePosts();


window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 10) {
    generatePosts(4);
  }
});
