const baseURL = "https://store.bitc.li:3000/admin/"

function postNewProduct() {
  var frm = $("#form");
  var formData = frm.serializeArray();

  var myData = {};
  $.map(formData, function (obj, i) {
    myData[obj['name']] = obj['value'];
  });

  myData = JSON.stringify(myData);

  /*$.ajax({
    type: "POST",
    url: baseURL + "products",
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
  });*/

  return true;
}

function encodeImageFileAsURL(element) {
  var file = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function() {
    alert(reader.result);
  }
  reader.readAsDataURL(file);
}
