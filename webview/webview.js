var map;

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
}

function onSuccessGeolocation(position) {
    var location = new naver.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);

    map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
    map.setZoom(10); // 지도의 줌 레벨을 변경합니다.

    infowindow.setContent('<div style="padding:20px;">' +
        'latitude: '+ location.lat() +'<br />' +
        'longitude: '+ location.lng() +'</div>');

    infowindow.open(map, location);
}

function onErrorGeolocation() {
    var center = map.getCenter();

    infowindow.setContent('<div style="padding:20px;">' +
        '<h5 style="margin-bottom:5px;color:#f00;">Geolocation failed!</h5>'+ "latitude: "+ center.lat() +"<br />longitude: "+ center.lng() +'</div>');

    infowindow.open(map, center);
}


// function getMapElement() {
//   var HOME_PATH = window.HOME_PATH || '.';
//     var myaddress = document.getElementById("myinput").value;// 도로명 주소나 지번 주소만 가능 (건물명 불가!!!!)
//     var map = new naver.maps.Map('map',{
//         scaleControl: false,
//           logoControl: false,
//           mapDataControl: false,
//           zoomControl: true,
//           minZoom: 1
//     });
//       naver.maps.Service.geocode({address: myaddress}, function(status, response) {
//           if (status !== naver.maps.Service.Status.OK) {
//               return alert(myaddress + '의 검색 결과가 없거나 기타 네트워크 에러');
//           }
//           var result = response.result;
//           // 검색 결과 갯수: result.total
//           // 첫번째 결과 결과 주소: result.items[0].address
//           // 첫번째 검색 결과 좌표: result.items[0].point.y, result.items[0].point.x
//           var myaddr = new naver.maps.Point(result.items[0].point.x, result.items[0].point.y);
//           var latlng = new naver.maps.LatLng((result.items[0].point.x),(result.items[0].point.y)); // 위도,경도 좌표계
//           var utmk = naver.maps.TransCoord.fromLatLngToUTMK(latlng); // 위/경도 -> UTMK
//           var tm128 = naver.maps.TransCoord.fromUTMKToTM128(utmk);   // UTMK -> TM128
//           var naverCoord = naver.maps.TransCoord.fromLatLngToNaver(latlng); // TM128 -> NAVER
//
//           map.setCenter(myaddr); // 검색된 좌표로 지도 이동
//           // 마커 표시
//           var marker = new naver.maps.Marker({
//             position: myaddr,
//             map: map
//           });
//           var contentString = [
//             '<div style="padding:10px;width:300px;font-size:14px;line-height:20px;">',
//             '<strong>LatLng</strong> : '+ latlng +'<br />',
//             '<strong>UTMK</strong> : '+ utmk +'<br />',
//             '<strong>TM128</strong> : '+ tm128 +'<br />',
//             '<strong>NAVER</strong> : '+ naverCoord +'<br />',
//             '</div>'
//             ].join('');
//           // 마커 클릭 이벤트 처리
//           naver.maps.Event.addListener(marker, "click", function(e) {
//             if (infowindow.getMap()) {
//                 infowindow.close();
//             } else {
//                 infowindow.open(map, marker);
//
//             }
//           });
//
//           // 마크 클릭시 인포윈도우 오픈
//           var infowindow = new naver.maps.InfoWindow({
//               content: contentString
//           });
//       });
//   // var mapDiv = document.getElementById('map'); // 'map' 으로 선언해도 동일
//   // var map = new naver.maps.Map(mapDiv);
// }
