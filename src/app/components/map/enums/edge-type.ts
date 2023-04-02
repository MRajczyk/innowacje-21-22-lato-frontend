/**
 dla ścieżek mamy:
 - jednokierunkowa: 1
 - dwukierunkowa: 2
 - wąska dwukierunkowa: 3
 W przypadku ścieżki jednokierunkowej nie rozróżniamy wąskiej i szerokiej, więc ten przełącznik może być zablokowany.
*/
import {EdgeOptions} from "./edge-options";

export class EdgeType {
  static ONEWAY: number = 1;
  static BIDIRECTIONAL: number = 2;
  static BIDIRECTIONAL_NARROW: number = 3;

  static fromOptions(options: EdgeOptions): number {
    if(!options.bidirectional)
      return EdgeType.ONEWAY;

    if(options.narrow)
      return EdgeType.BIDIRECTIONAL_NARROW;
    else
      return EdgeType.BIDIRECTIONAL;
  }

  static toOptions(type: number, isActive: boolean): EdgeOptions {
    return {
      active: isActive,
      bidirectional: type != EdgeType.ONEWAY,
      narrow: type == EdgeType.BIDIRECTIONAL_NARROW
    };
  }

  static displayedWidth(type: number): number{
    if(type == EdgeType.BIDIRECTIONAL_NARROW || type == EdgeType.ONEWAY)
      return 5;
    else
      return 10;
  }
}
