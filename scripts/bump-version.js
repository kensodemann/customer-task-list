'use strict';

const adjNoun = require('adj-noun');
const fs = require('fs');
const dateFns = require('date-fns');
const packageFile = require('./packageFile');
const semver = require('semver');

const versionFile = './src/assets/version.json';

function getBumpType() {
  const lastArg = process.argv[process.argv.length - 1];
  if (['prerelease', 'prepatch', 'preminor', 'premajor', 'patch', 'minor', 'major'].includes(lastArg)) {
    return lastArg;
  }
  return 'prerelease';
}


function writeVersionFile(pkg) {
  adjNoun.seed(dateFns.getTime(new Date()));
  const version = {
    version: pkg.version,
    name: adjNoun().join(' '),
    date: dateFns.format(new Date(), 'YYYY-MM-DD')
  };
  fs.writeFileSync(versionFile, JSON.stringify(version, null, 2));
  fs.appendFileSync(versionFile, '\n');
}

const type = getBumpType();
const pkg = packageFile.read();
pkg.version = semver.inc(pkg.version, type);
packageFile.write(pkg);
writeVersionFile(pkg);
