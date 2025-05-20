import { DEFAULT_PROPS } from "./util.js";

export class Property {
	constructor(name){
		this.name = name;
		this.value = DEFAULT_PROPS[name];
	}
}