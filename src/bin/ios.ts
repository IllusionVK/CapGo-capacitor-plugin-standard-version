export const readVersion = contents => {
  const marketingVersionString = contents.match(/let PLUGIN_VERSION = "(.*)"/);
  const version = marketingVersionString.toString();
  return version;
};

export const writeVersion = (contents, version) => {
  const newContent = contents.replace(
    /let PLUGIN_VERSION = ".*"/g,
    `let PLUGIN_VERSION = "${version}"`
  );
  return newContent;
};
