function onSubmitRegister(form) {

  var frm = $(form);
  var formData = frm.serializeArray();

  var myData = {};
  $.map(formData, function (obj, i) {
    myData[obj['name']] = obj['value'];
  });

  myData = JSON.stringify(myData);

  $.ajax({
    type: "POST",
    url: 'https://9839f3bb.ngrok.io/register',
    async: false,
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    data: myData,
    success: function () {
      window.location = "index.html"
    },
    error: function (xhr) {
      alert(xhr.status);
    }
  });

  return true;
}


function onSubmitLogin() {
  var user = document.getElementById("user").value;
  var pass = document.getElementById("pass").value;
  $.ajax({
    type: "POST",
    url: "https://9839f3bb.ngrok.io/login",
    async: false,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + pass));
    },
    success: function (data) {
      localStorage.setItem("token", data);
      window.location = ("admin.html");
    },
    error: function (xhr) {
      alert(xhr.status);
    }
  });

  return true;
}

function postNewProduct() {
  var token = JSON.parse(localStorage.getItem("token"));
  var auth = token["token"];

  var frm = $("#form");
  var formData = frm.serializeArray();

  var myData = {};
  $.map(formData, function (obj, i) {
    myData[obj['name']] = obj['value'];
  });

  myData = JSON.stringify(myData);
  alert(myData);

  $.ajax({
    type: "POST",
    url: "https://e60c7c1b.ngrok.io/products",
    async: false,
    dataType: "text",
    data: myData,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + auth);
    },
    success: function () {
      alert("OK");
    },
    error: function (xhr) {
      alert(xhr.status);
    }
  });

  return true;
}