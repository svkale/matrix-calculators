function show_part(event) {
  event.preventDefault();
  $("main>section").css("display", "none");
  $(
    "#" +
      event.target.innerText
        .replaceAll(" ", "_")
        .replaceAll("-", "_")
        .replaceAll("/", "_")
  ).css("display", "revert");
}
precision = 4;
