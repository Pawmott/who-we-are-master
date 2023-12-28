const URL = "https://my-json-server.typicode.com/Devfrog92/who-we-are/members";
let numOfMembers = 4;
let carouselIdx = 0;
let sequence = 5;
let members;

async function init() {
  await startEntryAnimation();
  await getMemberData();
  render();
}

init();

function existMembersInLocalStorage() {
  return !!localStorage.getItem("members");
}

function addNewMember(memberData) {
  const origin = JSON.parse(localStorage.getItem("members"));
  members = [...origin, memberData];
  localStorage.setItem("members", JSON.stringify(members));
  numOfMembers += 1;
}

function setRegisterFormTemplate() {
  const formContainer = document.querySelector(".register-form-container");
  drawMemberFormTemplate(formContainer);

  const form = document.querySelector(".register-form");
  const choicePockemon = document.querySelector(".choice-pokemon");
  const addButton = document.querySelector(".add-member-btn");
  const registerBtn = document.querySelector(".regiter-btn");
  const closeFormBtn = document.querySelector(".close-form-btn");
  let choicePockemonNumber = null;
  let choicePockemonName = null;

  addButton.addEventListener("click", () => {
    formContainer.classList.add("show");
  });

  closeFormBtn.addEventListener("click", () => {
    formContainer.classList.remove("show");
  });

  choicePockemon.addEventListener("click", (e) => {
    const target = e.target;
    const number = target.dataset.number;
    const name = target.dataset.name;

    if (target.classList.contains("choice-pokemon-item")) {
      choicePockemonNumber = number;
      choicePockemonName = name;
    }
  });

  registerBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (choicePockemonName == null || choicePockemonNumber == null) {
      alert("포켓몬을 선택해주세요!");
      return;
    }

    const data = {
      id: sequence++,
      pokemonName: choicePockemonName,
      memberName: form.memberName.value,
      mbti: form.mbti.value,
      pokemonNumber: choicePockemonNumber,
      about: form.about.value,
      goal: form.goal.value,
    };

    await fetch(URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
    });

    formContainer.classList.remove("show");
    addNewMember(data);
    clearForm(form);
    alert("성공적으로 등록되었습니다.");
    draw();
  });
}

function clearForm(form) {
  form.memberName.value = "";
  form.mbti.value = "";
  form.about.value = "";
  form.goal.value = "";
}

async function startEntryAnimation() {
  const backgroundImage = document.querySelector(".background-wallpaper");
  if (sessionStorage.getItem("animationPlay")) {
    backgroundImage.classList.add("hide");
    return;
  }

  await setTimeout(() => {
    backgroundImage.classList.add("hide");
    sessionStorage.setItem("animationPlay", true);
  }, 5000);
}

function render() {
  const listContainer = document.querySelector(".list-container");
  const modal = document.querySelector(".modal");
  const modalCloseBtn = document.querySelector(".modal-close-btn");
  const modalFrame = document.querySelector(".modal-frame");
  let isModalOpen = false;
  numOfMembers = members.length;

  setRegisterFormTemplate();
  draw();
  setCarousel();

  listContainer.addEventListener("click", (e) => {
    const target = e.target;
    const id = target.dataset.id;

    if (target.classList.contains("item")) {
      if (isModalOpen) return;
      modal.classList.add("show");
      modalFrame.innerHTML = "";
      modalFrame.appendChild(modalTemplate(members[id - 1]));
      isModalOpen = true;
    }
  });

  modalCloseBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    isModalOpen = false;
  });
}

function drawMemberFormTemplate(formContainer) {
  formContainer.innerHTML = `
        <form class="register-form">
            <ul class="choice-pokemon">
                <li class="choice-pokemon-item" data-number="0025" data-name="Pikachu">
                        <img src="./assets/character0025.png" />
                </li>
                <li class="choice-pokemon-item" data-number="0069" data-name="Bellsprout">
                        <img src="./assets/character0069.png" />
                </li>
                <li class="choice-pokemon-item"  data-number="0138" data-name="Omanyte">
                        <img src="./assets/character0138.png"/>
                </li>
            </ul>
            <div class="input-wrapper">
                <label for="memberName">
                    이름:
                    <input type="text" id="memberName" name="memberName" />
                </label>
                <label for="mbti">
                    MBTI:
                    <input type="text" id="mbti" name="mbti" />
                </label>
                <label for="about">
                    자기 소개:
                    <input type="text" id="about" name="about" />
                </label>
                <label for="goal">
                    목표:
                    <input type="text" id="goal" name="goal" />
                </label>
            </div>
            <div class="form-btn-wrapper">
                <button type="button" class="regiter-btn">등록하기</button>
                <button type="button" class="close-form-btn">취소하기</button>
            </div>
        </form>`;
}

async function getMemberData() {
  if (!existMembersInLocalStorage()) {
    const response = await fetch(
      "https://my-json-server.typicode.com/Devfrog92/who-we-are/members"
    );
    members = await response.json();
    localStorage.setItem("members", JSON.stringify(members));
  } else {
    members = JSON.parse(localStorage.getItem("members"));
  }

  return members;
}

function moveCarousel(distance) {
  const listContainer = document.querySelector(".list-container");
  listContainer.style.transform = `translate(${distance}px, -50%)`;
}

function setCarousel() {
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  prevBtn.addEventListener("click", () => {
    if (carouselIdx === 0) return;
    carouselIdx -= 1;
    moveCarousel(-500 * carouselIdx - 250);
  });

  nextBtn.addEventListener("click", () => {
    if (carouselIdx === numOfMembers - 1) return;
    carouselIdx += 1;
    moveCarousel(-1 * (500 * carouselIdx + 250));
  });
}

function draw() {
  const listContainer = document.querySelector(".list-container");
  listContainer.innerHTML = "";
  for (let i = 0; i < members.length; i++) {
    const li = document.createElement("li");
    li.classList.add("item");
    li.dataset.id = i + 1;
    li.innerHTML = template(members[i]);
    listContainer.appendChild(li);
  }
}

function template(memberData) {
  return `
        <div class="pokeball"><img src="./assets/ball_close.png" /></div>
        <div class="pokeball-open"><img src="./assets/ball_open.png" /></div>
        <div class="character"><img src="./assets/character${memberData.pokemonNumber}.png" /></div>
        <div class="frame">
            <div class="text-container">
                <h3 class="title">${memberData.pokemonName}</h3>
                <p class="subtitle">#${memberData.pokemonNumber}</p>
            </div>
        </div>
    `;
}

function modalTemplate(memberData) {
  const section = document.createElement("section");
  let ballNum = Math.floor(Math.random() * 4 + 1);
  section.classList.add("modal-content");
  section.innerHTML = `
        <div class="character">
            <img src="./assets/character${memberData.pokemonNumber}.png"/>
        </div>
        <hr class="divide">
        <div class="info">
            <div class="info-header">
                <div class="name">
                    <p>${memberData.pokemonName}</p>
                    <div class="status">
                        <span class="ball">
                            <img src="./assets/ball0${ballNum}.png"/>
                        </span>
                        <span class="ball">
                            <img src="./assets/ball0${ballNum}.png" />
                        </span>
                        <span class="ball">
                            <img src="./assets/ball0${ballNum}.png" />
                        </span>
                    </div>
                </div>
                <span class="mbti">${memberData.mbti}</span>
            </div>
            <div class="info-content">
                <p class="subtitle">이름: ${memberData.memberName}</p>
                <p class="description">자기소개: ${memberData.about}</p>
                <p class="goal">내배캠 목표: ${memberData.goal}</p>
            </div>
        </div>
    `;

  return section;
}
