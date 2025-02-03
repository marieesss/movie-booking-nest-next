function decryptToken(token){
    // Convert token into stringified object
    const stringifyObj = atob(token)

    // convert string to object
    const object  = JSON.parse(stringifyObj)

    return object
}

const token  = "eyJuYW1lIjoiTWFyaWUiLCJzdXJuYW1lIjoiRXNwaW5vc2EiLCJhZ2UiOjE0fQ=="
const user = decryptToken(token)
console.log(user)