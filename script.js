
const mortgageForm = document.querySelector("#mortgage-form");

const clearButton = document.querySelector("#clear-button");

const amountInput = document.querySelector("#mortgage-amount");
const termInput = document.querySelector("#mortgage-term");
const rateInput = document.querySelector("#interest-rate");

const resultsEmpty = document.querySelector("#results-empty");
const resultsCompleted = document.querySelector("#results-completed");

const monthlyPaymentOutput = document.querySelector("#monthly-payment");
const totalPaymentOutput = document.querySelector("#total-payment");


const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});



function showError(field, message) {

  const group = field.closest(".form-group");

  group.classList.add("has-error");

  const error = group.querySelector(".error-message");

  error.textContent = message;

  field.setAttribute("aria-invalid", "true");

}


function clearError(field) {

  const group = field.closest(".form-group");

  group.classList.remove("has-error");

  const error = group.querySelector(".error-message");

  if (error) {
    error.textContent = "";
  }

  field.removeAttribute("aria-invalid");

}


function clearAllErrors() {

  [amountInput, termInput, rateInput].forEach(clearError);

  document.querySelector("#type-error").textContent = "";

  document.querySelector(".mortgage-type-group")
    .classList.remove("has-error");

  document.querySelectorAll('input[name="mortgage-type"]')
    .forEach((radio) => {
      radio.removeAttribute("aria-invalid");
    });

}


function getMortgageAmount() {

  return Number(
    amountInput.value.replace(/,/g, "").trim()
  );

}


function validateForm() {

  clearAllErrors();

  let isValid = true;

  const amount = getMortgageAmount();
  const term = Number(termInput.value);
  const rate = Number(rateInput.value);

  const selectedType = document.querySelector(
    'input[name="mortgage-type"]:checked'
  );


  if (!amountInput.value.trim()) {

    showError(amountInput, "This field is required");

    isValid = false;

  } else if (!Number.isFinite(amount) || amount <= 0) {

    showError(amountInput, "Enter a valid mortgage amount");

    isValid = false;

  }


  if (!termInput.value.trim()) {

    showError(termInput, "This field is required");

    isValid = false;

  } else if (!Number.isInteger(term) || term <= 0) {

    showError(termInput, "Enter a valid number of years");

    isValid = false;

  }



  if (!rateInput.value.trim()) {

    showError(rateInput, "This field is required");

    isValid = false;

  } else if (!Number.isFinite(rate) || rate < 0) {

    showError(rateInput, "Enter a valid interest rate");

    isValid = false;

  }



  if (!selectedType) {

    const typeGroup = document.querySelector(
      ".mortgage-type-group"
    );

    typeGroup.classList.add("has-error");

    document.querySelector("#type-error").textContent =
      "This field is required";

    document.querySelectorAll('input[name="mortgage-type"]')
      .forEach((radio) => {
        radio.setAttribute("aria-invalid", "true");
      });

    isValid = false;

  }

  return isValid;

}


function calculateMortgage(amount, annualRate, years, mortgageType) {

  const numberOfPayments = years * 12;

  const monthlyRate = annualRate / 100 / 12;

  let monthlyPayment;




  if (mortgageType === "interest-only") {

    monthlyPayment = amount * monthlyRate;

  }


  else if (monthlyRate === 0) {

    monthlyPayment = amount / numberOfPayments;

  }


  else {

    const rateFactor = Math.pow(
      1 + monthlyRate,
      numberOfPayments
    );

    monthlyPayment =
      amount *
      (monthlyRate * rateFactor) /
      (rateFactor - 1);

  }



  const totalPayment = mortgageType === "interest-only"

    ? (monthlyPayment * numberOfPayments) + amount

    : monthlyPayment * numberOfPayments;


  return {
    monthlyPayment,
    totalPayment
  };

}


mortgageForm.addEventListener("submit", (event) => {

  event.preventDefault();


  if (!validateForm()) {

    const firstInvalidField = mortgageForm.querySelector(
      '[aria-invalid="true"]'
    );

    if (firstInvalidField) {
      firstInvalidField.focus();
    }

    return;

  }


  const amount = getMortgageAmount();

  const term = Number(termInput.value);

  const rate = Number(rateInput.value);

  const mortgageType = document.querySelector(
    'input[name="mortgage-type"]:checked'
  ).value;


  const result = calculateMortgage(
    amount,
    rate,
    term,
    mortgageType
  );


  monthlyPaymentOutput.textContent =
    currencyFormatter.format(result.monthlyPayment);

  totalPaymentOutput.textContent =
    currencyFormatter.format(result.totalPayment);


  resultsEmpty.hidden = true;

  resultsCompleted.hidden = false;

});


clearButton.addEventListener("click", () => {

  mortgageForm.reset();

  clearAllErrors();

  resultsCompleted.hidden = true;

  resultsEmpty.hidden = false;

  amountInput.focus();

});



[amountInput, termInput, rateInput].forEach((field) => {

  field.addEventListener("input", () => {

    clearError(field);

  });

});


document.querySelectorAll('input[name="mortgage-type"]')
  .forEach((radio) => {

    radio.addEventListener("change", () => {

      const typeGroup = document.querySelector(
        ".mortgage-type-group"
      );

      typeGroup.classList.remove("has-error");

      document.querySelector("#type-error").textContent = "";

      document.querySelectorAll('input[name="mortgage-type"]')
        .forEach((item) => {
          item.removeAttribute("aria-invalid");
        });

    });

  });
