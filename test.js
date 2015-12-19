#!/usr/bin/env node
var test = require('bandage');
var join = require('path').join;
var fs = require('fs');
var cp = require('child_process');
var semver = require('semver');
var async = require('async');

const base = ['tournament', 'tourney'];
const tournaments = ['duel', 'ffa', 'groupstage', 'masters', 'tiebreaker'];
const tourneys = [
  'ffa-tb',
  'groupstage-tb',
  'groupstage-tb-duel',
];
const impls = tournaments.concat(tourneys)

const helpers = [
  'duel-names',
  'group',
  'roundrobin'
]

const deps = base.concat(impls).concat(helpers)
const extras = [
  'autonomy',
  'interlude',
  'operators',
  'smell',
  'subset',
  'sulfur'
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
        return err2 ? reject(err2) : resolve(res);
      });
    });
  });
};


var latestTag = function (name, cb) {
  return new Promise((res) => {
    var cmd = 'cd ' + __dirname + '/' + name + ' && git tag -l | tail -n 1';
    cp.exec(cmd, (err, out) => {
      if (err) {
        throw err;
      }
      var version = out.slice(0, -1); // slice away newline character in output
      res({name, version});
    });
  });
};


// Versions should be up to date and depend on latest minor for sane dedupe bundling
test('versions and tags', function *(t) {
  var jsons = yield getJsons(__dirname);
  var canonicals = jsons.reduce((acc, el) => {
    acc[el.data.name] = el.data.version;
    return acc;
  }, {});

  deps.forEach((dep) => {
    t.ok(canonicals[dep], 'canonical version of ' + dep + ' is ' + canonicals[dep]);
  });

  // Ensure all dependencies are stupidly up to date:
  jsons.forEach((json) => {
    Object.keys(json.data.dependencies).forEach((key) => {
      var qualifier = json.data.dependencies[key];
      if (deps.indexOf(key) >= 0) {
        var requirement = json.data.name + ' requires ' + key + ' ' + qualifier;
        requirement += ' (currently at ' + canonicals[key] + ')';
        t.ok(semver.satisfies(canonicals[key], qualifier), requirement);
        // verify same minor
        var reqminor = new semver.Range(qualifier).set[0][0].semver.minor;
        var actualminor = semver.minor(canonicals[key]);
        t.equal(reqminor, actualminor, json.data.name + ' requires ' + key + ' at right minor');
      }
    });
  });

  // Ensure we have actually published the up to date versions (tag present):
  var tags = yield Array.from(deps.map(latestTag));
  tags.forEach(el => {
    t.ok(el.version, el.name + ' has a tag for ' + el.version);
    var v = el.version.slice(1); // strip leading 'v'
    t.equal(v, canonicals[el.name], el.name + ' latest tag is equal to its json ver');
  });
});

// Some things not enforced by class hierarchy, but should for consistency:
test('Common interface', function *(t) {
  tournaments.forEach(m => {
    var Klass = require('./' + m + '/');
    // Each tournament class should export an `Id` class
    // TODO: need this be uniformly true for tourneys? - should we export it for bases?
    t.type(Klass.Id, 'function', m + ' has Id class exposed');
  });
});
