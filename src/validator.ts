import validator from "validator";

interface IdataPatternItem {
  data: any;
  dataType: string;
  isOptional?: boolean;
}

export const isValid = ({ data, tableSchema, checkNulls }) => {
  let message = "";
  let validity = Object.keys(data).every((key) => {
    if (tableSchema[key] === undefined) {
      message = `${key} is excesive.`;
      return false;
    }
    const [dataVildity, validationMessage] = isDataItemValid(
      data[key],
      tableSchema[key],
      checkNulls
    );

    if (!dataVildity) {
      message = validationMessage;
      return false;
    }
    return true;
  });

  return [validity, message];
};

export const isDataItemValid = (
  data,
  columnSchema,
  isCheckingNotNulls
): [boolean, string] => {
  //check not null
  if (columnSchema.Null === "NO") {
    if (isCheckingNotNulls === true) {
      if (data === undefined || data === null || data === "") {
        return [false, `${columnSchema.Field} must not be empty.`];
      }
    } else {
      if (data === null || data === "") {
        return [false, `${columnSchema.Field} must not be empty.`];
      }
    }
  } else {
    if (data === undefined || data === null) {
      return [true, ""];
    }
  }

  // check varchars
  const type = columnSchema.Type;
  if (type.includes("varchar")) {
    let length = Number(type.replace("varchar(", "").replace(")", ""));
    if (typeof data !== "string") {
      return [false, `${columnSchema.Field} must be a string.`];
    }
    if (data.length > length) {
      return [
        false,
        `${columnSchema.Field} must not be longer than ${length} character.`,
      ];
    }
    switch (columnSchema.Field) {
      case "firstname":
      case "lasttname":
        return [
          validator.isAlpha(data),
          "firstname and lastname should only have alphabetical characters",
        ];
        break;
      case "email":
        return [
          validator.isEmail(data),
          "Please provide a valid email address.",
        ];
        break;
      default:
        return [
          typeof data === "string",
          `${columnSchema.Field} must be a string.`,
        ];
        break;
    }
  }

  //check the rest of things
  switch (true) {
    case type.includes("date"):
      return [validator.isDate(data), `${columnSchema.Field} must be a date.`];
      break;
    case type.includes("decimal"):
      return [
        typeof data === "number",
        `${columnSchema.Field} must be a numebr.`,
      ];
      break;
    case type.includes("int"):
      return [
        typeof data === "number" && Number.isInteger(data),
        `${columnSchema.Field} must be a integer number.`,
      ];
      break;
    case type.includes("boolean"):
      return [
        typeof data === "boolean",
        `${columnSchema.Field} value must be either true of false.`,
      ];
      break;
  }
  return [false, "Something went wrong in the validation!"];
};

// export const isAllValidOld = (dataPatternArray: IdataPatternItem[]) => {
//   return dataPatternArray.every((dataPatternItem) => isValid(dataPatternItem));
// };

// export const isValidOld = ({
//   data,
//   dataType,
//   isOptional,
// }: IdataPatternItem) => {
//   if (
//     !isOptional &&
//     (data === undefined || data === null || data === "" || data.length === 0)
//   ) {
//     return false;
//   }
//   switch (dataType) {
//     case "string":
//       return typeof data === "string";
//     case "email":
//       console.log(validator.isEmail(data));
//       return validator.isEmail(data);
//     case "alpha":
//       console.log(validator.isAlpha(data));
//       return validator.isAlpha(data);
//     case "alphanumeric":
//       console.log(validator.isAlphanumeric(data));
//       return validator.isAlphanumeric(data);
//     case "numeric":
//       console.log(validator.isNumeric(data));
//       return validator.isNumeric(data);
//     case "date":
//       console.log(validator.isDate(data));
//       return validator.isDate(data);
//     case "decimal":
//       console.log(validator.isDecimal(data));
//       return validator.isDecimal(data);
//     case "int":
//       console.log(validator.isInt(data));
//       return validator.isInt(data);
//     default:
//       return false;
//   }
// };
