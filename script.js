// ==============================
// PASTE YOUR RAPIDAPI KEY BELOW
// ==============================
const RAPIDAPI_KEY = "28a86e13demsh1aab9c3c2f7b22bp11dd2djsn63c38bca638e";

// This stores the video URL temporarily
let pendingDownloadUrl = null;

// ==============================
// MAIN FUNCTION - runs when user clicks Download
// ==============================
async function handleDownload() {

  // Get what the user typed in the input box
  const url = document.getElementById("urlInput").value.trim();
  const resultBox = document.getElementById("result");
  const loadingMsg = document.getElementById("loadingMsg");
  const bottomAd = document.getElementById("bottomAd");

  // Hide previous results
  resultBox.classList.add("hidden");
  bottomAd.classList.add("hidden");

  // Basic checks
  if (!url) {
    alert("⚠️ Please paste an Instagram link first!");
    return;
  }

  if (!url.includes("instagram.com")) {
    alert("⚠️ Please enter a valid Instagram link.");
    return;
  }

  // Show loading message
  loadingMsg.classList.remove("hidden");

  try {
    // Call the RapidAPI Instagram Downloader
    const response = await fetch(
      `https://instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com/get-info-rapidapi?url=${encodeURIComponent(url)}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com"
        }
      }
    );

    const data = await response.json();

    // Hide loading
    loadingMsg.classList.add("hidden");

    // Check if we got a video URL back
    if (data && data.video) {
      pendingDownloadUrl = data.video;
      showRewardedAd(); // Show the ad modal before giving download
    } else {
      resultBox.innerHTML = `
        <p style="color:#ff6b6b; font-size:1rem;">
          ❌ Could not fetch video.<br/>
          Make sure the Instagram post is <strong>public</strong> and the link is correct.
        </p>
      `;
      resultBox.classList.remove("hidden");
    }

  } catch (err) {
    loadingMsg.classList.add("hidden");
    resultBox.innerHTML = `
      <p style="color:#ff6b6b;">
        ❌ Something went wrong. Please try again.
      </p>
    `;
    resultBox.classList.remove("hidden");
    console.error("API Error:", err);
  }
}

// ==============================
// SHOW REWARDED AD MODAL
// ==============================
function showRewardedAd() {
  const modal = document.getElementById("rewardModal");
  const skipBtn = document.getElementById("skipBtn");
  const countdown = document.getElementById("countdown");
  const adTimer = document.getElementById("adTimer");

  // Show modal
  modal.classList.remove("hidden");
  skipBtn.classList.add("hidden");
  adTimer.style.display = "block";

  // Countdown from 15 seconds
  let seconds = 15;
  countdown.textContent = seconds;

  const timer = setInterval(() => {
    seconds--;
    countdown.textContent = seconds;

    if (seconds <= 0) {
      clearInterval(timer);
      adTimer.textContent = "✅ Ad finished!";
      skipBtn.classList.remove("hidden"); // Show the download button
    }
  }, 1000);
}

// ==============================
// UNLOCK DOWNLOAD AFTER AD
// ==============================
function unlockDownload() {
  const modal = document.getElementById("rewardModal");
  const resultBox = document.getElementById("result");
  const bottomAd = document.getElementById("bottomAd");

  // Hide modal
  modal.classList.add("hidden");

  // Show video preview and download button
  resultBox.innerHTML = `
    <p style="color:#aaa; margin-bottom:14px;">✅ Your video is ready!</p>
    <video controls src="${pendingDownloadUrl}"></video>
    <br/>
    <a class="download-btn" href="${pendingDownloadUrl}" download="reel.mp4" target="_blank">
      ⬇️ Download Video
    </a>
    <p style="color:#555; font-size:0.8rem; margin-top:14px;">
      If the download doesn't start, right click the video → Save Video As
    </p>
  `;

  resultBox.classList.remove("hidden");
  bottomAd.classList.remove("hidden");

  // Scroll down to result
  resultBox.scrollIntoView({ behavior: "smooth" });
}

// ==============================
// ALLOW PRESSING ENTER KEY TO DOWNLOAD
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("urlInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleDownload();
    }
  });
});