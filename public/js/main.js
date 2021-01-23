window.onload = async function () {
  const filterSelectBox = document.getElementById("filtration_select");
  const options = await fetchFilteringOptions();
  const analysis = await fetchAnalysis();
  console.log(analysis);
  document.getElementById("token-count").textContent = analysis.tokens;
  document.getElementById("used-numbers-count").textContent =
    analysis.usedNumbers;
  document.getElementById("unused-numbers-count").textContent =
    analysis.unUsedNumbers;
  document.getElementById("telegram-users-count").textContent = analysis.users;

  if (filterSelectBox) {
    // fetch data
    if (options instanceof Array) {
      options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.textContent = `${option.numberFrom} => ${option.numberTo}`;
        optionElement.value = option._id;
        optionElement.disabled = option.isUsed;
        filterSelectBox.append(optionElement);
      });
    }
  }
};
