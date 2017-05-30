const baseURL = "/";
var myOrderList = [];

var onSubmitRegister = function (form) {
  var myData = {};

  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  myData['name'] = name;
  myData['email'] = email;
  myData['password'] = password;

  myData = JSON.stringify(myData);

  $.ajax({
    type: "POST",
    url: baseURL + 'register',
    async: false,
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    data: myData,
    success: function () {
      logIn();
    },
    error: function (xhr) {
      var json = JSON.parse(xhr.responseText);
      var message = JSON.parse(json.message);
      alert(message.message);
    }
  });

  return true;
}

function onSubmitLogin() {
  var user = document.getElementById("user").value;
  var pass = document.getElementById("pass").value;
  $.ajax({
    type: "POST",
    url: baseURL + "login",
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
      alert("error");
      //var json = JSON.parse(xhr.responseText);
      //var message = JSON.parse(json.message);
      //alert(message.message);
    }
  });

  return true;
}

function onLoadProductList() {
  $.ajax({
    type: "GET",
    url: baseURL + "products",
    success: function (data) {
      parseItem(data);
    },
    error: function (xhr) {
      if (xhr.status == 401) {
        loadLoginModal();
        $('#myModalNorm').modal('show');
      }
      //alert(xhr.responseText);
    },
  });

  return true;
}

function parseItem(data) {
  var $loading = $('#loadingDiv').hide();
  $(document).ajaxStart(function () {
    $loading.show();
  })
    .ajaxStop(function () {
      $loading.hide();
    });
  var json = JSON.parse(data);
  $.each(json, function (index, value) {
    var name = value.name;
    var caption = value.caption;
    var description = value.description;
    var url = value.skus.url;
    var images = value.images;
    var product = value.id;
    var count;
    var skus = value.skus.data;
    var price;
    var sku;
    $.each(skus, function (index, value) {
      price = value["price"];
      sku = value["id"];
      count = value["inventory"]["type"];
    });

    if (count > 0 || count == "infinite") {
      var html = ['<div class="container>',
        '<div class="row" id ="cont">',
        '<div class="col-md-3">',
        '<div class="ibox">',
        '<div class="ibox-content product-box">',
        '<div class="product-imitation" style="background-image: url(' + images + ');background-size: cover;">',
        '</div>',
        '<div class="product-desc">',
        '<span class="product-price">' + (price / 100) + 'eur',
        '</span>',
        '<small class="text-muted">' + caption + '</small>',
        '<p class="product-name">' + name + '</p>',

        '<div class="small m-t-xs">' + description + '',
        '</div>',
        '<div class="m-t text-right">',
        '<input type="button" onclick="window.location.href=\'product_detail.html?product=' + product + '\'" class="btn btn-xs btn-outline btn-primary" value="Info">',
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
    }
  });
}

function productDetail(product) {
  getProduct(product);
  var data = localStorage.getItem("data");
  var prod = JSON.parse(data);
  var json = JSON.parse(prod);
  var name = json.name;
  var image = json.images;
  var skus = json.skus.data;
  var description = json.description;
  var price;
  var count;
  var sku;
  $.each(skus, function (index, value) {
    price = value.price;
    sku = value.id;
    count = value.inventory.type;
  });

  var html = ['<div class="container">',
    '<div class="row">',
    '<div class="col-xs-4 item-photo">',
    '<img style="max-width:100%;" src="' + image + '" alt="Product Image"/>',
    '</div>',
    '<div class="col-xs-5" style="border:0px solid gray">',
    '<h3>' + name + '</h3>',
    '<h6 class="title-price"><small>PRICE</small></h6>',
    '<h3 id="price" style="margin-top:0px;">' + (price / 100) + 'eur</h3>',
    '<div class="section" style="padding-bottom:20px;">',
    '<h6 class="title-attr"><small>QUANTITY</small></h6>',
    '<div>',
    '<div class="btn-minus" onclick="return sub();"><span class="glyphicon glyphicon-minus"></span></div>',
    '<div style="height: 20px; width: 50px; text-align: center; border: solid 1px black"><p id="quantity">1</p></div>',
    '<div class="btn-plus" onclick="return add(\'' + count + '\')"><span class="glyphicon glyphicon-plus"></span></div>',
    '</div>',
    '</div>',
    '<p>' + description + '</p>',
    '<div style="padding-bottom: 0"></div>',
    '<p><strong>If this is your first order, please insert your shipping details.</strong></p>',
    '<div class="section" style="padding-bottom:20px;">',
    '<button onclick="return addToCart(\'' + sku + '\', document.getElementById(\'quantity\').innerHTML)" class="btn btn-success" style="width: 100%"><span style="margin-right:10px" class="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> Add to cart</button>',
    '</div>',
    '</div>',
    '</div>',
    '</div>'].join('');
  var div = document.createElement('div');
  div.innerHTML = html;
  document.getElementById("detail").appendChild(div);
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getProduct(product) {
  $.ajax({
    type: "GET",
    url: baseURL + "products/" + product,
    async: false,
    success: function (data) {
      localStorage.setItem("data", JSON.stringify(data));
    },
    error: function (xhr) {
      if (xhr.status == 401) {
        loadLoginModal();
        $('#myModalNorm').modal('show');
      } else {
        var json = JSON.parse(xhr.responseText);
        var message = JSON.parse(json.message);
        alert(message.message);
      }
    },
  });

  return true;
}

function addToCart(sku, quantity) {
  if (localStorage.getItem("token") != null) {
    var token = JSON.parse(localStorage.getItem("token"));
    var auth = token["token"];
  } else {
    loadLoginModal();
    $('#myModalNorm').modal('show');
  }
  var myData = {};
  myData["sku_id"] = sku;
  myData["quantity"] = parseInt(quantity);
  var list = [myData];

  $.ajax({
    type: "POST",
    url: baseURL + "orders",
    async: false,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + auth);
    },
    data: JSON.stringify(list),
    success: function (data) {
    },
    error: function (xhr) {
      if (xhr.status == 401) {
        loadLoginModal();
        $('#myModalNorm').modal('show');
      } else if(xhr.status == 500) {
        $('#myModalNormShipping').modal('show');
      } else {
        var json = JSON.parse(xhr.responseText);
        var message = JSON.parse(json.message);
        alert(message.message);
      }
    }
  });
}

function updateShippingInfos(form) {
  if (localStorage.getItem("token") != null) {
    var token = JSON.parse(localStorage.getItem("token"));
    var auth = token["token"];
  } else {
    loadLoginModal();
    $('#myModalNorm').modal('show');
  }

  var frm = $("#modalForm");
  var formData = frm.serializeArray();

  var myData = {};
  var address = {};
  $.map(formData, function (obj, i) {
    if (obj['name'] == "line1" || obj['name'] == "city" || obj['name'] == "state" || obj['name'] == "zip" || obj['name'] == "country") {
      address[obj['name']] = obj['value'];
    } else {
      myData[obj['name']] = obj['value'];
    }
  });

  myData['address'] = address;

  myData = JSON.stringify(myData);

  $.ajax({
    type: "POST",
    url: baseURL + 'me/shipment',
    async: false,
    dataType: "text",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + auth);
    },
    data: myData,
    success: function () {
      $("#modalAddToCart").modal('show');
    },
    error: function (xhr) {
      if (xhr.status == 401) {
        loadLoginModal();
        $('#myModalNorm').modal('show');
      } else {
        alert(xhr.responseText);
      }
    }
  });

  return true;
}

function orderList(data) {
  var totalPrice = 0;
  $.each(data, function (x, v) {
    var items = v.items;
    var id = v.id;
    var amount = 0;
    var currency;
    var description;
    var taxesAndShipping = "";
    var quantity;
    var status = v.status;
    var price = 0;
    $.each(items, function (index, value) {
      amount = amount + value.amount;
      if (index == 0) {
        quantity = value.quantity;
        description = value.description;
        currency = value.currency;
      } else {
        taxesAndShipping = taxesAndShipping + " " + value.description;
      }

      if (status != "canceled" && status != "paid") {

        if (!myOrderList.includes(id)) {
          myOrderList.push(id);
        }
        if ((index % 2) == 0 && index != 0) {
          if ($.isNumeric(taxesAndShipping)) {
            price = price + amount + taxesAndShipping;
          } else {
            price = price + amount;
          }

          totalPrice += price;

          var html = ['<td data-th="Select"><input type="checkbox" name="\'' + id + '\'"/></td>', '<td data-th="Product">',
            '<div class="row">',
            '<div class="col-sm-10">',
          '<h4 class="nomargin">' + description + '</h4>',
          '<p>' + taxesAndShipping + '</p>',
            '</div>',
            '</div>',
            '</td>',
          '<td data-th="Price">' + (amount / 100) + currency + '</td>',
            '<td data-th="Quantity">',
          '<p>' + quantity + '</p>',
            '</td>',
          '<td data-th="Subtotal" class="text-center">' + (price / 100) + currency + '</td>',
          '<td data-th="Pay"><button id="paymentButton' + id + '" onclick="window.location.href = \'buy.html?order=' + id + '\'" class="btn btn-primary btn-block">Pay<i class="fa fa-angle-right"></i></a></td>',
          '<td data-th="Cancel"><button id="cancelButton' + id + '" onclick="return cancelOrder(\'' + id + '\')" class="btn btn-danger btn-block">Cancel<i class="fa fa-angle-right"></i></a></td>',
            '<tr>'].join('');
          var div = document.createElement('tr');
          div.innerHTML = html;
          document.getElementById("products").appendChild(div);
        }
      }
    });

  });


  document.getElementById("total").innerHTML = "<strong>Total " + (totalPrice / 100) + "eur</strong>"
}

function sourceInfo(token) {
  var myData = {};
  myData['token'] = token.id;

  if (localStorage.getItem("token") != null) {
    var token = JSON.parse(localStorage.getItem("token"));
    var auth = token["token"];
  } else {
    loadLoginModal();
    $('#myModalNorm').modal('show');
  }
  $.ajax({
    type: "POST",
    url: baseURL + 'me/source',
    async: false,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + auth);
    },
    data: JSON.stringify(myData),
    success: function (data) {
      replaceElem(data);
    },
    error: function (xhr) {
      if (xhr.status == 401) {
        loadLoginModal();
        $('#myModalNorm').modal('show');
      } else {
        var json = JSON.parse(xhr.responseText);
        var message = JSON.parse(json.message);
        alert(message.message);
      }
    }
  });

  return true;
}

function replaceElem(data) {
  var json = JSON.parse(data);
  var name = json.shipping.name;
  var address = json.shipping.address;
  var street;
  var city;
  var state;
  $.each(address, function (index, value) {
    street = address.line1;
    city = address.city;
    state = address.state;
  });

  var html = ['<div style="margin: 0 auto"><p>The order will be shipped to <ul><li>' + name + '</li><li>' + street + '</li><li>' + city + '</li><li>' + state + '</li></ul></p></div>',
    '<input id="button" type="submit" onclick="submitPayment()" value="Submit Payment">'].join('');
  var div = document.createElement('div');
  div.innerHTML = html;
  var child = document.getElementById('payment-form');
  document.getElementById("StripeForm").removeChild(child);
  document.getElementById("StripeForm").appendChild(div);

  document.getElementById("header").innerHTML = "<h1>Payment</h1>"
}

function submitPayment() {
  if (localStorage.getItem("token") != null) {
    var token = JSON.parse(localStorage.getItem("token"));
    var auth = token["token"];
  } else {
    loadLoginModal();
    $('#myModalNorm').modal('show');
  }
  var arr = document.URL.match(/or_[0-9a-zA-Z]*/g);

  $.ajax({
    type: "POST",
    url: baseURL + "orders/pay",
    async: false,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + auth);
    },
    data: JSON.stringify(arr),
    success: function (data) {
      window.location = ("product_list.html");
    },
    error: function (xhr) {
      if (xhr.status == 401) {
        loadLoginModal();
        $('#myModalNorm').modal('show');
      } else {
        var json = JSON.parse(xhr.responseText);
        var message = JSON.parse(json.message);
        alert(message.message);
      }
    }
  });
}

function cancelOrder(id) {
  if (localStorage.getItem("token") != null) {
    var token = JSON.parse(localStorage.getItem("token"));
    var auth = token["token"];
  } else {
    loadLoginModal();
    $('#myModalNorm').modal('show');
  }
  var list = [id];

  $.ajax({
    type: "POST",
    url: baseURL + "orders/cancel",
    async: false,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + auth);
    },
    data: JSON.stringify(list),
    success: function (data) {
      location.reload();
    },
    error: function (xhr) {
      if (xhr.status == 401) {
        loadLoginModal();
        $('#myModalNorm').modal('show');
      } else {
        var json = JSON.parse(xhr.responseText);
        var message = JSON.parse(json.message);
        alert(message.message);
      }
    }
  });
}


function logOut() {
  localStorage.removeItem("token");
}

function onLoadOrderList() {
  if (localStorage.getItem("token") != null) {
    var token = JSON.parse(localStorage.getItem("token"));
    var auth = token["token"];
  } else {
    loadLoginModal();
    $('#myModalNorm').modal('show');
  }
  $.ajax({
    type: "GET",
    url: baseURL + "me/orders",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + auth);
    },
    success: function (data) {
      orderList(JSON.parse(data));
    },
    error: function (xhr) {
      if (xhr.status == 401) {
        loadLoginModal();
        $('#myModalNorm').modal('show');
      }
      //alert(xhr.responseText);
    },
  });

  return true;
}

function returnOrderList() {
  return myOrderList;
}

function loadLoginModal() {

  var html = ['<div class="modal fade" id="myModalNorm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">',
    '<div class="modal-dialog">',
    '<div class="modal-content">',
    '<div class="modal-header">',
    '<button type="button" class="close" data-dismiss="modal">',
    '<span aria-hidden="true">&times;</span>',
    '<span class="sr-only">Close</span>',
    '</button>',
    '<h4 class="modal-title" id="myModalLabel">',
    'Login to your account',
    '</h4>',
    '</div>',
    '<div class="modal-body" id="modal-body>',
    '<form id="modalForm" method="POST">',
    '<div class="form-group">',
    '<label for="name">Name</label>',
    '<input type="text" name="user" class="form-control" id="user" placeholder="foo@bar.com" />',
    '</div>',
    '<div class="form-group">',
    '<label for="password">Password</label>',
    '<input type="password" name="pass" class="form-control" id="pass" placeholder="Password" />',
    '</div>',
    '<button onclick="return onSubmitLogin()" id="modalSubmit" class="btn btn-default">Submit</button>',
    '</form>',
    '</div>',
    '<div class="modal-footer">',
    '<button type="button" class="btn btn-primary" onclick="return replaceModal()">',
    'Register',
    '</button>',
    '<button type="button" class="btn btn-danger" data-dismiss="modal">',
    'Exit',
    '</button>',
    '</div>',
    '</div>',
    '</div>',
    '</div>'].join('');
  var div = document.createElement('div');
  div.innerHTML = html;
  document.getElementsByTagName("body")[0].appendChild(div);

}

function logIn() {
  $('#myModalNormRegister').modal('hide');
  loadLoginModal();
  $('#myModalNorm').modal('show');
}

function replaceModal() {
  $('#myModalNorm').modal('hide');
  var html = ['<div class="modal fade" id="myModalNormRegister" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">',
    '<div class="modal-dialog">',
    '<div class="modal-content">',
    '<div class="modal-header">',
    '<button type="button" class="close" data-dismiss="modal">',
    '<span aria-hidden="true">&times;</span>',
    '<span class="sr-only">Close</span>',
    '</button>',
    '<h4 class="modal-title" id="myModalLabel">',
    'Create an account',
    '</h4>',
    '</div>',
    '<div class="modal-body" id="modal-body>',
    '<form id="modalFormRegister" method="POST">',
    '<div class="form-group">',
    '<label for="name">Name</label>',
    '<input type="text" name="name" class="form-control" id="name" placeholder="John Smith" />',
    '</div>',
    '<div class="form-group">',
    '<label for="name">User name</label>',
    '<input type="text" name="email" class="form-control" id="email" placeholder="john@smith.com" />',
    '</div>',
    '<div class="form-group">',
    '<label for="password">Password</label>',
    '<input type="password" name="password" class="form-control" id="password" placeholder="Password" />',
    '</div>',
    '<button onclick="return onSubmitRegister()" id="modalSubmit" class="btn btn-default">Submit</button>',
    '</form>',
    '</div>',
    '<div class="modal-footer">',
    '<button type="button" class="btn btn-primary" onclick="return logIn()">',
    'Login',
    '</button>',
    '<button type="button" class="btn btn-danger" data-dismiss="modal">',
    'Exit',
    '</button>',
    '</div>',
    '</div>',
    '</div>',
    '</div>'].join('');
  var div = document.createElement('div');
  div.innerHTML = html;
  document.getElementsByTagName("body")[0].appendChild(div);
  $('#myModalNormRegister').modal('show');
}
