// ==============================
// YOUR RAPIDAPI KEY
// ==============================
const RAPIDAPI_KEY = "28a86e13demsh1aab9c3c2f7b22bp11dd2djsn63c38bca638e";

let pendingDownloadUrl = null;

// ==============================
// MAIN FUNCTION
// ==============================
async function handleDownload() {

  const url = document.getElementById("urlInput").value.trim();
  const resultBox = document.getElementById("result");
  const loadingMsg = document.getElementById("loadingMsg");
  const bottomAd = document.getElementById("bottomAd");

  resultBox.classList.add("hidden");
  bottomAd.classList.add("hidden");

  if (!url) {
    alert("⚠️ Please paste an Instagram link first!");
    return;
  }

  if (!url.includes("instagram.com")) {
    alert("⚠️ Please enter a valid Instagram link.");
    return;
  }

  loadingMsg.classList.remove("hidden");

  try {
    // CORRECT API ENDPOINT FOR YOUR API
    const response = await fetch(
      `https://instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com/convert?url=${encodeURIComponent(url)}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": "instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com",
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    loadingMsg.classList.add("hidden");

    // Log to see what the API returns
    console.log("API Response:", data);

    // Try to find the video URL in the response
    const videoUrl =
      data?.video ||
      data?.url ||
      data?.download_url ||
      data?.media?.[0]?.url ||
      data?.result?.video ||
      data?.data?.video_url ||
      null;

    if (videoUrl) {
      pendingDownloadUrl = videoUrl;
      showRewardedAd();
    } else {
      resultBox.innerHTML = `
        <p style="color:#ff6b6b; font-size:1rem;">
          ❌ Could not fetch video.<br/>
          Make sure the Instagram post is <strong>public</strong> and the link is correct.
        </p>
        <p style="color:#555; font-size:0.8rem; margin-top:10px;">
          Debug info: ${JSON.stringify(data)}
        </p>
      `;
      resultBox.classList.remove("hidden");
    }

  } catch (err) {
    loadingMsg.classList.add("hidden");
    resultBox.innerHTML = `<p style="color:#ff6b6b;">❌ Something went wrong. Please try again.</p>`;
    resultBox.classList.remove("hidden");
    console.error("API Error:", err);
  }
}

// ==============================
// REWARDED AD MODAL
// ==============================
function showRewardedAd() {
  const modal = document.getElementById("rewardModal");
  const skipBtn = document.getElementById("skipBtn");
  const countdown = document.getElementById("countdown");
  const adTimer = document.getElementById("adTimer");

  modal.classList.remove("hidden");
  skipBtn.classList.add("hidden");
  adTimer.style.display = "block";

  let seconds = 15;
  countdown.textContent = seconds;

  const timer = setInterval(() => {
    seconds--;
    countdown.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(timer);
      adTimer.textContent = "✅ Ad finished!";
      skipBtn.classList.remove("hidden");
    }
  }, 1000);
}

// ==============================
// UNLOCK DOWNLOAD
// ==============================
function unlockDownload() {
  const modal = document.getElementById("rewardModal");
  const resultBox = document.getElementById("result");
  const bottomAd = document.getElementById("bottomAd");

  modal.classList.add("hidden");

  resultBox.innerHTML = `
    <p style="color:#aaa; margin-bottom:14px;">✅ Your video is ready!</p>
    <video controls src="${pendingDownloadUrl}"></video>
    <br/>
    <a class="download-btn" href="${pendingDownloadUrl}" download="reel.mp4" target="_blank">
      ⬇️ Download Video
    </a>
    <p style="color:#555; font-size:0.8rem; margin-top:14px;">
      If download doesn't start, right click the video → Save Video As
    </p>
  `;

  resultBox.classList.remove("hidden");
  bottomAd.classList.remove("hidden");
  resultBox.scrollIntoView({ behavior: "smooth" });
}

// ==============================
// ENTER KEY SUPPORT
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("urlInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleDownload();
  });
});
