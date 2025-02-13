export class DateType extends TypeBuilder {
  static baseData: {};
  constructor(group: any, name: any);
  /**
   * Make it a date only type.
   *
   * @public
   *
   * @returns {DateType}
   */
  public dateOnly(): DateType;
  /**
   * Make it a time only type.
   *
   * @public
   *
   * @returns {DateType}
   */
  public timeOnly(): DateType;
  /**
   * Set as optional and default to new Date()
   *
   * @public
   * @returns {DateType}
   */
  public defaultToNow(): DateType;
  /**
   * Set the minimum date value
   *
   * @param {number|string|Date} value
   * @returns {DateType}
   */
  min(value: number | string | Date): DateType;
  /**
   * Set the max date value
   *
   * @param {number|string|Date} value
   * @returns {DateType}
   */
  max(value: number | string | Date): DateType;
  /**
   * Only allow dates in the future
   *
   * @returns {DateType}
   */
  inTheFuture(): DateType;
  /**
   * Only allow dates in the past
   *
   * @returns {DateType}
   */
  inThePast(): DateType;
}
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=DateType.d.ts.map
