#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import Config from './entities/Config';
import FileDuplicateFinder from "./FileDuplicateFinder";
import FileGroupDuplicateFinder from "./FileGroupDuplicateFinder";
import LogUtil from "./LogUtil";

function logSilently(totalDuplicatesMessage: string, fileDuplicateMessage: string, groupDuplicateMessage: string) {
  LogUtil.error(totalDuplicatesMessage);
  if (fileDuplicateMessage) {
    LogUtil.error(fileDuplicateMessage);
  }
  if (groupDuplicateMessage) {
    LogUtil.error(groupDuplicateMessage);
  }
  LogUtil.log('');
}

function validate(args: string[]) {
  const isFileArgProvided = args.includes('file');
  const isGroupArgProvided = args.includes('group');

  const isSilenceRequired = args.includes('silent');

  const isFilesValidationRequired = isFileArgProvided || !isGroupArgProvided;
  const isGroupsValidationRequired = isGroupArgProvided || !isFileArgProvided;

  let totalFileDuplicates = 0;
  let totalGroupsDuplicates = 0;
  if (isFilesValidationRequired) {
    LogUtil.info('Validating individual files');
    const fileDuplicateFinder = new FileDuplicateFinder();
    totalFileDuplicates = fileDuplicateFinder.findDuplicatesInFiles();
    LogUtil.log('');
  }

  if (isGroupsValidationRequired) {
    LogUtil.info('Validating file groups');
    const fileGroupDuplicateFinder = new FileGroupDuplicateFinder();
    totalGroupsDuplicates = fileGroupDuplicateFinder.findDuplicatesInGroups();
    LogUtil.log('');
  }

  const duplicateCount = totalFileDuplicates + totalGroupsDuplicates;

  if (duplicateCount == 0) {
    LogUtil.success('No duplicates found');
    LogUtil.log('');
  } else {

    const totalDuplicatesMessage = `${duplicateCount} duplicates found`;
    let fileDuplicateMessage = '';
    let groupDuplicateMessage = '';

    if (totalFileDuplicates > 0) {
      fileDuplicateMessage = `${totalFileDuplicates} ${duplicateCount > 1 ? 'duplicates' : 'duplicate'} found in individual files`;
    }
    if (totalGroupsDuplicates > 0) {
      groupDuplicateMessage = `${totalGroupsDuplicates} ${totalGroupsDuplicates > 1 ? 'duplicates' : 'duplicate'} found across file groups`;
    }
    if (isSilenceRequired) {
      logSilently(totalDuplicatesMessage, fileDuplicateMessage, groupDuplicateMessage);
    } else {
      LogUtil.error('');
      const error = `${totalDuplicatesMessage} \n ${fileDuplicateMessage} \n ${groupDuplicateMessage}`;
      throw new Error(error);
    }
  }
}
function createConfigFileIfNotExists(fileName: string): void {
  try {
    const fullName = path.resolve(fileName);
    if (!fs.existsSync(fullName)) {
      let data = JSON.stringify(new Config(), null, 2);
      data = data.replace('"src": {}', '"src": ["./"]');
      fs.writeFileSync(fullName, data, 'utf-8');
    }
  } catch (error) {
    console.log(error);
  }
}
function main() {
  var args = process.argv && process.argv.length > 2 ? process.argv.slice(2) : [];
  const isInitArgProvided = args.includes('init');
  if (isInitArgProvided) {
    createConfigFileIfNotExists('unival.json');
  } else {
    validate(args);
  }
}

main();