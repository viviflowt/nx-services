/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export const IsEqualTo = (
  property: string,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  return (object: any, propertyName: string): void => {
    registerDecorator({
      name: 'IsEqualTo',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments): boolean {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments): string {
          const [relatedPropertyName] = args.constraints;
          return `${relatedPropertyName} must be equal to ${args.property}`;
        },
      },
    });
  };
};
