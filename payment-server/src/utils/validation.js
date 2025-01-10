function validateRequiredFields(fields) {
    for (const field of fields) {
        if (!field.value || field.value.trim() === '') {
            return `${field.name} is required.`;
        }
    }
    return null;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : 'Invalid email format.';
}

function validateAmount(amount) {
    if (isNaN(amount) || amount <= 0) {
        return 'Amount must be a positive number.';
    }
    return null;
}

module.exports = {
    validateRequiredFields,
    validateEmail,
    validateAmount,
};