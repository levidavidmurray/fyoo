const MODAL_TITLE = 'It appears you didn\'t view the submission';
const MODAL_TEXT = 'Make sure to read or view the submitted link before sharing your opinion. It\'s better for your own self-development, and helps to drive a higher quality discussion surrounding the topic.';

function sendMessage(message) {
  browser.runtime.sendMessage(message);
}

function handlePostItem(item) {
  const anchorTag = item.querySelector('a.storylink');
  console.log("handlePostItem");

  if (!anchorTag) {
    console.error("No storylink anchor tag found in item");
    return false;
  } else {
    const isExternalLink = !anchorTag.attributes.href.value.match(/^item\?id.*/);
    if (isExternalLink) {
      addAnchorListener(anchorTag, item.id);
    }
    return isExternalLink;
  }
}

function addAnchorListener(anchorTag, postId) {
  anchorTag.onclick = () => sendMessage({type: "setViewedPost", postId});
}

function presentModal(item) {
  console.log("PRESENT MODAL!");
  try {
    const existingModal = document.querySelector('#opinion-modal');

    if (existingModal) {
      document.body.removeChild(existingModal);
    }

    const anchorTag = item.querySelector('a.storylink');

    const modalDiv = document.createElement("div");
    modalDiv.id = 'opinion-modal';

    const title = document.createElement('h5');
    title.appendChild(document.createTextNode(MODAL_TITLE));
    const description = document.createElement('p');
    description.appendChild(document.createTextNode(MODAL_TEXT));
    const postLink = document.createElement('a');
    postLink.href = anchorTag.href;
    postLink.appendChild(document.createTextNode(anchorTag.innerText));
    addAnchorListener(postLink, item.id);

    modalDiv.appendChild(title);
    modalDiv.appendChild(description);
    modalDiv.appendChild(postLink);

    document.body.appendChild(modalDiv);

    console.log(modalDiv);
  } catch (error) {
    console.error(error);
  }
}

const itemList = document.querySelector('table.itemlist');

if (itemList) {
  // Add anchor listener to all posts: ["news", "newest", "show"]
  for (const item of document.querySelectorAll('tr.athing')) {
    handlePostItem(item);
  }
} else {
  // Add anchor listener to specific post
  const itemEl = document.querySelector('table.fatitem tr.athing');

  if (itemEl) {
    browser.runtime.sendMessage({type: "checkPost", postId: itemEl.id})
      .then((didView) => {
        console.log(`didView ${itemEl.id}:`, didView);
        if (!didView && handlePostItem(itemEl)) {
          // Add anchor listener, blur comments and form, present modal with link to submission, override option
          document.querySelector('table.fatitem form').classList.add('improbable-opinion');
          document.querySelector('.comment-tree').classList.add('improbable-opinion');
          presentModal(itemEl);
        } else {
          // If option enabled—blur comments & show form
        }
      });
  }
}

