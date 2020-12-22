const MODAL_TITLE = 'It appears you haven\'t clicked the link';
const MODAL_OVERRIDE = 'I\'d rather read the comments';
const MODAL_TEXT = 'Make sure to read or view the submitted link before reading others\' opinions, and/or sharing your own. It\'s better for your own self-development, and it also helps to create a higher quality discussion of the topic.';


const fyoo = {

  init() {
    const itemList = document.querySelector('table.itemlist');

    if (itemList) {
      // Add anchor listener to all posts: ["news", "newest", "front", "show"]
      for (const item of document.querySelectorAll('tr.athing')) {
        this.handlePostItem(item);
      }
    } else {
      // Add anchor listener to specific post
      const item = document.querySelector('table.fatitem tr.athing');

      console.log(item);

      if (item) {
        const anchorTag = this.getItemAnchorTag(item);
        this.checkPost(anchorTag.href)
          .then((didView) => {
            if (!didView && this.isExternalUrl(anchorTag.href)) {
              // Add anchor listener, blur comments and form, present modal with link to submission, override option
              this.addAnchorListener(anchorTag);

              document.querySelector('table.fatitem form').classList.add('blur');
              document.querySelector('.comment-tree').classList.add('blur');
              this.presentModal(item);
            } else {
              // If option enabled—blur comments & show form
            }
          });
      }
    }
  },

  handlePostItem(item) {
    let isHandled = false;
    const anchorTag = this.getItemAnchorTag(item);

    if (!anchorTag) {
      console.error("No storylink anchor tag found in item");
    } else {
      isHandled = this.isExternalUrl(anchorTag.href);
      if (isHandled) {
        this.addAnchorListener(anchorTag);
      }
    }
    return isHandled;
  },

  presentModal(item) {
    try {
      const existingModal = document.querySelector('#fyoo-modal');

      if (existingModal) {
        document.body.removeChild(existingModal);
      }

      const anchorTag = this.getItemAnchorTag(item)

      const modalDiv = document.createElement("div");
      modalDiv.id = 'fyoo-modal';

      const stopIcon = document.createElement('img');
      stopIcon.src = browser.runtime.getURL("icons/stop.svg");

      const title = document.createElement('h5');
      title.appendChild(document.createTextNode(MODAL_TITLE));

      const description = document.createElement('p');
      description.appendChild(document.createTextNode(MODAL_TEXT));

      const postLink = document.createElement('a');
      postLink.href = anchorTag.href;
      postLink.classList.add('post-link');
      postLink.appendChild(document.createTextNode(anchorTag.innerText));
      this.addAnchorListener(postLink);

      const overrideLink = document.createElement('a');
      overrideLink.appendChild(document.createTextNode(MODAL_OVERRIDE));
      overrideLink.src = '#';
      overrideLink.classList.add('override-link');
      overrideLink.onclick = () => {
        this.setViewedPost(anchorTag.href);
        window.location.reload();
      }

      modalDiv.appendChild(stopIcon);
      modalDiv.appendChild(title);
      modalDiv.appendChild(description);
      modalDiv.appendChild(postLink);
      modalDiv.appendChild(overrideLink);

      document.body.appendChild(modalDiv);

    } catch (error) {
      console.error(error);
    }
  },

  addAnchorListener(anchorTag) {
    anchorTag.onclick = () => this.setViewedPost(anchorTag.href);
  },

  getItemAnchorTag(item) {
    return item.querySelector('a.storylink');
  },

  getItemHref(item) {
    const anchorTag = this.getItemAnchorTag(item)

    if (anchorTag) {
      return anchorTag.href;
    }
  },

  getDomainFromUrl(url) {
    const match = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    return match && match[1];
  },

  isExternalUrl(url) {
    return this.getDomainFromUrl(url) != "news.ycombinator.com";
  },

  // Background communication

  checkPost(href) {
    console.log(`Checking: ${href}`);
    return this.sendMessage({type: "checkPost", href});
  },

  setViewedPost(href) {
    return this.sendMessage({type: "setViewedPost", href});
  },

  sendMessage(message) {
    return browser.runtime.sendMessage(message);
  },

}

// init fyoo extension
fyoo.init();

