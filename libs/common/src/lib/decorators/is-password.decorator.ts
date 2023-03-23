import { registerDecorator, ValidationOptions } from 'class-validator';
import f from 'lodash/fp';

export function IsPassword(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'isPassword',
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return /^[\d!#$%&*@A-Z^a-z]*$/.test(f.toString(value));
        },
        defaultMessage() {
          return 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
        },
      },
    });
  };
}
