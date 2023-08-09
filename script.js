// Function to send user message and receive chatbot response

async function sendOption(option) {
  const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: option }),
  });
  const data = await response.json();
  appendMessage("user", option);
  const chatbotResponse = data[0].text;
  try {
    const object = JSON.parse(chatbotResponse);
    console.log({ p: typeof object == "object" });
    appendMessage("bot", object[0]);
    object.forEach((e, ind) => {
      console.log(e);
      if (ind > 0) makeButton(e);
    });
  } catch (e) {
    appendMessage("chatbot", chatbotResponse);
  }
}

function sendMessage() {
  const userMessage = document.getElementById("user-message").value;
  appendMessage("user", userMessage);
  document.getElementById("send-btn").disabled = true;

  // Send user message to Rasa server
  fetch("http://localhost:5005/webhooks/rest/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage }),
  })
    .then((response) => response.json())
    .then((data) => {
      const chatbotResponse = data[0].text;
      try {
        const object = JSON.parse(chatbotResponse);
        appendMessage("bot", object[0]);
        console.log({ p: typeof object == "object" });
        object.forEach((e, idx) => {
          console.log(e);
          if (idx > 0) makeButton(e);
        });
      } catch (e) {
        appendMessage("chatbot", chatbotResponse);
      }
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => {
      document.getElementById("send-btn").disabled = false;
      document.getElementById("user-message").value = "";
    });
}

// Function to append messages to the chat display
function appendMessage(sender, message) {
  const chatDisplay = document.getElementById("chat-messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add(
    sender === "user" ? "user-message" : "chatbot-message"
  );
  messageElement.innerText = message;
  chatDisplay.appendChild(messageElement);
}

function makeButton(text) {
  const chatDisplay = document.getElementById("chat-messages");
  let btnContainer = document.getElementById("option-btn-container");
  if (!btnContainer) btnContainer = document.createElement("div");
  btnContainer.id = "option-btn-container";
  const btn = document.createElement("button");
  btn.innerHTML = text;
  btn.className = "btn-option";
  btn.addEventListener("click", async () => {
    btnContainer.innerHTML = "";
    await sendOption(text);
  });
  btnContainer.appendChild(btn);
  chatDisplay.appendChild(btnContainer);
}

document.getElementById("user-input").addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});
