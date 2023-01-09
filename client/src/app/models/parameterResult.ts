//import {Parameter} from "./parameter";

export class ParameterResult {

  id: number;
  type: string | null = '';

  boolResult: boolean | null = false;
  intResult: number | null = -1;
  strResult: string | null = '';
  arrayResult: { type: string, value: string }[] | null = null;
  //arrayResult: Map<string, string> | null = null;
  //arrayResult: { val: string | null, linkTitle: string | null }[] | null = [];

  constructor(
    id: number = -1,
    type: string | null = null,
    br: boolean | null = null,
    ir: number | null = null,
    sr: string | null = null,
    ar: { type: string, value: string }[] | null = null,
    //ar: Map<string, string> | null = null,
    //ar: { val: string | null, linkTitle: string | null }[] | null = null
  ) {
      this.id = id;
      this.type = type;

      this.boolResult = br;
      this.intResult = ir;
      this.strResult = sr;
      this.arrayResult = ar;
  }
}
