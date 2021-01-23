window.onload = async function () {
  const filterSelectBox = document.getElementById("filtration_select");
  if (filterSelectBox) {
    const options = await fetchFilteringOptions();
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
