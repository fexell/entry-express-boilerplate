

const StringHelper                          = {}

StringHelper.Capitalize                     = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export {
  StringHelper as default,
}
