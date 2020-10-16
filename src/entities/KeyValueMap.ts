/**
 * @author Bilal Syed
 * @email syedbilal228@gmail.com
 * @create date 2020-09-20
 * @modify date 2020-09-20
 * @desc Defines 0 base distinct key, value, keyvalue or line within a file
 */
export default class KeyValueMap {

	private _keyMap: Map<string, number>;
	private _valueMap: Map<string, number>;


	public get keyMap(): Map<string, number> {
		return this._keyMap;
	}
	public get valueMap(): Map<string, number> {
		return this._valueMap;
	}
	
	constructor() {
		this._keyMap = new Map<string, number>();
		this._valueMap = new Map<string, number>();
	}

}