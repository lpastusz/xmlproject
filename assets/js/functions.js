google.maps.event.addDomListener(window, 'load', getServices);
var map;
var markers = [];

function getServices() {

    var myjson = $.ajax( {
        url:"CollectionService",
        type: "GET",
        dataType:'json',
        success: function(data) {
            initialize(data);
        },
        error: function(data){
            console.log("error");
        },
    });
}


function initialize(services) {
      var container = document.getElementById('checkboxes');

      for (var i = -1; i < services.length; i++) {

            var div = document.createElement('div');
            var checkbox = document.createElement('input');
            var label = document.createElement('label');
            var serviceId= "all",serviceName = "all";

            if(i >= 0){
                serviceName = services[i].serviceName;
                serviceId = services[i].id;
            }

            checkbox.type = "checkbox";
            checkbox.checked = "";
            //checkbox.id = serviceName + "_cb_"+ (i+1);
            checkbox.id = serviceId + "_cb";
            checkbox.value = serviceId;

            checkbox.className = "checkboxes";
            checkbox.onchange = "allClick(checkbox)";

            label.className = "labels";
            label.htmlFor = serviceId + "_cb";
            console.log(serviceId);
            label.appendChild(document.createTextNode(serviceName));

            div.appendChild(checkbox);
            div.appendChild(label);
            container.appendChild(div);
    }

    initializeMap();
    $('#all_cb').next('label').addClass('bold');

    $(window).resize(function () {
        var h = $(window).height(),
            offsetTop = 60; // Calculate the top offset

        $('#googleMap').css('height', (h - offsetTop-60));

    }).resize();


    $(function() {
        $('#all_cb').next('label').addClass('bold');
        $('#all_cb').click(function() {
            var checkboxes = document.getElementsByTagName('input');
              if (document.getElementById('all_cb').checked)
              {
                  for (var i = 0; i < checkboxes.length; i++) {
                        if (checkboxes[i].type == 'checkbox') {
                            checkboxes[i].checked = true;
                        }
                  }
              } else {
                  for (var i = 0; i < checkboxes.length; i++) {
                        if (checkboxes[i].type == 'checkbox') {
                            checkboxes[i].checked = false;
                        }
                    }
              }
        });
    });



    // handle ALL checkbox (if all single checkboxes are selected, select also all_cb checkbox)
    $(function() {
        $(document).on('change', '#checkboxes input[type=checkbox]', function() {
            if ($(this).attr('id') == 'all_cb')
            {
                return;
            }
            else
            {
                var allSelected = true;
                elements = $('#checkboxes input[id!=all_cb]');
                $(elements).each(function(index, elm) {
                    if (!$(elm).is(':checked'))
                    {
                        allSelected = false;
                    }
                });

                if (allSelected)
                {
                    $('#checkboxes input[id=all_cb]').prop('checked', true);
                }
                else
                {
                    $('#checkboxes input[id=all_cb]').prop('checked', false);
                }
            }
        })
    });
}

function initializeMap() {

  var mapProp = {
            center:new google.maps.LatLng(49.4,17.4),
            zoom:7,
            mapTypeId:google.maps.MapTypeId.ROADMAP
          };
  map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
}


function updateMap(services) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }

    $.each(services, function(i, service) {
        $.each(service.collectionOffices, function(j, office) {
            var officeLatLng = {lat: Number(office.latitude), lng:  Number(office.longitude)};
            var marker = new google.maps.Marker({
                position: officeLatLng,
                map: map,
                title:  office.name
            });

            marker.addListener('click', function() {
                $.colorbox({
                    html: '<div style="background: #fff; padding: 20px;"><h2>'+service.serviceName+'</h2><h3>'+office.name+'</h3></div>'
                });
            });
            markers.push(marker);
        });
    });
}

function btnConfirm_onClick(btnConfirm) {

    var elements = $('#checkboxes input[id!=all_cb]');
    var params = '';

    $(elements).each(function(index, elm) {
        if ($(elm).is(':checked'))
        {
            if (params != '')
            {
                params += ','
            }

            params += $(elm).val();
        }
    });

    getOffices(params);
}

function btnConfirm_onClick2(btnConfirm) {
    var serviceIds = $('input:checked');
    var urlParams="/?";
    for (var i = 1; i < serviceIds.length; i++) {
        var serviceName = serviceIds[i].id;
        urlParams += "id="+serviceName.substring(0, serviceName.length-3)+"&"
    }
    urlParams = urlParams.substring(0, urlParams.length-1);
    getOffices(urlParams);
}

function getOffices(serviceIds) {

    var myjson = $.ajax( {
        url:"getOffices?servicesIds="+serviceIds,
        type: "GET",
        dataType:'json',
        success: function(data) {
            updateMap(data);
        },
        error: function(data){
            console.log("error");
        },
    });
}
