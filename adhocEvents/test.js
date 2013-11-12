var arr2 = [{id: 1},{id: 2},{id: 3}];
var arr1 = [{id: 1},{id: 4},{id: 5}];

function union(arr1, arr2) {
  var union = arr1.concat(arr2);
  for(var i = 0; i < arr1.length; i++) {
  	console.log("in: " + union[i]);
    for(var j = arr1.length; j < union.length; j++) {
      if (union[i].id=== union[j].id) {
      	console.log("spilicing: " + union[i]);
        union.splice(j,1);
      }
    }
  }
  return union;
}

console.log(union(arr1,arr2));
console.log(arr1);