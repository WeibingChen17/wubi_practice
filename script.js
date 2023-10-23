// script.js

import { data } from "./wubi_data.js";

// Create cumulative frequency array once
let cumulativeFreqArray = [];
let successCount = 0;
let failureCount = 0;

function createCumulativeFreqArray(data) {
    const wordArray = Object.entries(data);
    let cumulativeFreq = 0;

    return wordArray.map(([word, { freq }]) => {
        cumulativeFreq += freq;
        return { word, cumulativeFreq };
    });
}

function getRandomWord(data, cumulativeFreqArray) {
    const totalFreq =
        cumulativeFreqArray[cumulativeFreqArray.length - 1].cumulativeFreq;
    const randomNum = Math.floor(Math.random() * totalFreq) + 1;

    let low = 0;
    let high = cumulativeFreqArray.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const midFreq = cumulativeFreqArray[mid].cumulativeFreq;

        if (
            randomNum <= midFreq &&
            (mid === 0 ||
                randomNum > cumulativeFreqArray[mid - 1].cumulativeFreq)
        ) {
            return cumulativeFreqArray[mid].word;
        } else if (randomNum > midFreq) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return null;
}

function loadAndDisplayRandomWord() {
    const randomWordElement = document.getElementById("randomWordDisplay");
    if (cumulativeFreqArray.length === 0) {
        cumulativeFreqArray = createCumulativeFreqArray(data);
    }

    const randomWord = getRandomWord(data, cumulativeFreqArray);

    if (randomWord) {
        randomWordElement.textContent = `${randomWord}`;
    } else {
        randomWordElement.textContent = "Error selecting a random word.";
    }
}

function clearSuccessMessage() {
    const successMessageElement = document.getElementById("successMessage");
    successMessageElement.textContent = "";
}

function checkUserCode() {
    const userInput = document.getElementById("userInput");
    const userInputValue = userInput.value.trim().toLowerCase();
    const randomWord = document.getElementById("randomWordDisplay").textContent;
    const status = document.getElementById("status");

    if (randomWord && data[randomWord]) {
        const codes = data[randomWord].codes;

        if (codes.includes(userInputValue)) {
            successCount += 1;
            status.style.color = "green";
            status.innerHTML = `<span>&#10004; ${randomWord}: ${codes}</span>`;
            loadAndDisplayRandomWord();
        } else {
            failureCount += 1;
            status.style.color = "red";
            status.innerHTML =
                "<span>&#10008;</span> " + colorize(codes, userInputValue);
        }
    }
    userInput.select();
    let successPercentage = 100;
    let failurePercentage = 0;
    const totalAttempts = successCount + failureCount;
    if (totalAttempts !== 0) {
        successPercentage = (successCount / totalAttempts) * 100;
        failurePercentage = (failureCount / totalAttempts) * 100;
    }
    const successBar = document.getElementById("successBar");
    const failureBar = document.getElementById("failureBar");
    successBar.style.width = `${successPercentage}%`;
    failureBar.style.width = `${failurePercentage}%`;
}

function colorize(codes, userInputValue) {
    // Validate input lengths
    if (
        !codes ||
        !userInputValue ||
        codes.length === 0 ||
        userInputValue.length === 0
    ) {
        return `<span style="color: red;">${userInputValue}</span>`;
    }

    // Find the matching code
    var matchingCode = codes.find(
        (code) => code.length === userInputValue.length
    );

    // If no matching code is found, it means the input is not longer enough
    if (!matchingCode) {
        let hint = codes.map((str) => str.length).join(", ");
        return `<span style="color: red;">${userInputValue} : ${hint}</span>`;
    }

    // Compare characters and create the colored result
    var resultHtml = "";
    for (var i = 0; i < userInputValue.length; i++) {
        var textColor = userInputValue[i] === matchingCode[i] ? "green" : "red";
        resultHtml +=
            '<span style="color: ' +
            textColor +
            ';">' +
            userInputValue[i] +
            "</span>";
    }

    return resultHtml;
}

document
    .getElementById("userInput")
    .addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            checkUserCode();
        }
    });

loadAndDisplayRandomWord();
