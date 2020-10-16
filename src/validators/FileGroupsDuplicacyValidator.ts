import ConfigManager from "../ConfigManager";
import FileGroupDistinctItems from "../entities/FileGroupDistinctItems";
import TestBy from "../TestBy";
export default class FileGroupsDuplicacyValidator {
  private configManger: ConfigManager;

  constructor(configManger: ConfigManager) {
    this.configManger = configManger;
  }
 
  public getGroupDuplicateItemeMap(fileGroupDistinctItemsList: FileGroupDistinctItems[], testBy: string): Map<string, Map<string, Map<string, number>>> {
    //Map of reference maps   Map<TestBy, reference map>
    const referenceMaps = new Map<string, Map<string, Map<string, number>>>();
    if (fileGroupDistinctItemsList && fileGroupDistinctItemsList.length > 0) {

      //Map< of key,value or line and map< of files and <line numbers>>>                         
      //                          Map<key|value|line, Map<file name, Set<line numbers>>>
      const keyReferenceMap = new Map<string, Map<string, number>>();
      const valueReferenceMap = new Map<string, Map<string, number>>();
      const lineReferenceMap = new Map<string, Map<string, number>>();

      referenceMaps.set(TestBy.KEY, keyReferenceMap);
      referenceMaps.set(TestBy.VALUE, valueReferenceMap);
      referenceMaps.set(TestBy.LINE, lineReferenceMap);

      fileGroupDistinctItemsList.forEach(fileGroupDistinctItems => {
        this.fillRefrenceMapsBasedOnKey(fileGroupDistinctItems, referenceMaps, testBy);
      });
    }
    return referenceMaps;
  }

  private fillRefrenceMapsBasedOnKey(fileGroupDistinctItems: FileGroupDistinctItems, referenceMap: Map<string, Map<string, Map<string, number>>>, testBy: string) {
    if (fileGroupDistinctItems) {
      switch (testBy) {
        case TestBy.KEY:
          this.putValuesinReferenceMap(fileGroupDistinctItems.keyMap, referenceMap.get(TestBy.KEY), fileGroupDistinctItems.fileName);
          break;
        case TestBy.VALUE:
          this.putValuesinReferenceMap(fileGroupDistinctItems.valueMap, referenceMap.get(TestBy.VALUE), fileGroupDistinctItems.fileName);
          break;
        case TestBy.KEYVALUE:
          this.putValuesinReferenceMap(fileGroupDistinctItems.keyMap, referenceMap.get(TestBy.KEY), fileGroupDistinctItems.fileName);
          this.putValuesinReferenceMap(fileGroupDistinctItems.valueMap, referenceMap.get(TestBy.VALUE), fileGroupDistinctItems.fileName);
          break;
        case TestBy.LINE:
          this.putValuesinReferenceMap(fileGroupDistinctItems.lineMap, referenceMap.get(TestBy.LINE), fileGroupDistinctItems.fileName);
      }
    }
  }
  ///fills the reference map like Map<key|value|line,Map<file name,Set<line numbers>>>
  private putValuesinReferenceMap(valueMap: Map<string, number>, referenceMap: Map<string, Map<string, number>> | undefined, fileName: string) {
    if (valueMap && valueMap.size > 0) {
      valueMap.forEach((linNumber, key) => {
        const isNewKey = !referenceMap?.has(key);
        if (isNewKey) {
          const fileLinesMap = new Map<string, number>();
          fileLinesMap.set(fileName, linNumber);
          referenceMap?.set(key, fileLinesMap);
        } else {
          referenceMap?.get(key)?.set(fileName, linNumber);
        }
      });

    }
  }
}
