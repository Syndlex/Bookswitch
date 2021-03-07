const { ifError } = require("assert");

var folderTitle1 = "Sidebar_1";
var folderTitle2 = "toolbar_____";
// var folderTitle2 = "Bookmarks Toolbar";

var id1;
var id2;

var searching = browser.bookmarks.search({ title: folderTitle1 });
searching.then(searchSwitchFolder, onRejected);

var searching2 = browser.bookmarks.get(folderTitle2);
searching2.then(searchToolbarFolder, onRejected);

//#region Listener 

browser.commands.onCommand.addListener(function (command) {
  if (command === "toggle-feature") {
    if (id1 && id2) {
      console.log("Toggel Sidebar");
      var gettingSubTree1 = browser.bookmarks.getChildren(id1);
      gettingSubTree1.then(moveToID2, onRejected);
      var gettingSubTree2 = browser.bookmarks.getChildren(id2);
      gettingSubTree2.then(moveToID1, onRejected);
    }
  }
});

function moveToID2(node) {
  for (var child of node) {
    browser.bookmarks.move(child.id, { parentId: id2 });
  }
}

function moveToID1(node) {
  for (var child of node) {
    browser.bookmarks.move(child.id, { parentId: id1 });
  }
}

//#endregion

//#region Folder Create

function searchSwitchFolder(bookmarkItems) {
  // when SwitchFolder not existing create it
  if (bookmarkItems.length) {
    id1 = bookmarkItems[0].id
    console.log(bookmarkItems[0].title + " exist: " + id1);
  } else {
    createFolder(folderTitle1);
  }
}

function searchToolbarFolder(bookmarkItems) {
  // Search toolbar folder
  if (bookmarkItems.length) {
    id2 = bookmarkItems[0].id
    console.log(bookmarkItems[0].title + " exist: " + id1);
  } else {
    console.log("Toobar Not Exist")
  }
}

function createFolder(title) {
  console.log("Folder not found: " + title);
  var createBookmark = browser.bookmarks.create({ title: title })
  createBookmark.then(onCreated);
}

function onCreated(node) {
  console.log("Created: " + node);
  var movingBookmark = browser.bookmarks.move(node.id, { parentId: "unfiled_____" });
  movingBookmark.then(onMoved, onRejected);
}

function onMoved(bookmarkItem) {
  console.log("Moved " + bookmarkItem.index);
}

function onRejected(error) {
  console.log(`An error: ${error}`);
}

// #endregion
