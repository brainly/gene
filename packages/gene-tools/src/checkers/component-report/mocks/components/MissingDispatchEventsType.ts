export enum MissingDispatchEventsType {
  ON_DIV_CLICK = 'BrnOnDivClick',
  ON_OTHER_DIV_CLICK = 'BrnOnOtherDivClick',
}

export type ClickEvent = [MissingDispatchEventsType.ON_DIV_CLICK];
export type OtherClickEvent = [MissingDispatchEventsType.ON_OTHER_DIV_CLICK];
