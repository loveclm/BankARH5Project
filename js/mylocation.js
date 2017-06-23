/*
    Usage in html
 <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=WOR15aX870MejqbOtiNH15rWL3COZxxR"></script>
 <script type="text/javascript" src="https://developer.baidu.com/map/jsdemo/demo/convertor.js"></script>
 <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
 <script src="./js/mylocation.js"></script>

 <div id="container"></div>

 */

var map = null;
var geolocation =  null;
var walking = null;
var timer = null;
var existName = false;
var currentName = '';

//var tagetPoint =new BMap.Point( 124.15,39.866667);
//var centerPoint =new BMap.Point( 124.15,39.866667);

//var tagetPoint =new BMap.Point( 124.1545929229,39.8915775852); // dandong
var tagetPoint =new BMap.Point( 120.2162672176, 30.2439083354); // hangzou
var currentPoint = null;
var zoom = 15;
var geocoder = null;
$(document).ready(function(){
    map = new BMap.Map("container");
    geolocation = new BMap.Geolocation();
    geocoder = new BMap.Geocoder();
    map.centerAndZoom(tagetPoint, zoom);
    var point = tagetPoint;
    map.enableScrollWheelZoom();
    map.enableContinuousZoom();


    var marker1 = new BMap.Marker(point);
    map.addOverlay(marker1);
    marker1.addEventListener("click", function(){
        if(existName){
            var start = {
                //name:"东港市教育局"
                name: currentName
            }
            var end = {
                //name:"百盛商城"
                name:"东杭大厦"
            }

            var opts = {
                mode:BMAP_MODE_WALKING,
               // region:"东港"
                region:"杭州"
            }

            var ss = new BMap.RouteSearch();
            ss.routeCall(start, end, opts);
        }
    });

    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            currentPoint = r.point;
            geocoder.getLocation(currentPoint, function(address){
                existName = true;
                currentName = address.address;
                console.log(currentName);

                var opts = {
                    width : 400,
                    height: 70,
                    title : "杭州银行"
                    //  title : currentName
                }
                var infoWindow = new BMap.InfoWindow("点击marker将进入路线查询，并直接跳转到webapp主站", opts);
                map.openInfoWindow(infoWindow,tagetPoint);
            });

            //BMap.Convertor.translate(r.point,0,translateCallback);


        }
    },{enableHighAccuracy: true});


});