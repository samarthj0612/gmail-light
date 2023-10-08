document.querySelector("#username").addEventListener("input", function () {
  var that = this;
  if (this.value.trim().length > 0) {
    axios.get(`/check/${this.value}`).then(function (response) {
      if (response.data.user) {
        that.style.outline = "2px solid red";
      } else {
        that.style.outline = "2px solid green";
      }
    });
  } else {
    that.style.outline = "initial";
  }
});
