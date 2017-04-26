function onSubmitRegister(form){
  
  var frm = $(form);
  var formData = frm.serializeArray();

  var myData = {};
  $.map(formData, function (obj,i) {
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
    success: function() {
      
    },
    error: function(xhr) {
      alert(xhr.status);
    }
  });

  return true;
}


function onSubmitLogin(form){
  var username = ("#user").val();
  var password = ("#pass").val();
    $.ajax({
    type: "POST",
    url: "https://e60c7c1b.ngrok.io/login",
    contentType: "application/x-www-form-urlencoded",
    data: "",
    beforeSend: function (xhr) {
      xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
    },
    success: function() {
      alert("OK");
    },
    error: function(xhr) {
      alert(xhr.status);
    }
  });

  return true;
}