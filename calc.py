from flask import Flask, request, Response
from json import dumps, loads
from copy import deepcopy
import numpy

html = """
<!DOCTYPE html>
<html>
  <head>
    <title>Virtual Matrix Totalizer</title>
    <link rel="stylesheet" type="text/css" href="style.css" />
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <header>
      <section>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="cadetblue"
          width="48"
          height="48"
          viewBox="-9 -9 40 40"
        >
          <path
            stroke="none"
            fill-rule="even-odd"
            d="M28 12 a18 18 0 1 1 0 -0.001"
          ></path>
          <path
            fill="none"
            stroke="white"
            stroke-width="1.5"
            d="M10 2 l-10 5 l10 5 l10 -5 l-10 -5z m-10 15 l10 5 l10 -5 m-20 -5 l10 5 10-5"
          ></path>
        </svg>
        <h2 style="font-size: 26px; padding-left: 8px">Virtual Matrix Totalizer</h2>
      </section>
    </header>
    <main class="bg">
      <section id="Home">
        <br />
        This website is developed to solve, analyze and completely study the
        problems related to matrices. One can obtain a detailed step-by-step
        solution along with some description for any set of linear equations
        with any number of variables. This site is very user friendly and is
        specifically made student-oriented which will definitely help to enhance
        learning and will bring enthusiasm amongst young learners.
        <br />
      </section>
      <section id="solution" style="padding: 12px">
        <h2>Solution:</h2>
      </section>
    </main>
  </body>
  <script
    type="text/javascript"
    src="https://code.jquery.com/jquery-3.6.0.min.js"
  ></script>
  <script type="text/javascript">
    let sol = __SOL__;
    for (let i of sol) {
      if (i.array)
        for (let a = 0; a < i.array.length; a++) {
          for (let b = 0; b < i.array[0].length; b++) {
            i.array[a][b] = i.array[a][b].toFixed(4);
          }
        }
      let cont = i.solution;
      if (cont == undefined) cont = JSON.stringify(i.array);
      if (i.description == "Final answer") {
        if (location.pathname.startsWith("/gauss")) {
          let tmp = "";
          for (let i = 1; i <= cont.length; i++) {
            tmp += "x" + i + " = " + cont[i - 1].toFixed(6) + "\\n";
          }
          cont = tmp;
        }
      }
      if (typeof cont != "string") cont = JSON.stringify(cont);
      document
        .getElementById("solution")
        .insertAdjacentHTML(
          "beforeend",
          "<h4>" +
            i.description +
            "</h4><pre>" +
            cont
              .replaceAll("[[", "\\t[")
              .replaceAll("],[", "]\\n\\t[")
              .replaceAll("]]", "]") +
            "</pre>"
        );
    }
  </script>
</html>

"""

text_file = open("./style.css", "r")
css = text_file.read()
text_file.close()

app = Flask(__name__)  # to initiate server object


@app.route("/style.css")
def style():
    return Response(css, mimetype='text/css')


@app.route("/gauss-elimination-bs", methods=["POST", "GET"])
def gauss_elimination_bs():
    if request.method == "GET":
        e = loads(request.args["arr"])  # to take user input
    else:
        e = request.get_json(force=True).get("arr")  # to take user input
    order = len(e)
    sol = []
    for i in range(order-1):
        pivot = i
        for j in range(i+1, order):
            if abs(e[j][i]) > abs(e[pivot][i]):
                pivot = j
        if pivot != i:
            tmp = e[i]
            e[i] = e[pivot]
            e[pivot] = tmp
            sol.append({"description": "Swapping row "+str(i+1) +
                       " with pivot row "+str(pivot+1)+".", "array": deepcopy(e)})
        else:
            sol.append({"description": "Pivot found on row "+str(i+1) +
                       " itself. Array not changed.", "array": deepcopy(e)})
        for j in range(i+1, order):
            c = e[j][i]/e[i][i]
            for k in range(i, order+1):
                e[j][k] -= c*e[i][k]
            sol.append({"description": "Applying R"+str(j+1)+" = R" +
                       str(j+1)+" - ("+str(c)+") X R"+str(i+1), "array": deepcopy(e)})
    ans = []
    for i in range(order):
        ans.append(e[i][order])
    for i in range(order):
        for j in range(i):
            ans[order-i-1] -= ans[order-j-1]*e[order-i-1][order-j-1]
        ans[order-i-1] /= e[order-i-1][order-i-1]
    for i in range(order):
        bs_str = "From equation "+str(order-i)+", "
        for j in range(i):
            bs_str += "("+str(e[order-1-i][order-1-i+j]) + \
                " X x"+str(order-i+j)+") + "
        bs_str += "("+str(e[order-1-i][order-1])+" X x"+str(order)+") = "+str(
            e[order-1-i][order])+" i.e. x"+str(order-i)+" = "+str(ans[order-1-i])
        sol.append({"description": "Back substitution for variable " +
                   str(order-i), "solution": bs_str})
    sol.append({"description": "Final answer",
               "solution": ans, "array": deepcopy(e)})
    if request.method == "GET":
        # to send text output for the api request
        res = Response(html.replace("__SOL__", dumps(sol)))
    else:
        res = Response(dumps(sol))
    res.headers['Access-Control-Allow-Origin'] = "*"
    return res


@app.route("/gauss-jordan", methods=["POST", "GET"])
def gauss_jorden():
    if request.method == "GET":
        e = loads(request.args["arr"])
    else:
        e = request.get_json(force=True).get("arr")
    order = len(e)
    sol = []
    for i in range(order):
        pivot = i
        for j in range(i+1, order):
            if abs(e[j][i]) > abs(e[pivot][i]):
                pivot = j
        if pivot != i:
            tmp = e[i]
            e[i] = e[pivot]
            e[pivot] = tmp
            sol.append({"description": "Swapping row "+str(i+1) +
                       " with pivot row "+str(pivot+1)+".", "array": deepcopy(e)})
        else:
            sol.append({"description": "Pivot found on row "+str(i+1) +
                       " itself. Array not changed.", "array": deepcopy(e)})
        pivot_ele = e[i][i]
        for j in range(order):
            if j != i:
                c = e[j][i]/e[i][i]
                for k in range(order+1):
                    e[j][k] -= c*e[i][k]
                sol.append({"description": "Applying R"+str(j+1)+" = R" +
                           str(j+1)+" - ("+str(c)+") X R"+str(i+1), "array": deepcopy(e)})
        for j in range(order+1):
            e[i][j] /= pivot_ele
        sol.append({"description": "Applying R"+str(i+1)+" = R" +
                   str(i+1)+" / "+str(e[i][i]), "array": deepcopy(e)})
    ans = []
    for i in range(order):
        ans.append(e[i][order])
    sol.append({"description": "Final answer",
               "solution": ans, "array": deepcopy(e)})
    if request.method == "GET":
        # to send text output for the api request
        res = Response(html.replace("__SOL__", dumps(sol)))
    else:
        res = Response(dumps(sol))
    res.headers['Access-Control-Allow-Origin'] = "*"
    return res


@app.route("/inverse", methods=["POST", "GET"])
def inverse():
    if request.method == "GET":
        e = loads(request.args["arr"])
    else:
        e = request.get_json(force=True).get("arr")
    sol = []
    sol.append({"description": "Final answer",
               "solution": numpy.linalg.inv(e).tolist()})
    if request.method == "GET":
        # to send text output for the api request
        res = Response(html.replace("__SOL__", dumps(sol)))
    else:
        res = Response(dumps(sol))
    res.headers['Access-Control-Allow-Origin'] = "*"
    return res


@app.route("/add", methods=["POST", "GET"])
def add():
    if request.method == "GET":
        a1 = loads(request.args["arr1"])
        a2 = loads(request.args["arr2"])
    else:
        a1 = request.get_json(force=True).get("arr1")
        a2 = request.get_json(force=True).get("arr2")
    for i in range(len(a1)):
        for j in range(len(a1[0])):
            a1[i][j] += a2[i][j]
    sol = []
    sol.append({"description": "Final answer", "solution": a1})
    if request.method == "GET":
        # to send text output for the api request
        res = Response(html.replace("__SOL__", dumps(sol)))
    else:
        res = Response(dumps(sol))
    res.headers['Access-Control-Allow-Origin'] = "*"
    return res


@app.route("/subtract", methods=["POST", "GET"])
def subtract():
    if request.method == "GET":
        a1 = loads(request.args["arr1"])
        a2 = loads(request.args["arr2"])
    else:
        a1 = request.get_json(force=True).get("arr1")
        a2 = request.get_json(force=True).get("arr2")
    for i in range(len(a1)):
        for j in range(len(a1[0])):
            a1[i][j] -= a2[i][j]
    sol = []
    sol.append({"description": "Final answer", "solution": a1})
    if request.method == "GET":
        # to send text output for the api request
        res = Response(html.replace("__SOL__", dumps(sol)))
    else:
        res = Response(dumps(sol))
    res.headers['Access-Control-Allow-Origin'] = "*"
    return res


@app.route("/multiply", methods=["POST", "GET"])
def multiply():
    if request.method == "GET":
        a1 = loads(request.args["arr1"])
        a2 = loads(request.args["arr2"])
    else:
        a1 = request.get_json(force=True).get("arr1")
        a2 = request.get_json(force=True).get("arr2")
    sol = []
    sol.append({"description": "Final answer",
               "solution": numpy.matmul(a1, a2).tolist()})
    if request.method == "GET":
        # to send text output for the api request
        res = Response(html.replace("__SOL__", dumps(sol)))
    else:
        res = Response(dumps(sol))
    res.headers['Access-Control-Allow-Origin'] = "*"
    return res


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)

"""
arr=[[1,0,0,2],[0,1,0,3],[0,0,1,4]]
$.post({
	url: "http://localhost:8080/gauss-elimination-bs",
	data: JSON.stringify({arr: arr}),
	dataType: "json",
	success: function(data){console.log(data);}
})

http://localhost:8080/gauss-elimination-bs?arr=[[1,0,0,2],[0,1,0,3],[0,0,1,4]]

gauss-elimination-bs
gauss-jordan
add
subtract
multiply
inverse
"""
