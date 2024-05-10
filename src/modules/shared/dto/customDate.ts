import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'customDateFormat', async: false })
export class CustomDateFormatValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    // 检查值是否为字符串类型，并且符合特定日期格式
    if (typeof value !== 'string') {
      return false;
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'The date format should be in the format "YYYY-MM-DD"';
  }
}

export function IsCustomDateFormat(validationOptions?: any) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CustomDateFormatValidator,
    });
  };
}
