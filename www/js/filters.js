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
});
