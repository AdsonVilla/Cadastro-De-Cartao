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
    americanexpress: ["#A87B05", "#F9DB5C"],
    elo: ["#E45826", "#E6D5B8"],
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
      regex: /(^3[47][0-9])\d{0,12}$/,
      cardflag: "americanexpress",
    },

    {
      mask: "0000 0000 0000 0000",
      regex:
        /(4011|431274|438935|451416|457393|4576|457631|457632|504175|50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|627780|636297|636368|636369|(6503[1-3])|(6500(3[5-9]|4[0-9]|5[0-1]))|(6504(0[5-9]|1[0-9]|2[0-9]|3[0-9]))|(650(48[5-9]|49[0-9]|50[0-9]|51[1-9]|52[0-9]|53[0-7]))|(6505(4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-8]))|(6507(0[0-9]|1[0-8]))|(6507(2[0-7]))|(650(90[1-9]|91[0-9]|920))|(6516(5[2-9]|6[0-9]|7[0-9]))|(6550(0[0-9]|1[1-9]))|(6550(2[1-9]|3[0-9]|4[0-9]|5[0-8]))|(506(699|77[0-8]|7[1-6][0-9))|(509([0-9][0-9][0-9])))/,
      cardflag: "elo",
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
      ? "NOME E SOBRENOME"
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
