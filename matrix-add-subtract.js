matrix_add_subtract_o1 = 3;
matrix_add_subtract_o2 = 3;
function matrix_add_subtract_update_order(a, b) {
  if (a != -1) matrix_add_subtract_o1 = parseInt(a);
  if (b != -1) matrix_add_subtract_o2 = parseInt(b);
  let operation =
    document.getElementById("matrix_operation").value == "Addition" ? "+" : "-";

  document.getElementById("order_add_subtract").innerHTML =
    matrix_add_subtract_o1 + " &times; " + matrix_add_subtract_o2;
  document.getElementById("inputs_add_subtract_1").innerHTML = "";
  document.getElementById("inputs_add_subtract_2").innerHTML = "";

  document.getElementById("add_subtract_inputs").innerHTML =
    "<span style='font-size: " +
    (matrix_add_subtract_o1 + 1) +
    "em;'>[</span>" +
    document.getElementById("inputs_add_subtract_1").outerHTML +
    "<span style='font-size: " +
    (matrix_add_subtract_o1 + 1) +
    "em;'>]</span> <span style='font-size: " +
    (matrix_add_subtract_o1 + 1) +
    "em;'>" +
    operation +
    "</span> <span style='font-size: " +
    (matrix_add_subtract_o1 + 1) +
    "em;'>[</span>" +
    document.getElementById("inputs_add_subtract_2").outerHTML +
    "<span style='font-size: " +
    (matrix_add_subtract_o1 + 1) +
    "em;'>]</span>";

  for (let i = 1; i <= matrix_add_subtract_o1; i++) {
    for (let j = 1; j <= matrix_add_subtract_o2; j++) {
      document
        .getElementById("inputs_add_subtract_1")
        .insertAdjacentHTML(
          "beforeend",
          '<input type="number" step="any" name="a_' +
            i +
            "_" +
            j +
            '" required> '
        );
      document
        .getElementById("inputs_add_subtract_2")
        .insertAdjacentHTML(
          "beforeend",
          '<input type="number" step="any" name="b_' +
            i +
            "_" +
            j +
            '" required> '
        );
    }
    document
      .getElementById("inputs_add_subtract_1")
      .insertAdjacentHTML("beforeend", "<br>");
    document
      .getElementById("inputs_add_subtract_2")
      .insertAdjacentHTML("beforeend", "<br>");
  }
}
matrix_add_subtract_update_order(3, 3);

function matrix_add_subtract(form) {
  document.getElementById("solution").innerHTML = "";
  let ans = [];
  let ans_str =
    "<div style='text-align: center;'>The result is:-</div><article class='math_equ' style='justify-content: center;'><span style='font-size: " +
    (matrix_add_subtract_o1 + 1) +
    "em;'>[</span><span><br>";
  let aos = form.operation.value == "Addition" ? 1 : -1;
  for (let i = 0; i < matrix_add_subtract_o2; i++) {
    let tmp = [];
    for (let j = 0; j < matrix_add_subtract_o1; j++) {
      ans_str +=
        (
          parseFloat(form["a_" + (j + 1) + "_" + (i + 1)].value) +
          aos * parseFloat(form["b_" + (j + 1) + "_" + (i + 1)].value)
        ).toFixed(precision) + "<br>";
    }
    ans.push(tmp);
    ans_str += "</span>&nbsp;&nbsp;<span><br>";
  }
  ans_str +=
    "</span><span style='font-size: " +
    (matrix_add_subtract_o1 + 1) +
    "em;'>]</span></article>";
  document.getElementById("solution").insertAdjacentHTML("beforeend", ans_str);
  document.getElementById("solution").style.display = "revert";
  return;
}
