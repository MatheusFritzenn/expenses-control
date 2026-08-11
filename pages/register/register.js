/*firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        window.location.href = "../home/home.html";
    }
})*/

function goToLoginPage() {
    window.location.href = "../../index.html";
}

function onBlurEmail() {
    const email  = form.email().value;

    form.emailRequiredError().style.display = email ? "none" : "block";
    form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block";
    toggleRegisterButtonDisable();
}

function onBlurSenha() {
    const senha  = form.password().value;

    form.passwordRequiredError().style.display = senha ? "none" : "block";
    form.passwordInvalidError().style.display = senha.length >= 6 ? "none" : "block";
    toggleRegisterButtonDisable();
}

function onBlurConfirmarSenha() {
    const senha = form.password().value;
    const confirmarSenha = form.confirmPassword().value;

    form.passwordDoenstMatchError().style.display = confirmarSenha === senha ? "none" : "block";
    toggleRegisterButtonDisable();
}

function toggleRegisterButtonDisable() {
    form.registerButton().disabled = !isFormValid()
}

function isFormValid(){
    const email = form.email().value;
    const password = form.password().value;
    const confirmPassword = form.confirmPassword().value; 
 
    if (!email || !validateEmail(email)) {
        return false;
    } else
    if (!password || password.length < 6) {
        return false;
    } else
    if (password != confirmPassword) {
        return false;
    } 

    return true;
}

function register() {
    showLoading();

    const email = form.email().value;
    const password = form.password().value;
    firebase.auth().createUserWithEmailAndPassword(
        email, password
    ).then(() => {
        hideLoading();
        window.location.href = "../home/home.html";
    }).catch(error => {
        hideLoading();
        alert(getErrorMessage(error));
    })
}

const form = {
    email: () => document.getElementById("email"),
    password: () => document.getElementById("password"),
    confirmPassword: () => document.getElementById("confirmPassowrd"),
    emailInvalidError: () => document.getElementById("email-invalid-error"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    passwordInvalidError: () => document.getElementById("password-min-length-error"),
    passwordRequiredError: () => document.getElementById("password-required-error"),
    passwordDoenstMatchError: () => document.getElementById("password-doenst-match-error"),
    registerButton: () => document.getElementById("register-button")
}