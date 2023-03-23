/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transform } from 'class-transformer';
import f from 'lodash/fp';

export function Trim(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      return f.pipe(f.toString, f.trim)(value);
    },
    { toClassOnly: true }
  );
}

export function ToLower(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      return f.pipe(f.toString, f.toLower)(value);
    },
    { toClassOnly: true }
  );
}

export function ToUpper(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      return f.pipe(f.toString, f.toUpper)(value);
    },
    { toClassOnly: true }
  );
}

export function ToBoolean(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      return f.pipe(f.toString, f.toLower, Boolean)(value);
    },
    { toClassOnly: true }
  );
}

export function ToNumber(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      return f.pipe(f.toString, f.toNumber)(value);
    },
    { toClassOnly: true }
  );
}

export function ToArray(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      return Array.isArray(value) ? value : [value];
    },
    { toClassOnly: true }
  );
}

export function ToInteger(): PropertyDecorator {
  return Transform(({ value }) => f.pipe(f.toString, f.toInteger)(value), {
    toClassOnly: true,
  });
}
