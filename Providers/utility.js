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
    url: 'https://e60c7c1b.ngrok.io/register',
    async: false,
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    data: myData,
    success: function () {

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
    url: "https://e60c7c1b.ngrok.io/login",
    async: false,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + pass));
    },
    success: function () {
      window.location = ("product_list.html");
      return true;
    },
    error: function (xhr) {
      alert(xhr.status);
    }
  });

  return true;
}