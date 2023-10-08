var flag = true;

document.querySelector("#composeBtn").addEventListener("click", function () {
  if (flag) {
    document.querySelector("#composeMail").style.right = "0%";
    flag = false;
  } else {
    document.querySelector("#composeMail").style.right = "-45%";
    flag = true;
  }
});