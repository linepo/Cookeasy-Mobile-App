angular.module('starter.filters', [])

.filter('range', function () {
  return function(val, range) {
    range = parseInt(range);
    for (var i=0; i<range; i++)
    val.push(i);
    return val;
  };
})

.filter('orderObjectBy', function() {
  return function(items, field, order) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(order === -1) filtered.reverse();
    return filtered;
  };
})

.filter('secondsToDateTime', function(){
  return function(seconds) {
    var d = new Date(0,0,0,0,0,0,0);
    d.setSeconds(seconds);
    return d;
  };
})

.filter('formatImg', function(){
  return function(img,w,h) {
    var url = 'http://res.cloudinary.com/hqk7wz0oa/image/upload/';
    if(w && h) url += 'c_fill,h_'+h+',w_'+w+'/';
    url += img+'.jpg';
    return url;
  };
})

.filter('ageFromDob', function(){
  return function(dob){
    var ageDifMs = Date.now() - dob;
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
});
