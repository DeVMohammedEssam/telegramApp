const sendPhoneNumber = (e) => {
  e.preventDefault();
  let phone = document.getElementById("phone_number").value;
  socket.emit("sendVerificationMessageEvent", phone);
  return null;
};

const sendVerificationCode = (e) => {
  e.preventDefault();
  let code = document.getElementById("phone_code").value;
  socket.emit("codeCallbackEventResponse", code);
  return null;
};

const generateNumbers = async (e) => {
  e.preventDefault();
  const from = document.getElementById("number_from").value,
    to = document.getElementById("number_to").value,
    generateBtn = document.getElementById("generate_numbers"),
    numberGenerationSuccess = document.getElementById(
      "numberGenerationSuccess"
    ),
    generate_numbers_loader = document.getElementById(
      "generate_numbers_loader"
    );

  numberGenerationSuccess.style.display = "none";
  generate_numbers_loader.style.display = "block";
  generateBtn.disabled = true;

  try {
    const { data } = await axios.post("/api/service/generate-numbers", {
      from,
      to,
    });
    numberGenerationSuccess.style.display = "block";
    console.log(data);
  } catch (error) {
    alert(error.response.data.message);
  }
  generate_numbers_loader.style.display = "none";
  generateBtn.disabled = false;
};

const fetchFilteringOptions = async () => {
  try {
    const response = await fetch("/api/service/generated-numbers");
    const data = await response.json();
    return data.numbers;
  } catch (e) {
    console.log(e.message);
  }
};

const filterSequence = async (e) => {
  e.preventDefault();
  const sequenceId = document.getElementById("filtration_select").value;
  try {
    const { data } = await axios.post("/api/service/filter-sequence", {
      sequenceId,
    });
    console.log(data);
  } catch (error) {
    alert(error.message);
  }
};

const onFilterChange = async (e) => {
  const selectedValue = e.target.value;
  try {
    const { data } = await axios.get(
      `/api/service/get-filter-count?timestamp=${selectedValue}`
    );
    console.log(data.count);
  } catch (error) {
    console.log(error.message);
  }
};
