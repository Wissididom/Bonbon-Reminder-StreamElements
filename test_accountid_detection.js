function isStreamElementsAccountId(str) {
  return /^[a-fA-F0-9]{24}$/.test(str);
}

function isTwitchLoginName(str) {
  return /^[A-Za-z0-9_]{4,25}$/.test(str);
}

function identifyString(str) {
  if (isStreamElementsAccountId(str)) {
    return "StreamElements Account ID";
  }
  if (isTwitchLoginName(str)) {
    return "Twitch login name";
  }
  return "Unknown";
}

const string1 = "mytwitchusername123";
const string2 = "61217b3a0d8750c896c1d951";
const string3 = "a";
const string4 = "äöüäöü";

const test1 = identifyString(string1);
const test2 = identifyString(string2);
const test3 = identifyString(string3);
const test4 = identifyString(string4);

console.log(`${string1}: ${test1}`);
console.log(`${string2}: ${test2}`);
console.log(`${string3}: ${test3}`);
console.log(`${string4}: ${test4}`);
