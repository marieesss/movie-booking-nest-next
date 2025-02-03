function generateToken(user){
    // Convert object into string
    const stringifyObj = JSON.stringify(user)
    // convert string to base64
    const b64Str = btoa(stringifyObj)

    return b64Str
}

const newUser ={
    name : "Marie", 
    surname : "Espinosa",
    age : 14
}
const token = generateToken(newUser)
console.log(token)