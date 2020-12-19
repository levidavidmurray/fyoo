
const postTitleEl = document.querySelector('tr.athing');

console.log("HELLO!");

if (postTitleEl) {
  if (postTitleEl.id) {
    browser.runtime.sendMessage({type: "checkPost", postId: postTitleEl.id})
      .then((response) => {
        console.log(`didView ${postTitleEl.id}:`, response);
      });
  }
}
