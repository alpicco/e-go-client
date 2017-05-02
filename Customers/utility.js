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
      window.location = ("index.html");
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
    success: function (data) {
      localStorage.setItem("token", data);
      window.location = ("product_list.html");
    },
    error: function (xhr) {
      alert(xhr.status);
    }
  });

  return true;
}

function onLoadProductList() {
  var token = JSON.parse(localStorage.getItem("token"));
  var auth = token["token"];
  $.ajax({
    type: "GET",
    url: "https://e60c7c1b.ngrok.io/products",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + auth);
    },
    success: function (data) {
      parseItem(data);
    },
    error: function (xhr) {
      alert(xhr.status);
    }
  });

  return true;
}

function parseItem(data) {
  var json = JSON.parse(data);
  $.each(json, function (index, value) {
    var name = value["name"];
    var caption = value["caption"];
    var description = value["description"];
    var shippable = value["shippable"];
    var images = value["images"];

    var html = ['<div class="container>',
      '<div class="row" id ="cont">',
      '<div class="col-md-3">',
      '<div class="ibox">',
      '<div class="ibox-content product-box">',
      '<div class="product-imitation" style="background-image: url(' + images + ');background-size: cover;">',
      '</div>',
      '<div class="product-desc">',
      '<span class="product-price">12$',
      '</span>',
      '<small class="text-muted">' + caption + '</small>',
      '<a href="product_detail.html" class="product-name">' + name + '</a>',

      '<div class="small m-t-xs">' + description + '',
      '</div>',
      '<div class="m-t text-right">',
      '<a href="product_detail.html" onclick="return productDetail(\'' + name + '\', \'' + caption + '\', \'' + description + '\', \'' + shippable + '\', \'' + images + '\')" class="btn btn-xs btn-outline btn-primary">Info</a>',
      '</div>',
      '</div>',
      '</div>',
      '</div>',
      '</div>',
      '</div>',
      '</div>'].join('');
    var div = document.createElement('div');
    div.innerHTML = html;
    document.getElementsByTagName("body")[0].appendChild(div);
  });
}

function productDetail(name, caption, description, shippable, images) {
  var html = ['<div class="container">',
    '<div class="row">',
    '<div class="col-xs-4 item-photo">',
    '<img style="max-width:100%;" src="' + images + '"/>',
    '</div>',
    '<div class="col-xs-5" style="border:0px solid gray">',
    '<h3>' + name + '</h3>',
    '<h6 class="title-price"><small>PRICE</small></h6>',
    '<h3 id="price" style="margin-top:0px;">$399</h3>',
    '<div class="section" style="padding-bottom:20px;">',
    '<h6 class="title-attr"><small>QUANTITY</small></h6>',
    '<div>',
    '<div class="btn-minus"><span class="glyphicon glyphicon-minus"></span></div>',
    '<input value="1" />',
    '<div class="btn-plus"><span class="glyphicon glyphicon-plus"></span></div>',
    '</div>',
    '</div>',
    '<div class="section" style="padding-bottom:20px;">',
    '<button class="btn btn-success"><span style="margin-right:10px" class="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> Buy</button>',
    '</div>',
    '</div>',
    '</div>',
    '</div>'].join('');
  var div = document.createElement('div');
  div.innerHTML = html;
  document.getElementById("detail").appendChild(div);

}