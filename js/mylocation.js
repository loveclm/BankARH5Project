/*
    Usage in html
 <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=WOR15aX870MejqbOtiNH15rWL3COZxxR"></script>
 <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
 <script src="./js/mylocation.js"></script>

 <div id="container"></div>

 */


var map = null;
var geolocation =  null;
var walking = null;
var timer = null;

//var tagetPoint =new BMap.Point( 124.15,39.866667);
//var centerPoint =new BMap.Point( 124.15,39.866667);
var tagetPoint =new BMap.Point(120.2162672176,30.2439083354);
var centerPoint =new BMap.Point(120.2162672176,30.2439083354);
var interval = 3000;
var zoom = 15;

var index = 0;  //for test
$(document).ready(function(){

    map = new BMap.Map("container");
    geolocation = new BMap.Geolocation();

    map.centerAndZoom(centerPoint, zoom);
    if (!timer) {
        take_location();
        timer = setInterval( take_location, interval );
    }
});

function take_location() {
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var curPoint = r.point;

            ///// For test ///
            //curPoint.lat += index * 0.1;
            //console.log(curPoint);
            //index++;
            ////////

            if(walking) map.clearOverlays();
            walking = new BMap.WalkingRoute(map, {renderOptions:{map: map, autoViewport: true}});
            walking.search(curPoint, tagetPoint);

        } else {
            alert('??????~');
        }
    },{enableHighAccuracy: true});
}

