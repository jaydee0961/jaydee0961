
// =====================================
// JJCC RAILWAYS - LOGIN SYSTEM
// =====================================

// 1. SUPABASE CONFIGURATION
const SUPABASE_URL = "https://ckykcejjmrcjcaiorikd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Tv7ZwN3fd9miokDU9CHcVA_MW5N4bKP";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// 2. GET HTML ELEMENTS
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("message");

// 3. SHOW / HIDE PASSWORD
document.getElementById("togglePassword").addEventListener("click", function () {

    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    this.textContent = isPassword ? "Hide" : "Show";

});

// 4. DISPLAY MESSAGE
function showMessage(text, type) {
    message.textContent = text;
    message.className = "message " + type;
}

// 5. LOGIN FUNCTION
loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    loginButton.disabled = true;
    loginButton.textContent = "SIGNING IN...";

    showMessage("", "");

    try {

        // Authenticate through Supabase
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        const user = data.user;

        // Retrieve account profile and role
        const { data: profile, error: profileError } =
            await supabaseClient
                .from("profiles")
                .select("full_name, role")
                .eq("id", user.id)
                .single();

        if (profileError || !profile) {

            await supabaseClient.auth.signOut();

            throw new Error("Account profile not found. Contact your administrator.");

        }

        // Redirect according to assigned role
        if (profile.role === "user") {

            window.location.href = "dashboard.html";

        } else if (profile.role === "admin") {

            window.location.href = "dashboard.html";

        } else if (profile.role === "super_admin") {

            window.location.href = "dashboard.html";

        } else {

            await supabaseClient.auth.signOut();

            throw new Error("Invalid account role.");

        }

    } catch (error) {

        showMessage(error.message, "error");

    } finally {

        loginButton.disabled = false;
        loginButton.textContent = "SIGN IN";

    }

});

// 6. FORGOT PASSWORD
document.getElementById("forgotPassword").addEventListener("click", async function (event) {

    event.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {

        showMessage("Please enter your email address first.", "error");
        return;

    }

    try {

        const { error } = await supabaseClient.auth.resetPasswordForEmail(email);

        if (error) throw error;

        showMessage("Password reset instructions have been sent to your email.", "success");

    } catch (error) {

        showMessage(error.message, "error");

    }

});
