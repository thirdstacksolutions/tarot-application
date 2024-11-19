// formattingFunctions.js
export const reformatBirthday = (birthdayString) => {
    const birthday = new Date(birthdayString);

    const formattedBirthday = `${(birthday.getMonth() + 1).toString().padStart(2, '0')}/${birthday
        .getDate()
        .toString()
        .padStart(2, '0')}/${birthday.getFullYear()}`;

    return formattedBirthday;
};

export const formatBirthday = (value) => {
    //  Remove any non-digit characters from the input
    const cleaned = value.replace(/\D/g, '');

    // Apply formatting logic based on the length of the cleaned birthday
    let formattedBirthday = '';
    let error = '';

    for (let i = 0; i < cleaned.length; i++) {
        // Insert '/' at appropriate positions for display only
        if (i === 2 || i === 4) {
            const part = parseInt(cleaned.substring(i - 2, i), 10);
            if (part < 1 || part > (i === 2 ? 12 : 31)) {
                // Invalid month (MM) or day (DD)
                error = 'Invalid month (MM) or day (DD)';
                break;
            }
            formattedBirthday += '/';
        }

        if (i === 7 && cleaned.length === 8) {
            // Validate year range (last 115 years to now)
            const year = parseInt(cleaned.substring(i - 3, i + 1), 10);
            const currentYear = new Date().getFullYear();
            if (year < currentYear - 115 || year > currentYear) {
                // Invalid year
                error = 'Invalid year, must be within the past 115 years';
            } else {
                error = '';
            }
        }

        formattedBirthday += cleaned[i];
    }
    return { formattedBirthday, error };
};

export const formatPhoneNumber = (value) => {
    // Remove any non-digit characters from the input
    const cleaned = value.replace(/\D/g, '');

    // Apply formatting logic based on the length of the cleaned phone number
    let formattedPhoneNumber = '';
    if (cleaned.length > 0) {
        formattedPhoneNumber += '(' + cleaned.substring(0, 3);
    }
    if (cleaned.length > 3) {
        formattedPhoneNumber += ') ' + cleaned.substring(3, 6);
    }
    if (cleaned.length > 6) {
        formattedPhoneNumber += '-' + cleaned.substring(6, 10);
    }

    return formattedPhoneNumber;
};

export const formatBirthdayToISO = (value) => {
    // Remove any non-digit characters from the input
    const cleaned = value.replace(/\D/g, '');

    // Parse the cleaned input to extract month, day, and year
    const month = cleaned.substring(0, 2);
    const day = cleaned.substring(2, 4);
    const year = cleaned.substring(4, 8);

    // Rearrange the components to form the desired format (YYYY-MM-DD)
    const formattedBirthday = `${year}-${month}-${day}T00:00:00`;

    return formattedBirthday;
};

export const checkEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    return emailRegex.test(email);
};

export const checkDiscordHandle = (tag) => {
    tag.toLowerCase();
    const discordTagRegex = /^(?!.*\.\.)[a-zA-Z0-9_.]{2,32}$/;

    return discordTagRegex.test(tag);
};
