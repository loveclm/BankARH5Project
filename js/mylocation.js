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

var thres_alert = 100.000;
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

            //lng, lat
            //alert(JSON.stringify(curPoint));

            ///// For test ///
            //curPoint.lat += index * 0.1;
            //console.log(curPoint);
            //index++;
            ////////

            if(walking) map.clearOverlays();
            walking = new BMap.WalkingRoute(map, {renderOptions:{map: map, autoViewport: true}});
            walking.search(curPoint, tagetPoint);

            walking.setSearchCompleteCallback(function(){
                var pts = walking.getResults().getPlan(0).getRoute(0).getPath();

                var minDist = 99, minPtId = -1;
                for(var i = 0; i < pts.length-1; i++){
                    var line = [];
                    line.push(pts[i]);
                    line.push(pts[i+1]);
                    var vDist = getVerticalDistance(curPoint, line);
                    if(vDist < minDist){
                        minDist = vDist;
                        minPtId = i;
                    }
                }

                if(minPtId >= 0 && minDist > thres_alert){
                    alert('minId: '+ minPtId + ', minDist: '+ minDist);
                    map.addOverlay(new BMap.Polyline([curPoint, pts[minPtId]], {strokeColor: "#000000",strokeOpacity:0.75,strokeWeight:4,enableMassClear:true}));
                }

                var pathstr = JSON.stringify(pts);
                //alert(pathstr);
            });

        } else {
            alert('??????~');
        }
    },{enableHighAccuracy: true});
}

function getVerticalDistance(pt, line){
    var x1, y1, x2, y2;
    var px, py;

    px = pt.lng;
    py = pt.lat;
    x1 = line[0].lng;
    y1 = line[0].lat;
    x2 = line[1].lng;
    y2 = line[1].lat;

    var a, b, c;
    a = y2 - y1;
    b = x1 - x2;
    c = -(a*x1 + b*y1);

    if(a == 0 && b == 0){
        return 99;
    }

    var d1, d2, d;
    d1 = getDist(pt, line[0]);
    d2 = getDist(pt, line[1]);
    d = getDist(line[0], line[1]);

    var angle1, angle2;
    angle1 = Math.acos((d1*d1 + d*d - d2*d2)/(2*d1*d));
    angle2 = Math.acos((d2*d2 + d*d - d1*d1)/(2*d*d2));

    if(angle1 > Math.PI / 2 || angle2 > Math.PI / 2) return 99;

    var dist = Math.abs(a*px + b*py + c) / Math.sqrt(a*a + b*b);
    return dist;
}

function getDist(pt1, pt2){
    return Math.sqrt((pt1.lng-pt2.lng)*(pt1.lng-pt2.lng) + (pt1.lat-pt2.lat)*(pt1.lat-pt2.lat));
}

