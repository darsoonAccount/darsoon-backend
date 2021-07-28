import validator from "validator";

interface IdataPatternItem {
  data: any;
  dataType: string;
  isOptional?: boolean;
}

export const isValid = ({ data, tableSchema, checkNulls }) => {
  return Object.keys(data).every((key) => {
    if (tableSchema[key] === undefined) {
      return false;
    }
    return isDataItemValid(data[key], tableSchema[key], checkNulls);
  });
};

export const isDataItemValid = (data, columnSchema, isCheckingNotNulls) => {
  if (
    (isCheckingNotNulls === true &&
      columnSchema.Null === "NO" &&
      data === undefined) ||
    data === null ||
    data === ""
  ) {
    return false;
  }
  const type = columnSchema.Type;
  if (type.includes("varchar")) {
    let length = Number(type.replace("varchar(", "").replace(")", ""));
    if (typeof data !== "string" || data.length > length) {
      return false;
    }

    switch (columnSchema.Field) {
      case "firstname":
      case "lasttname":
        return validator.isAlpha(data);
        break;
      case "email":
        return validator.isEmail(data);
        break;
      default:
        return typeof data === "string";
        break;
    }
  }
  switch (true) {
    case type.includes("date"):
      return validator.isDate(data);
      break;
    case type.includes("decimal"):
      return typeof data === "number";
      break;
    case type.includes("int"):
      return typeof data === "number" && Number.isInteger(data);
      break;
    case type.includes("boolean"):
      return typeof data === "boolean";
      break;
  }
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
