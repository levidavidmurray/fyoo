try {
  const SET_VIEW_POST = "setViewedPost";
  const CHECK_POST = "checkPost";

  const viewedPosts = {};

  function handleMessage(request, sender, sendResponse) {
    console.log("REQUEST:", request);
    console.log(viewedPosts);
    switch (request.type) {
      case SET_VIEW_POST:
        viewedPosts[request.href] = true;
        return sendResponse(true);
      case CHECK_POST:
        return sendResponse(Boolean(viewedPosts[request.href]));
      default:
        return sendResponse(undefined);
    }
  }

  function interceptRequest(details) {
    console.log("Redirecting: ", details);
  }

  browser.runtime.onMessage.addListener(handleMessage);

  browser.webRequest.onBeforeRequest.addListener(interceptRequest, {urls: ["<all_urls>"], types: ["main_frame"]});

} catch (error) {
  console.error("error", error);
}
