const socket = io();
window.onload = function () {
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
  socket.on("filteringSequence", ({ generated = 0 }) => {
    document.getElementById("").textContent = generated;
  });
};
