/**
 * Saves last watched title for logged-in user (Firestore: users/{uid}/watchHistory).
 */
function saveWatchHistoryEntry(payload) {
  if (typeof firebase === "undefined" || !firebase.apps || !firebase.apps.length) return;
  var user = firebase.auth().currentUser;
  if (!user) return;
  var db = firebase.firestore();
  var id = String(payload.id);
  var isTv = !!payload.isTv;
  var docId = isTv ? "tv_" + id : "movie_" + id;
  db.collection("users")
    .doc(user.uid)
    .collection("watchHistory")
    .doc(docId)
    .set(
      {
        title: payload.title || "",
        mediaId: id,
        mediaType: isTv ? "tv" : "movie",
        season: isTv ? payload.season : null,
        episode: isTv ? payload.episode : null,
        imageUrl: payload.imageUrl || "",
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    )
    .catch(function () {});
}

function loadContinueWatchingRow(containerEl, onEmpty) {
  if (typeof firebase === "undefined" || !firebase.apps || !firebase.apps.length) {
    if (onEmpty) onEmpty();
    return;
  }
  firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
      if (onEmpty) onEmpty();
      return;
    }
    var db = firebase.firestore();
    db.collection("users")
      .doc(user.uid)
      .collection("watchHistory")
      .get()
      .then(function (snap) {
        if (!snap.size) {
          if (onEmpty) onEmpty();
          return;
        }
        var items = [];
        snap.forEach(function (d) {
          items.push({ id: d.id, data: d.data() });
        });
        items.sort(function (a, b) {
          var ta = a.data.updatedAt && a.data.updatedAt.toMillis ? a.data.updatedAt.toMillis() : 0;
          var tb = b.data.updatedAt && b.data.updatedAt.toMillis ? b.data.updatedAt.toMillis() : 0;
          return tb - ta;
        });
        if (!containerEl) return;
        containerEl.innerHTML = "";
        items.slice(0, 12).forEach(function (row) {
          var d = row.data;
          var type = d.mediaType === "tv" ? "tv" : "movie";
          var mid = d.mediaId || row.id.replace(/^(tv|movie)_/, "");
          var href =
            "watch.html?id=" +
            encodeURIComponent(mid) +
            "&type=" +
            encodeURIComponent(type) +
            (type === "tv"
              ? "&ep=" + encodeURIComponent(d.episode || 1) + "&title=" + encodeURIComponent(d.title || "")
              : "&title=" + encodeURIComponent(d.title || ""));
          var a = document.createElement("a");
          a.className = "card";
          a.href = href;
          var posterUrl = d.imageUrl || 'https://via.placeholder.com/300x450?text=Watch';
          a.innerHTML =
            '<div class="poster" style="background:#222 url(\'' + posterUrl + '\') center/cover;"></div>' +
            '<div class="card-body">' +
            '<p class="title">' +
            (d.title || "Untitled") +
            "</p>" +
            '<p class="meta">' +
            (type === "tv" ? "S" + (d.season || 1) + " · E" + (d.episode || 1) : "Movie") +
            "</p></div>";
          containerEl.appendChild(a);
        });
        var section = document.getElementById("continueSection");
        if (section) section.style.display = "block";
      })
      .catch(function () {
        if (onEmpty) onEmpty();
      });
  });
}
