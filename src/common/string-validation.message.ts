import { ValidationArguments } from 'class-validator';

export const stringValidationMessage = (args: ValidationArguments): string => {
  return `${args.property}에 String을 입력해주세요`;
};
