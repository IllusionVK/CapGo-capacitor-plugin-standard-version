export const readVersion = contents => {
  const marketingVersionString = contents.match(/String PLUGIN_VERSION = "(.*)";/);
  const version = marketingVersionString.toString();
  return version;
};

export const writeVersion = (contents, version) => {
  const newContent = contents.replace(
    /String PLUGIN_VERSION = ".*";/g,
    `String PLUGIN_VERSION = "${version}";`
  );
  return newContent;
};
