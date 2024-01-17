export default async function testRecaptcha(captcha) {
    if (!captcha) {
        throw Error("captcha code is empty");
    }

    // Ping the google recaptcha verify API to verify the captcha code you received
    const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
            },
            method: "POST",
        }
    );
    const captchaValidation = await response.json();
    if (captchaValidation.success) {
        return true;
    }

    throw new Error(captchaValidation["error-codes"]);
}
