const socket = io();
const id = cuid();
localStorage.setItem("socketId", id);
socket.emit("join", id);
socket.on("sendVerificationMessageEventStatus", (state) => {
  if (state) {
    console.log("code was sent");
    document.getElementById("send_code").disabled = true;
  }
});
socket.on("tokenResponse", ({ state, token }) => {
  if (state) {
    console.log({ token });
    document.getElementById("token_alert").style.display = "block";
    document.getElementById("token_alert").innerText = `token ${token}`;
    document.getElementById("verify").disabled = true;
  }
});

// on filtering
socket.on("filteringSequence", (generated) => {
  console.log(generated);
  document.getElementById("generated-count").textContent = generated;
});

socket.on("filtrationFinished", () => {
  const filterBtn = document.getElementById("filter-button");
  const filterSuccess = document.getElementById("filter-alert-success");
  filterBtn.textContent = "filter";
  filterBtn.disabled = false;
  filterSuccess.style.display = "block";
});
