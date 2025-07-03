let lives = 3;
const livesEl = document.getElementById("lives");
const cardData = [
  {
    title: "Meissen Pieta",
    year: 1732,
    description: "German",
    image: "img/Meissen Pieta.png",
  },
  {
    title: "IncPicasso Plat Del Dia.",
    year: 1900,
    description: "Spanish",
    image: "img/Picasso.png",
  },
  {
    title: "Apollo - Genius of the Arts",

    year: 1700,
    description: "German",
    image: "img/Apollo.png",
  },
  {
    title: "A Day at the Hunt by Ingrid Murphy",
    year: 2016,
    description: "Irish",
    image: "img/A Day at the Hunt by Ingrid Murphy.png",
  },
];
function updateLives() {
  livesEl.innerText = "❤️".repeat(lives);
  if (lives <= 0) {
    alert("Game Over!");
    restart();
  }
}
function createCard(item) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("draggable", true);
  card.dataset.year = item.year;
  card.innerHTML = `
    <div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>
    <img src="${item.image}" alt="${item.title}">
  `;
  return card;
}

function initCards() {
  const cardPool = document.getElementById("cardPool");
  cardPool.innerHTML = "";
  cardData.forEach((data) => {
    const card = createCard(data);
    card.addEventListener("dragstart", dragStart);
    cardPool.appendChild(card);
  });
}

function dragStart(e) {
  if (this.dataset.placed === "true") {
    e.preventDefault();
    return;
  }
  e.dataTransfer.setData("text/plain", this.outerHTML);
  e.dataTransfer.setData("year", this.dataset.year);
  this.classList.add("dragging");
  setTimeout(() => (this.style.display = "none"), 0);
}

document.addEventListener("dragend", function (e) {
  const dragging = document.querySelector(".dragging");
  if (dragging) {
    dragging.classList.remove("dragging");
    dragging.style.display = "";
  }
});

const timeline = document.getElementById("timeline");

timeline.addEventListener("dragover", function (e) {
  e.preventDefault();
  const afterElement = getDragAfterElement(timeline, e.clientX);
  const dragging = document.querySelector(".dragging");
  if (!dragging) return;

  if (afterElement == null) {
    timeline.appendChild(dragging);
  } else {
    timeline.insertBefore(dragging, afterElement);
  }
});

timeline.addEventListener("drop", function (e) {
  e.preventDefault();
  const dragging = document.querySelector(".dragging");
  if (dragging) {
    dragging.dataset.placed = "true";
  }
});

function getDragAfterElement(container, x) {
  const draggableElements = [
    ...container.querySelectorAll(".card:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = x - box.left - box.width / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function checkOrder() {
  const timelineCards = timeline.querySelectorAll(".card");
  if (timelineCards.length < cardData.length) {
    alert("Please place all cards before checking!");
    return;
  }

  const years = Array.from(timelineCards).map((c) => parseInt(c.dataset.year));
  const isSorted = years.every((year, i, arr) => i === 0 || year >= arr[i - 1]);

  if (isSorted) {
    alert("✅ Correct!");
  } else {
    alert("❌ Incorrect order. Try again.");
  }
  lives--;
  updateLives();
}

function restartGame() {
  initCards();
  timeline.innerHTML = "";
}

window.onload = () => {
  initCards();
};
