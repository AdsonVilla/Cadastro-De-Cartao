import "./css/index.css";
import IMask from "imask";

const creditCardBgColor01 = document.querySelector(
  ".cc-bg svg > g g:nth-child(1) path"
);
const creditCardBgColor02 = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path"
);
const creditCardImg = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardFlag(flag) {
  const colors = {
    visa: ["#4C66FF", "#00FFF0"],
    mastercard: ["#E59966", "#FFCC7F"],
    default: ["black", "gray"],
  };
  creditCardBgColor01.setAttribute("fill", colors[flag][0]);
  creditCardBgColor02.setAttribute("fill", colors[flag][1]);
  creditCardImg.setAttribute("src", `cc-${flag}.svg`);
}
globalThis.setCardFlag = setCardFlag;

const securityCode = document.querySelector("#security-code");
const securityCodePattern = {
  mask: "0000",
};
const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
  mask: "MM{/}YY",

  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: "1",
      to: "12",
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardflag: "visa",
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardflag: "mastercard",
    },

    {
      mask: "0000 0000 0000 0000",
      cardflag: "default",
    },
  ],

  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex);
    });
    console.log(foundMask);

    return foundMask;
  },
};

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const addCardButton = document.querySelector("#add-card-button");
addCardButton.addEventListener("click", () => {
  //   e.preventDefault();
  alert("Cartão adicionado!");
});

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
});

const cardHolderInput = document.querySelector("#card-holder");
cardHolderInput.addEventListener("input", () => {
  const creditCardHolder = document.querySelector(".cc-holder .value");

  creditCardHolder.innerText =
    cardHolderInput.value.length === 0
      ? "SEU NOME E SOBRENOME"
      : cardHolderInput.value;
});

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value);
});

function updateSecurityCode(code) {
  const creditCardSecurityCode = document.querySelector(".cc-security .value");
  creditCardSecurityCode.innerText = code.length === 0 ? "123" : code;
}

cardNumberMasked.on("accept", () => {
  const cardFlag = cardNumberMasked.masked.currentMask.cardflag;
  setCardFlag(cardFlag);
  updateCardNumber(cardNumberMasked.value);
});

function updateCardNumber(number) {
  const creditCardNumber = document.querySelector(".cc-info .cc-number");
  creditCardNumber.innerText =
    number.length === 0 ? "1234 5678 9012 3456" : number;
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value);
});

function updateExpirationDate(date) {
  const creditCardExpirationDate = document.querySelector(
    ".cc-expiration .value"
  );
  creditCardExpirationDate.innerText = date.length === 0 ? "MM/YY" : date;
}
