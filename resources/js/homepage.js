function toggleDetails(element) {
  const details = element.nextElementSibling;
  const toggleIcon = element.querySelector(".game-toggle p");

  if (details.style.display === "flex") {
    details.style.display = "none";
    toggleIcon.textContent = "Ver mais";
  } else {
    details.style.display = "flex";
    toggleIcon.textContent = "Ver Menos";
  }
}

async function registerUser() {
  const name = document.getElementById("login").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://127.0.0.1:5000/register", {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, password }),
  });
  const data = await response.json();
  if (response.ok && data.message == "Cadastro realizado com sucesso!") {
    alert("Cadastro realizado com sucesso!");
  }
}

async function loginUser() {
  const name = document.getElementById("login").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://127.0.0.1:5000/login", {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, password }),
  });

  const data = await response.json();
  if (response.ok && data.message == "Usuário autenticado com sucesso!") {
    document.getElementById("login").disabled = true;
    document.getElementById("password").disabled = true;
    document.getElementById("submit-review").disabled = false;
    document.getElementById("login-button").remove();
    document.getElementById("register-button").remove();
    document.getElementById("logged-button").classList.add("active");
  }
  fetchUserReviews();
}

async function submitReview() {
  const game = document.getElementById("game-selector").value;
  const user = document.getElementById("login").value;
  const platform = document.getElementById("platform-selector").value;
  const rating = document.getElementById("number-dropdown").value;
  const review = document.getElementById("game-description").value;
  const image = document.getElementById("game-image").files[0];

  let base64Image = "";

  if (image) {
    const reader = new FileReader();
    reader.onload = async function (event) {
      const base64Image = event.target.result.split(",")[1];
      const response = await fetch("http://127.0.0.1:5000/review", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_id: game,
          user_id: user,
          platform_id: platform,
          rating: rating,
          review: review,
          image_blob: base64Image,
        }),
      });

      const result = await response.json();

      if (result.message === "Avaliação enviada com sucesso!") {
        alert("Sua avaliação foi enviada com sucesso!");
      }
    };
    reader.onerror = function (error) {
      console.error("FileReader error:", error);
    };

    reader.readAsDataURL(image);
  } else {
    const response = await fetch("http://127.0.0.1:5000/review", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        game_id: game,
        user_id: user,
        platform_id: platform,
        rating: rating,
        review: review,
        image_blob: base64Image,
      }),
    });
    const data = await response.json();
    if (response.ok && data.message == "Review cadastrada com sucesso!") {
      alert("Review cadastrada com sucesso!");
    }
  }
  fetchUserReviews();
}

async function fetchUserReviews() {
  if (document.getElementById("login").disabled == true) {
    const name = document.getElementById("login").value;
    const response = await fetch(
      `http://127.0.0.1:5000/fetchUserReviews?name=${name}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    const reviews = await response.json();
    const reviewsList = document.querySelector(".user-games-items");
    var element = document.getElementById("user-games-items");
    element.innerHTML = "";

    reviews.forEach((review) => {
      let image =
        review.image_blob == null || review.image_blob == ""
          ? "resources/images/placeholder.png"
          : `data:image/png;base64,${review.image_blob}`;
      const listItem = document.createElement("li");
      listItem.className = "user-game-item";
      listItem.innerHTML = `
                <div class="user-game-header" onclick="toggleDetails(this)">
                    <div class="game-info">
                        <p>${review.game}</p>
                        <p>${review.platform}</p>
                        <p>${review.rating} ★</p>
                    </div>
                    <div class="game-toggle">
                        <p>Ver Mais</p>
                    </div>
                </div>
                <div class="game-details" style="display: none;">
                    <img src=${image} alt="Game Image">
                    <p>${review.review}</p>
                </div>
            `;
      reviewsList.appendChild(listItem);
    });
  }
}

async function fetchGames() {
  const selector = document.getElementById("game-selector");

  const response = await fetch("http://127.0.0.1:5000/fetchGames");
  const games = await response.json();

  games.forEach((game) => {
    const option = document.createElement("option");
    option.value = game.game_id;
    option.textContent = game.name;
    selector.appendChild(option);
  });
}

async function fetchPlatforms() {
  const selector = document.getElementById("platform-selector");

  const response = await fetch("http://127.0.0.1:5000/fetchPlatforms");
  const games = await response.json();

  games.forEach((platform) => {
    const option = document.createElement("option");
    option.value = platform.platform_id;
    option.textContent = platform.name;
    selector.appendChild(option);
  });
}

function openTab(tabClass) {
  var tabContent = document.querySelectorAll(".tab-content");
  var buttons = document.querySelectorAll(".tab");

  tabContent.forEach(function (content) {
    content.classList.remove("active");
  });
  buttons.forEach(function (button) {
    button.classList.remove("active");
  });

  document.getElementById(tabClass + "-tab-content").classList.add("active");
  document.getElementById(tabClass + "-button").classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("DOMContentLoaded", function () {
    openTab("games");
  });

  async function fetchReviews() {
    const response = await fetch("http://127.0.0.1:5000/getreviews");
    const reviews = await response.json();

    const reviewsList = document.querySelector(".games-items");
    var element = document.getElementById("games-items");
    element.innerHTML = "";

    reviews.forEach((review) => {
      let image =
        review.image_blob == null || review.image_blob == ""
          ? "resources/images/placeholder.png"
          : `data:image/png;base64,${review.image_blob}`;
      const listItem = document.createElement("li");
      listItem.className = "game-item";
      listItem.innerHTML = `
                    <div class="game-header" onclick="toggleDetails(this)">
                        <div class="game-info">
                            <p>${review.game}</p>
                            <p>${review.user}</p>
                            <p>${review.platform}</p>
                            <p>${review.rating} ★</p>
                        </div>
                        <div class="game-toggle">
                            <p>Ver Mais</p>
                        </div>
                    </div>
                    <div class="game-details" style="display: none;">
                        <img src=${image} alt="Game Image">
                        <p>${review.review}</p>
                    </div>
                `;
      reviewsList.appendChild(listItem);
    });
  }

  fetchReviews();
  fetchGames();
  fetchPlatforms();
});
