#!/usr/bin/env node
var test = require('bandage');
var join = require('path').join;
var fs = require('fs');
var semver = require('semver');
var async = require('async');

const deps = [
  // core
  'duel',
  'duel-names',
  'ffa',
  'ffa-tb',
  'group',
  'groupstage',
  'groupstage-tb',
  'groupstage-tb-duel',
  'masters',
  'roundrobin',
  'tiebreaker',
  'tournament',
  'tourney',
  // helpers
  //'autonomy',
  //'interlude',
  //'operators',
  //'smell',
  //'subset',
  //'sulfur'
];

var getJson = function (pth, cb) {
  var pkgjson = join(pth, 'package.json');
  fs.exists(pkgjson, function (exists) {
    if (exists) {
      fs.readFile(pkgjson, function (err, data) {
        cb(err, err ? null : { path: pth, data: JSON.parse(data) });
      });
    }
    else {
      cb(null, null); // no error but no package.json
    }
  });
};

var getJsons = function (dir) {
  return new Promise(function (resolve, reject) {
    fs.readdir(dir, function (err, data) {
      if (err) {
        return reject(err);
      }
      var paths = data.filter(pth => deps.indexOf(pth) >= 0)
                      .map(str => join(dir, str));

      async.map(paths, getJson, function (err2, res) {
        return err ? reject(err2) : resolve(res);
      });
    });
  });
};

test('latest published', function *(t) {
  var jsons = yield getJsons(__dirname);
  var canonicals = jsons.reduce((acc, el) => {
    acc[el.data.name] = el.data.version;
    return acc;
  }, {});

  deps.forEach((dep) => {
    t.ok(canonicals[dep], 'canonical version of ' + dep);
  });

  jsons.forEach((json) => {
    Object.keys(json.data.dependencies).forEach((key) => {
      var qualifier = json.data.dependencies[key];
      if (deps.indexOf(key) >= 0) {
        t.ok(semver.satisfies(canonicals[key], qualifier), key + ' ' + qualifier);
      }
    });
  });

});

