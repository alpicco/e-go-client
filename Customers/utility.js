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

    var image = new Image();
    image.src = images;
    if(image.height > image.width) {
      image.style.height = '80px';
      image.style.width = 'auto';
    } else {
      image.style.width = '80px';
      image.style.height = 'auto';
    }
    
    var html = ['<div class="container>',
     '<div class="row" id ="cont">',
     '<div class="col-md-3">',
      '<div class="ibox">',
      '<div class="ibox-content product-box">',
      '<div class="product-imitation" style="background-image: url('+image.src+');background-size: cover;">',
      '</div>',
      '<div class="product-desc">',
      '<span class="product-price">12$',
      '</span>',
      '<small class="text-muted">' + caption + '</small>',
      '<a href="product_detail.html" class="product-name">' + name + '</a>',

      '<div class="small m-t-xs">' + description + '',
      '</div>',
      '<div class="m-t text-right">',
      '<a href="product_detail.html" class="btn btn-xs btn-outline btn-primary">Info <i class="fa fa-long-arrow-right"></i> </a>',
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