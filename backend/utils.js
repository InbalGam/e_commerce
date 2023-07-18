function validateEmail(inputField) {
    const isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputField);
    return isValid;
};

module.exports = {
    validateEmail
};