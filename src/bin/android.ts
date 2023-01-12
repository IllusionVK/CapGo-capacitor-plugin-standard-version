const regexAndroid = /String\sPLUGIN_VERSION\s=\s"(.*)";/g;

export function readVersion(contents) {
  const marketingVersionString = contents.match(regexAndroid);
  const version = marketingVersionString
    ? marketingVersionString[0].replace(regexAndroid, '$1')
    : null;
  return version;
}

export function writeVersion(contents, version) {
  const newContent = contents.replace(regexAndroid, `String PLUGIN_VERSION = "${version}";`);
  return newContent;
}
