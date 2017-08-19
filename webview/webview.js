var map;
var mytest = [];

var infowindow = new naver.maps.InfoWindow();

window.onload = function(){
  map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(37.5666805, 126.9784147),
      zoom: 5,
      mapTypeId: naver.maps.MapTypeId.NORMAL
  });
  if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
    } else {
        var center = map.getCenter();

        infowindow.setContent('<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</h5>'+ "latitude: "+ center.lat() +"<br />longitude: "+ center.lng() +'</div>');
        infowindow.open(map, center);
    }

    setStation();

    naver.maps.Event.addListener(map, 'idle', function() {
        updateMarkers(map, markers);
    });

    for (var i=0, ii=markers.length; i<ii; i++) {
        naver.maps.Event.addListener(markers[i], 'click', getClickHandler(i));
    }
}

function onSuccessGeolocation(position) {
  var location = new naver.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
  console.log(position.coords.latitude+"   "+position.coords.longitude);
  naver.maps.Service.reverseGeocode({
      location: new naver.maps.LatLng(position.coords.latitude, position.coords.longitude),
  }, function(status, response) {
      if (status !== naver.maps.Service.Status.OK) {
          return alert('Something wrong!');
      }
      console.log(response);
      var result = response.result, // 검색 결과의 컨테이너
          items = result.items; // 검색 결과의 배열
        for(var i=0; i<items.length; i++)
        {
          mytest.push(items[i].address);
        }

        map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
        map.setZoom(10); // 지도의 줌 레벨을 변경합니다.

        infowindow.setContent('<div style="padding:20px;">' +
           mytest[1]+'</div>');


        infowindow.open(map, location);
      // do Something

      var post_data = {post_data:mytest[1]};
      $.ajax({
        url: './php/location.php',
        type: 'POST',
        data: post_data,
        dataType: 'json',
        success: function(data) {
          console.log(data);
          var count = 0;
          for(var i=0; i<data.items.length; i++){
              var station = data.items[i].title;
              console.log(station);
              var select_tag = document.getElementById("drop1");
              var new_station = document.createElement("option");
              //new_li.setAttribute("onmousedown",setStation());
              new_station.innerHTML = station;
              select_tag.appendChild(new_station);

          }
        },
        error: function(request, status, error){
          console.log(request, status, error);
        },
      });
  });
}

function onErrorGeolocation() {
    var center = map.getCenter();

    infowindow.setContent('<div style="padding:20px;">' +
        '<h5 style="margin-bottom:5px;color:#f00;">Geolocation failed!</h5>'+ "latitude: "+ center.lat() +"<br />longitude: "+ center.lng() +'</div>');

    infowindow.open(map, center);
}


function getMapElement() {
  var HOME_PATH = window.HOME_PATH || '.';
    var myaddress = document.getElementById("myinput").value;// 도로명 주소나 지번 주소만 가능 (건물명 불가!!!!)
    var map = new naver.maps.Map('map',{
        scaleControl: false,
          logoControl: false,
          mapDataControl: false,
          zoomControl: true,
          minZoom: 1
    });
      naver.maps.Service.geocode({address: myaddress}, function(status, response) {
          if (status !== naver.maps.Service.Status.OK) {
              return alert(myaddress + '의 검색 결과가 없거나 기타 네트워크 에러');
          }
          var result = response.result;
          // 검색 결과 갯수: result.total
          // 첫번째 결과 결과 주소: result.items[0].address
          // 첫번째 검색 결과 좌표: result.items[0].point.y, result.items[0].point.x
          var myaddr = new naver.maps.Point(result.items[0].point.x, result.items[0].point.y);
          var latlng = new naver.maps.LatLng((result.items[0].point.x),(result.items[0].point.y)); // 위도,경도 좌표계
          var utmk = naver.maps.TransCoord.fromLatLngToUTMK(latlng); // 위/경도 -> UTMK
          var tm128 = naver.maps.TransCoord.fromUTMKToTM128(utmk);   // UTMK -> TM128
          var naverCoord = naver.maps.TransCoord.fromLatLngToNaver(latlng); // TM128 -> NAVER

          map.setCenter(myaddr); // 검색된 좌표로 지도 이동
          // 마커 표시
          var marker = new naver.maps.Marker({
            position: myaddr,
            map: map
          });
          var contentString = [
            '<div style="padding:10px;width:300px;font-size:14px;line-height:20px;">',
            '<strong>LatLng</strong> : '+ latlng +'<br />',
            '<strong>UTMK</strong> : '+ utmk +'<br />',
            '<strong>TM128</strong> : '+ tm128 +'<br />',
            '<strong>NAVER</strong> : '+ naverCoord +'<br />',
            '</div>'
            ].join('');
          // 마커 클릭 이벤트 처리
          naver.maps.Event.addListener(marker, "click", function(e) {
            if (infowindow.getMap()) {
                infowindow.close();
            } else {
                infowindow.open(map, marker);

            }
          });

          // 마크 클릭시 인포윈도우 오픈
          var infowindow = new naver.maps.InfoWindow({
              content: contentString
          });
      });
  // var mapDiv = document.getElementById('map'); // 'map' 으로 선언해도 동일
  // var map = new naver.maps.Map(mapDiv);
}
var selected_station;
var post_data;
function setStation(){
  var select_station = document.getElementById('drop1');
  var selected_station = select_station.options[select_station.selectedIndex].text;

  post_data = selected_station;
  console.log(post_data);
}

function setHospital(){
  var select_hospital = document.getElementById('drop2');
  var selected_hospital = select_hospital.options[select_hospital.selectedIndex].text;

  post_data += " " + selected_hospital;
  console.log(post_data);
  getHospital();
}

var markers = [];
var infowindows = [];

function getHospital(){
  var hospital = {hospital : post_data};

  $.ajax({
    url: './php/hospital.php',
    type: 'POST',
    data: hospital,
    dataType: 'json',
    success: function(data) {
      for(var i = 0; i < data.items.length; i++){
        var count=0;
        (function(i) {
          var around_hospital = data.items[i].address;
          naver.maps.Service.geocode({address: around_hospital}, function(status, response) {
            var result = response.result;
            var myaddr = new naver.maps.Point(result.items[0].point.x, result.items[0].point.y);

            var posi = myaddr;
            var marker  = new naver.maps.Marker({
                map : map,
                title : data.items[i].title,
                position : posi,
            });
            var infowindow = new naver.maps.InfoWindow({
                content : '<div style="width:150px;text-align:center;padding:10px;"><b>"'+ data.items[i].title +'"</b>.</div>'
            });
            markers.push(marker);
            infowindows.push(infowindow);

            if(++count == data.items.length)
            {
              naver.maps.Event.addListener(map, 'idle', function() {
                  updateMarkers(map, markers);
              });
            }
          });
        })(i);
      }
    },
    error: function(request, status, error){
      console.log(request, status, error);
    },
  });
}

function updateMarkers(map, markers) {
    var mapBounds = map.getBounds();
    var marker, position;
    for (var i = 0; i < markers.length; i++) {
        marker = markers[i]
        position = marker.getPosition();
        if (mapBounds.hasLatLng(position)) {
            showMarker(map, marker);
        } else {
            hideMarker(map, marker);
        }
    }
}

function showMarker(map, marker) {
    if (marker.setMap()) return;
    marker.setMap(map);
}

function hideMarker(map, marker) {
    if (!marker.setMap()) return;
    marker.setMap(null);
}

// 해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
function getClickHandler(seq) {
    return function(e) {
        var marker = markers[seq],
            infoWindow = infowindows[seq];

        if (infoWindow.getMap()) {
            infoWindow.close();
        } else {
            infoWindow.open(map, marker);
        }
    }
}
