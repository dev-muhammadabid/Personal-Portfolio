//PRELOADER
let loader = document.getElementById("preloader");
window.addEventListener("load", function () {
  loader.style.display = "none";
});

// NAVBAR SCRIPT
const toggleBtn = document.querySelector(".navbar_menu");
const toggleBtnIcon = document.querySelector(".navbar_menu img");
const dropDownMenu = document.querySelector(".dropdown_menu");

toggleBtn.onclick = function () {
  dropDownMenu.classList.toggle("open");
  const isOpen = dropDownMenu.classList.contains("open");
  toggleBtnIcon.classList = isOpen ? ".navbar_menu img" : "#navbar_menu img";
};

// FontFamily CHANGE SCRIPT
const fonts = ["Michroma", "Silkscreen"];
const nameElement = document.getElementById("abii");
let currentIndex = 0;

function changeFont() {
  nameElement.style.fontFamily = fonts[currentIndex];
  currentIndex = (currentIndex + 1) % fonts.length;
}

setInterval(changeFont, 1000);

//SMTP Setup
function sendEmail() {
  Email.send({
    Host: "smtp.elasticemail.com",
    Username: "muhammadabid.dev@gmail.com",
    Password: "1718C80D7F6D3516282BC04D0EC341F5F788",
    To: "personal.abidzaeem@gmail.com",
    From: "muhammadabid.dev@gmail.com",
    Subject: "New Contact Form",
    Body:
      "Name: " +
      document.getElementById("contact_name").value +
      "<br> Email: " +
      document.getElementById("contact_email").value +
      "<br> Phone No.: " +
      document.getElementById("contact_number").value,
  }).then((message) => alert("We Recieved Your Approach"));
}
