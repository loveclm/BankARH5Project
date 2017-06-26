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
var tagetPoint =new BMap.Point( 120.2162672176, 30.2439083354);
var centerPoint =new BMap.Point( 120.2162672176, 30.2439083354);
var interval = 3000;
var zoom = 15;
var previousPoint = null;
var index = 0;  //for test
$(document).ready(function(){

    map = new BMap.Map("container");
    geolocation = new BMap.Geolocation();
    map.enableScrollWheelZoom();
    map.enableContinuousZoom();

    map.centerAndZoom(centerPoint, zoom);
/*
    var overlays = [];
    var overlaycomplete = function(e){
        overlays.push(e.overlay);
    };
    var styleOptions = {
        strokeColor:"red",    //边线颜色。
        fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    }

    //实例化鼠标绘制工具
    var drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        //enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
        },
        circleOptions: styleOptions, //圆的样式
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        rectangleOptions: styleOptions //矩形的样式
    });

    //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', overlaycomplete);

*/

    if (!timer) {
        take_location();
        timer = setInterval( take_location, interval );
    }
});

function take_location() {
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var curPoint = r.point;
            var distance = 0;
            ///// For test ///
            //curPoint.lat += index * 0.1;
            //console.log(curPoint);
            //index++;

            //  curPoint.lat = 30.2844280000;
             //  curPoint.lng = 120.0371370000;

               //curPoint.lat = 30.2440880000;
              // curPoint.lng = 120.2168520000;

            if(previousPoint != null) {

                distance = map.getDistance(curPoint,previousPoint);
            }

            //console.log(distance);
            //console.log(map.getDistance(curPoint,tagetPoint));
            ////////

            if(previousPoint == null || distance > 100){

                if(walking) map.clearOverlays();
                walking = new BMap.WalkingRoute(map, {renderOptions:{map: map, autoViewport: true}});
                walking.search(curPoint, tagetPoint);

                walking.setSearchCompleteCallback(function(){
                    var pts = walking.getResults().getPlan(0).getRoute(0).getPath();

                    var polyline = new BMap.Polyline(pts, {strokeColor:"green", strokeWeight:4, strokeOpacity:0.5, strokeStyle:"solid"});
                    map.addOverlay(polyline);

                });


                previousPoint = curPoint;
            }
        }
    },{enableHighAccuracy: true});
}

