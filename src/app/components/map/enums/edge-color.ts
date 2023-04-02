/**
 dla ścieżek mamy:
 - jednokierunkowa: 1
 - dwukierunkowa: 2
 - wąska dwukierunkowa: 3
 W przypadku ścieżki jednokierunkowej nie rozróżniamy wąskiej i szerokiej, więc ten przełącznik może być zablokowany.
*/
import {EdgeOptions} from "./edge-options";
import {EdgeType} from "./edge-type";

export class EdgeColor {
  static DEFAULT: string = '#00E5AE'
  static INACTIVE: string = '#FF0000';
  static ONEWAY: string = '#ffdf00';
  static NARROW: string = '#008e6b';

  static fromOptions(options: EdgeOptions): string {
    if(!options.active)
      return EdgeColor.INACTIVE;

    if(!options.bidirectional)
      return EdgeColor.ONEWAY;

    if(options.narrow)
      return EdgeColor.NARROW;
    else
      return EdgeColor.DEFAULT;
  }

  static fromType(type: number, isActive: boolean): string {
    if(!isActive)
      return EdgeColor.INACTIVE;

    if(type == EdgeType.ONEWAY)
      return EdgeColor.ONEWAY;

    if(type == EdgeType.BIDIRECTIONAL_NARROW)
      return EdgeColor.NARROW;

    return EdgeColor.DEFAULT;
  }
}
