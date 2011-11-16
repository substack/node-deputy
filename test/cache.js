var test = require('tap').test;
var deputy = require('../');
var fs = require('fs');
var crypto = require('crypto');

test('cache with new file', function (t) {
    var ps = []; for (var i = 0; i < 10; i++) {
        ps.push(Math.floor(Math.random() * (1<<30)).toString(16));
    }
    var file = '/tmp/' + ps.join('/') + '.json';
    var detective = deputy(file);
    
    var src = [
        [
            'require("a"); require("b")',
            { strings : ['a','b'], expressions : [] }
        ]
    ];
    t.deepEqual(detective.find(src[0][0]), src[0][1]);
    
    setTimeout(function () {
        fs.readFile(file, function (err, body) {
            t.deepEqual(
                src.reduce(function (acc,s) {
                    acc[hash(s[0])] = s[1];
                    return acc;
                }, {}),
                JSON.parse(body)
            );
            t.end();
        });
    }, 100);
    
    function hash (src) {
        return new crypto.Hash('md5').update(src).digest('hex');
    }
});
