matrix_multiplication_o1 = 3;
matrix_multiplication_o2 = 3;
matrix_multiplication_o3 = 3;
function matrix_multiplication_update_order(a, b, c) {
  if (a != -1) matrix_multiplication_o1 = parseInt(a);
  if (b != -1) matrix_multiplication_o2 = parseInt(b);
  if (c != -1) matrix_multiplication_o3 = parseInt(c);
  document.getElementById("order_multiplication").innerHTML =
    matrix_multiplication_o1 +
    " &times; " +
    matrix_multiplication_o2 +
    " and " +
    matrix_multiplication_o2 +
    " &times; " +
    matrix_multiplication_o3;
  document.getElementById("inputs_multiplication_1").innerHTML = "";
  document.getElementById("inputs_multiplication_2").innerHTML = "";
  document.getElementById("multiplication_inputs").innerHTML =
    "<span style='font-size: " +
    matrix_multiplication_o1 +
    "em;'>[</span>" +
    document.getElementById("inputs_multiplication_1").outerHTML +
    "<span style='font-size: " +
    matrix_multiplication_o1 +
    "em;'>]</span> <span style='font-size: " +
    (matrix_multiplication_o1 + matrix_multiplication_o2) / 2 +
    "em;'>&times;</span> <span style='font-size: " +
    matrix_multiplication_o2 +
    "em;'>[</span>" +
    document.getElementById("inputs_multiplication_2").outerHTML +
    "<span style='font-size: " +
    matrix_multiplication_o2 +
    "em;'>]</span>";
  for (let i = 1; i <= matrix_multiplication_o1; i++) {
    for (let j = 1; j <= matrix_multiplication_o2; j++) {
      document
        .getElementById("inputs_multiplication_1")
        .insertAdjacentHTML(
          "beforeend",
          '<input type="number" step="any" name="a_' +
            i +
            "_" +
            j +
            '" required> '
        );
    }
    document
      .getElementById("inputs_multiplication_1")
      .insertAdjacentHTML("beforeend", "<br>");
  }
  for (let i = 1; i <= matrix_multiplication_o2; i++) {
    for (let j = 1; j <= matrix_multiplication_o3; j++) {
      document
        .getElementById("inputs_multiplication_2")
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
      .getElementById("inputs_multiplication_2")
      .insertAdjacentHTML("beforeend", "<br>");
  }
}
matrix_multiplication_update_order(3, 3, 3);
function matrix_multiplication_solve(form) {
  document.getElementById("solution").innerHTML = "";
  let ans = [];
  let ans_str =
    "<div style='text-align: center;'>Calculations:- </div><article class='math_equ'><span style='font-size: " +
    (matrix_multiplication_o1 + 1) +
    "em;'>[</span><span><br>";
  for (let i = 0; i < matrix_multiplication_o3; i++) {
    let tmp = [];
    for (let j = 0; j < matrix_multiplication_o1; j++) {
      let cell_value = 0;
      for (let k = 0; k < matrix_multiplication_o2; k++) {
        let v1 = parseFloat(form["a_" + (j + 1) + "_" + (k + 1)].value),
          v2 = parseFloat(form["b_" + (k + 1) + "_" + (i + 1)].value);
        cell_value += v1 * v2;
        ans_str += v1.toFixed(precision) + "&times;" + v2.toFixed(precision);
        ans_str += k == matrix_multiplication_o2 - 1 ? "<br>" : "+";
      }
      tmp.push(cell_value);
    }
    ans.push(tmp);
    ans_str += "</span>&nbsp;&nbsp;<span><br>";
  }
  ans_str +=
    "</span><span style='font-size: " +
    (matrix_multiplication_o1 + 1) +
    "em;'>]</span></article><br><div style='text-align: center;'>The result of the multiplication is:- </div><article class='math_equ' style='justify-content: center;'><span style='font-size: " +
    (matrix_multiplication_o1 + 1) +
    "em;'>[</span><span><br>";
  for (let i = 0; i < matrix_multiplication_o3; i++) {
    for (let j = 0; j < matrix_multiplication_o1; j++) {
      ans_str += ans[i][j].toFixed(precision) + "<br>";
    }
    ans_str += "</span>&nbsp;<span><br>";
  }
  document
    .getElementById("solution")
    .insertAdjacentHTML(
      "beforeend",
      ans_str +
        "</span><span style='font-size: " +
        (matrix_multiplication_o1 + 1) +
        "em;'>]</span></article><br>"
    );
  document.getElementById("solution").style.display = "revert";
  return;
}
