import validator from "validator";

interface IdataPatternItem {
  data: any;
  dataType: string;
  isOptional?: boolean;
}

export const isValid = ({ data, tableSchema, isUpdating }) => {
  let message = "";
  let validity = Object.keys(data).every((key) => {
    if (tableSchema[key] === undefined) {
      message = `${key} is excesive.`;
      return false;
    }
    const [dataVildity, validationMessage] = isDataItemValid(
      data[key],
      tableSchema[key],
      isUpdating
    );

    if (!dataVildity) {
      message = validationMessage;
      return false;
    }
    return true;
  });

  return [validity, message];
};

const isDataItemValid = (data, columnSchema, isUpdating): [boolean, string] => {
  //check not null
  if (columnSchema.Null === "NO") {
    if (isUpdating === false) {
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
      console.log(data);
      
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
    case type.includes("text"):
      return [
        typeof data === "string",
        `${columnSchema.Field} must be a string.`,
      ];
      break;
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
