
// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
    .then(function (registration) { })
    .catch(function (error) {
      console.log('Register Failed:', error);
    });
}
else {
  console.log('Service workers are not supported.');
}

// Load posts from the web
window.addEventListener('load', () => {
  console.log('Online:', navigator.onLine);
  if (navigator.onLine) {
    loadPosts();
  }
  else {
    renderOffline();
  }
});

/**
 * Load posts from the web
 */
function loadPosts() {
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(json => renderPost(json));
}

/**
 * Render loaded posts
 */
function renderPost(posts) {
  const output = document.getElementById('post-output');
  output.innerHTML = '';

  const topPosts = posts.slice(0, 10);
  topPosts.forEach(post => {
    output.innerHTML += `
      <div class='post-item'>
        <h3>${post.title}</h3>
        <div class='text'>${post.body}</div>
      </div>
    `;
  });
}

/**
 * Display an message when offline
 */
function renderOffline() {
  const output = document.getElementById('post-output');
  output.innerHTML = `
    <div class='offline-message'>
      <h3>No internet connection</h3>
      <p>Please, check your connection and try again later.</p>
    </div>
  `;
}

/**
 * Triggered when the connection is lost
 */
window.addEventListener("offline", function () {
  // renderOffline();
});

/**
 * Triggered when the connection is restored
 */
window.addEventListener("online", function () {
  loadPosts();
});

