import * as android from './android';
import * as ios from './ios';

import standardVersion from '@capgo/standard-version';
import command from '@capgo/standard-version/command';
import { readFileSync } from 'fs';
import { readdir } from 'fs/promises';
import merge from 'merge-deep';
import { extname } from 'path';

const findByExtension = async (dir, ext) => {
  const matchedFiles = [];

  const files = await readdir(dir);

  for (const file of files) {
    // Method 1:
    const fileExt = extname(file);

    if (fileExt === `.${ext}`) {
      // remove extname
      const noExt = file.replace(fileExt, '');
      matchedFiles.push(noExt);
    }
  }

  return matchedFiles;
};

const findPathPlugin = async () => {
  const files = await findByExtension('./ios/Plugin', 'm');
  if (!files || !files[0]) {
    throw new Error('File ending by .m not found in ios/Plugin, cannot guess your plugin name');
  }
  const fileName = files[0];
  const iosPath = `./ios/Plugin/${fileName}.swift`;

  const fileAndroid = './android/build.gradle';
  const contentsAndroid = readFileSync(fileAndroid, 'utf8');
  const resultMatchAndroid = contentsAndroid.match(/namespace\s"(.*)"/g);
  if (!resultMatchAndroid || !resultMatchAndroid[0]) {
    throw new Error('Namespace not found in android/build.gradle, cannot guess your plugin name');
  }
  const resultAndroid =
    resultMatchAndroid && resultMatchAndroid[0]
      ? resultMatchAndroid[0].replace(/namespace "(.*)"/g, '$1')
      : null;
  const foldersPath = resultAndroid.split('.').join('/');
  const androidPath = `./android/src/main/java/${foldersPath}/${fileName}.java`;
  return { iosPath, androidPath };
};

const baseConfig = {
  noVerify: true,
  tagPrefix: '',
  packageFiles: [
    {
      filename: './package.json',
      type: 'json',
    },
  ],
  bumpFiles: [
    {
      filename: '',
      updater: android,
    },
    {
      filename: '',
      updater: ios,
    },
    {
      filename: './package.json',
      type: 'json',
    },
    {
      filename: './package-lock.json',
      type: 'json',
    },
  ],
};

async function run() {
  try {
    // merge base config with user config
    const { iosPath, androidPath } = await findPathPlugin();
    baseConfig.bumpFiles[0].filename = androidPath;
    baseConfig.bumpFiles[1].filename = iosPath;
    const finalConfig = merge(command.argv, baseConfig);
    await standardVersion(finalConfig);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

run();
