const form = document.getElementById("search-form");
const input = document.getElementById("word-input");

const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const resultDiv = document.getElementById("result");

const wordEl = document.getElementById("word");
const pronunciationEl = document.getElementById("pronunciation");
const partOfSpeechEl = document.getElementById("part-of-speech");
const definitionEl = document.getElementById("definition");
const exampleEl = document.getElementById("example");
const synonymsEl = document.getElementById("synonyms");
const sourceEl = document.getElementById("source");

const themeToggle = document.getElementById("theme-toggle");

const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

// ---------------- SEARCH ----------------

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const word = input.value.trim();
  if (!word) return;

  showLoading();
  clearError();
  clearResult();

  try {
    const response = await fetch(API_URL + encodeURIComponent(word));

    if (!response.ok) {
      throw new Error("Word not found");
    }

    const data = await response.json();

    displayWord(data[0]);
    input.value = "";

  } catch (err) {
    console.error(err);
    showError("Could not fetch word. Try another.");
  } finally {
    hideLoading();
  }
});

// ---------------- DISPLAY ----------------

function displayWord(data) {
  const meaning = data.meanings?.[0];
  const def = meaning?.definitions?.[0];

  if (!meaning || !def) {
    showError("No data found for this word.");
    return;
  }

  wordEl.textContent = data.word;
  pronunciationEl.textContent =
    data.phonetic || data.phonetics?.[0]?.text || "No pronunciation";

  partOfSpeechEl.textContent = meaning.partOfSpeech || "";

  definitionEl.textContent = def.definition || "";
  exampleEl.textContent = def.example || "No example available";

  const syns = meaning.synonyms?.length
    ? meaning.synonyms
    : def.synonyms || [];

  synonymsEl.textContent =
    syns.length ? syns.join(", ") : "No synonyms";

  sourceEl.textContent = "View Source";
  sourceEl.href = data.sourceUrls?.[0] || "#";

  resultDiv.classList.remove("hidden");
}

// ---------------- LOADING ----------------

function showLoading() {
  loading.classList.remove("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}

// ---------------- ERROR ----------------

function showError(msg) {
  errorDiv.textContent = msg;
  errorDiv.classList.remove("hidden");
}

function clearError() {
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
}

// ---------------- RESULT ----------------

function clearResult() {
  resultDiv.classList.add("hidden");
}

// ---------------- THEME ----------------

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");

  themeToggle.textContent = isDark ? "☀️" : "🌙";
});

// ---------------- INIT ----------------

console.log("App loaded");
