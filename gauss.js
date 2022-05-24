gauss_bs_array = [];
function gauss_bs_solve() {
  let step = 1;
  for (let k = 0; k < gauss_bs_array.length; k++) {
    i_max = gauss_find_pivot(gauss_bs_array, k);
    if (gauss_bs_array[i_max][k] == 0) return false;
    array_2d_swap_rows(gauss_bs_array, k, i_max);
    gauss_step(gauss_bs_array, "Finding pivot for row no. " + (k + 1), step++);
    for (let i = k + 1; i < gauss_bs_array.length; i++) {
      let c = gauss_bs_array[i][k] / gauss_bs_array[k][k];
      for (let j = k + 1; j < gauss_bs_array[0].length; j++) {
        gauss_bs_array[i][j] = gauss_bs_array[i][j] - gauss_bs_array[k][j] * c;
      }
      gauss_bs_array[i][k] = 0;
      gauss_step(
        gauss_bs_array,
        "Applying R" +
          (i + 1) +
          "=>R<sub>" +
          (i + 1) +
          "</sub>-R<sub>" +
          (k + 1) +
          "</sub>*" +
          c.toFixed(precision),
        step++
      );
    }
  }
  gauss_step(
    gauss_bs_array,
    "So, the final equation can be written as: ",
    step++,
    true
  );
  return gauss_get_ans(gauss_bs_array);
}

function gauss_find_pivot(array_2d, col_no) {
  let row_max = col_no;
  for (let i = col_no + 1; i < array_2d.length; i++) {
    if (Math.abs(array_2d[i][col_no]) > Math.abs(array_2d[row_max][col_no]))
      row_max = i;
  }
  return row_max;
}

function gauss_get_ans(gauss_array) {
  let ans = [];
  for (let i = gauss_array.length - 1; i >= 0; i--) {
    gauss_array[i].push(gauss_array[i][gauss_array.length]);
  }
  for (let i = gauss_array.length - 1; i >= 0; i--) {
    let x = gauss_array[i][gauss_array.length] / gauss_array[i][i];
    for (let j = i - 1; j >= 0; j--) {
      gauss_array[j][gauss_array.length] -= x * gauss_array[j][i];
    }
    ans[i] = x;
  }
  return ans;
}

function gauss_bs_update_order(o) {
  document.getElementById("order").innerHTML = o + " &times; " + o;
  document.getElementById("inputs").innerHTML = "";
  n = parseInt(o);
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j < n; j++) {
      document
        .getElementById("inputs")
        .insertAdjacentHTML(
          "beforeend",
          '<input type="number" step="any" name="a_' +
            i +
            "_" +
            j +
            '" required> X<sub>' +
            j +
            "</sub> + "
        );
    }
    document
      .getElementById("inputs")
      .insertAdjacentHTML(
        "beforeend",
        '<input type="number" step="any" name="a_' +
          i +
          "_" +
          n +
          '" required> X<sub>' +
          n +
          '</sub> = <input type="number" step="any" name="b_' +
          i +
          '" required><br>'
      );
  }
}
gauss_bs_update_order(3);

function gauss_step(gauss_array, step_desc, step) {
  step_str =
    "<div style='padding-bottom: 4px;padding-top: 6px;'>Step " +
    step +
    ": (" +
    step_desc +
    ")</div><article class='math_equ'>";
  step_str +=
    "<span style='font-size: " +
    (gauss_array.length + 1) +
    "em;'>[</span><span><br>";
  for (let i = 0; i < gauss_array.length; i++) {
    for (let j = 0; j < gauss_array.length; j++) {
      step_str += gauss_array[j][i].toFixed(precision) + "<br>";
    }
    step_str += "</span>&nbsp;<span><br>";
  }
  if (!arguments[3]) {
    step_str +=
      "</span><span style='font-size: " +
      (gauss_array.length + 1) +
      "em;'>]=&gt;[</span><span><br>";
  } else {
    step_str +=
      "</span><span style='font-size: " +
      (gauss_array.length + 1) +
      "em;'>][</span><span><br>";
    for (let j = 0; j < gauss_array.length; j++) {
      step_str += "<span>X<sub>" + (j + 1) + "</sub></span><br>";
    }
    step_str +=
      "</span><span style='font-size: " +
      (gauss_array.length + 1) +
      "em;'>]=[</span><span><br>";
  }
  for (let i = 0; i < gauss_array.length; i++) {
    step_str +=
      "&nbsp;" +
      gauss_array[i][gauss_array[0].length - 1].toFixed(precision).toString() +
      "<br>";
  }
  step++;
  document
    .getElementById("solution")
    .insertAdjacentHTML(
      "beforeend",
      step_str +
        "</span><span style='font-size: " +
        (gauss_array.length + 1) +
        "em;'>]</span></article><br>"
    );
  return;
}

function gauss_bs(form) {
  document.getElementById("solution").style.display = "revert";
  document.getElementById("solution").innerHTML =
    "<big><b>Solution: </b></big><br>";
  gauss_bs_array = [];

  for (let i = 0; i < parseInt(form.order.value); i++) {
    let tmp = [];
    for (let j = 0; j < parseInt(form.order.value); j++) {
      tmp.push(parseFloat(form["a_" + (i + 1) + "_" + (j + 1)].value));
    }
    tmp.push(parseFloat(form["b_" + (i + 1)].value));
    gauss_bs_array.push(tmp);
  }

  var x = gauss_bs_solve();
  if (x) {
    document
      .getElementById("solution")
      .insertAdjacentHTML("beforeend", "<br>So, we get: <br>");
    let ans_str = "";
    for (let i = x.length - 1; i >= 0; i--) {
      ans_str +=
        "<article class='math_equ'><span>X<sub>" +
        (i + 1) +
        "</sub>&nbsp;=&nbsp;</span><span class='num_den'><span>" +
        gauss_bs_array[i][gauss_bs_array.length].toFixed(precision).toString();
      for (let j = gauss_bs_array.length - 1; j > i; j--) {
        ans_str +=
          " - (" +
          gauss_bs_array[i][j].toFixed(precision).toString() +
          "* X<sub>" +
          (j + 1) +
          "</sub>)";
      }
      ans_str +=
        "</span><br>" +
        gauss_bs_array[i][i].toFixed(precision).toString() +
        "</span><span>&nbsp;=&nbsp;" +
        x[i].toFixed(precision).toString() +
        "</span></article>";
    }
    ans_str += "<br>Therefore, The solution set is: <br>";
    for (let i = 0; i < x.length; i++) {
      ans_str +=
        "X<sub>" +
        (i + 1) +
        "</sub>&nbsp;=&nbsp;" +
        x[i].toFixed(precision) +
        "<br>";
    }
    document
      .getElementById("solution")
      .insertAdjacentHTML("beforeend", ans_str);
  } else {
    document
      .getElementById("solution")
      .insertAdjacentHTML(
        "beforeend",
        "<br>No / Multiple solutions exist.<br>"
      );
  }
  return;
}

function array_2d_swap_rows(array_2d, pos1, pos2) {
  if (pos2 != pos1) {
    let tmp = array_2d[pos2];
    array_2d[pos2] = array_2d[pos1];
    array_2d[pos1] = tmp;
  }
  return;
}

gauss_jordan_array = [];
precision = 4;
function gauss_jordan(form) {
  document.getElementById("solution").style.display = "revert";
  document.getElementById("solution").innerHTML =
    "<big><b>Solution: </b></big><br>";
  gauss_jordan_array = [];

  for (let i = 0; i < parseInt(form.order.value); i++) {
    let tmp = [];
    for (let j = 0; j < parseInt(form.order.value); j++) {
      tmp.push(parseFloat(form["a_" + (i + 1) + "_" + (j + 1)].value));
    }
    tmp.push(parseFloat(form["b_" + (i + 1)].value));
    gauss_jordan_array.push(tmp);
  }

  var x = gauss_jordan_solve();
  if (x) {
    let ans_str = "";
    ans_str += "<br>Therefore, The solution set is: <br>";
    for (let i = 0; i < x.length; i++) {
      ans_str +=
        "X<sub>" +
        (i + 1) +
        "</sub>&nbsp;=&nbsp;" +
        x[i].toFixed(precision) +
        "<br>";
    }
    document
      .getElementById("solution")
      .insertAdjacentHTML("beforeend", ans_str);
  } else {
    document
      .getElementById("solution")
      .insertAdjacentHTML(
        "beforeend",
        "<br>No / Multiple solutions exist.<br>"
      );
  }
  return;
}

function gauss_jordan_solve() {
  let step = 1;
  for (let k = 0; k < gauss_jordan_array.length; k++) {
    i_max = gauss_find_pivot(gauss_jordan_array, k);
    if (gauss_jordan_array[i_max][k] == 0) return false;
    array_2d_swap_rows(gauss_jordan_array, k, i_max);
    gauss_step(
      gauss_jordan_array,
      "Finding pivot for row no. " + (k + 1),
      step++
    );
    let c = gauss_jordan_array[k][k];
    for (let j = k + 1; j < gauss_jordan_array[0].length; j++) {
      gauss_jordan_array[k][j] = gauss_jordan_array[k][j] / c;
    }
    gauss_jordan_array[k][k] = 1;
    gauss_step(
      gauss_jordan_array,
      "Applying R<sub>" +
        (k + 1) +
        "</sub>=>R<sub>" +
        (k + 1) +
        "</sub>/" +
        c.toFixed(precision),
      step++
    );
    for (let i = 0; i < gauss_jordan_array.length; i++) {
      if (i != k) {
        let c = gauss_jordan_array[i][k] / gauss_jordan_array[k][k];
        for (let j = k + 1; j < gauss_jordan_array[0].length; j++) {
          gauss_jordan_array[i][j] =
            gauss_jordan_array[i][j] - gauss_jordan_array[k][j] * c;
        }
        gauss_jordan_array[i][k] = 0;
        gauss_step(
          gauss_jordan_array,
          "Applying R" +
            (i + 1) +
            "=>R<sub>" +
            (i + 1) +
            "</sub>-R<sub>" +
            (k + 1) +
            "</sub>*" +
            c.toFixed(precision),
          step++
        );
      }
    }
  }
  gauss_step(
    gauss_jordan_array,
    "So, the final equation can be written as: ",
    step++,
    true
  );
  return gauss_get_ans(gauss_jordan_array);
}
