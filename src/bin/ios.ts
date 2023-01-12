const regexIos = /let\sPLUGIN_VERSION:\sString\s=\s"(.*)"/g;
export function readVersion(contents) {
  const marketingVersionString = contents.match(regexIos);
  const version = marketingVersionString ? marketingVersionString[0].replace(regexIos, '$1') : null;
  return version;
}

export function writeVersion(contents, version) {
  const newContent = contents.replace(regexIos, `let PLUGIN_VERSION = "${version}"`);
  return newContent;
}
