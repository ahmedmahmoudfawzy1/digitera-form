const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzukbm1gByfDItDFGzc6jGdVTXhvLEwK4OxKFbMDGY3Eim9dEbsKqzDDfzvxrqiGGBNDg/exec";

document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("registrationForm");
const eraasoftRadios = document.querySelectorAll('input[name="isEraasoftStudent"]');
const eraasoftFields = document.getElementById("eraasoftFields");
const submitBtn = document.getElementById("submitBtn");
const modalOverlay = document.getElementById("modalOverlay");
const modalIcon = document.getElementById("modalIcon");
const modalText = document.getElementById("modalText");
const modalClose = document.getElementById("modalClose");

// Toggles the Eraasoft-only fields (required-ness + visibility)
function toggleEraasoftFields(showFields) {
    eraasoftFields.classList.toggle("hidden", !showFields);

    const groupCode = document.getElementById("groupCode");
    const branch = document.getElementById("branch");
    const instructor = document.getElementById("instructor");
    [groupCode, branch, instructor].forEach((input) => {
        input.required = showFields;
        if (!showFields) input.value = "";
    });
}

// Show/hide Eraasoft-specific fields on change
eraasoftRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
        toggleEraasoftFields(e.target.value === "Yes");
    });
});

// FIX: make sure the initial state is correct on page load
// (in case a radio is pre-checked, e.g. after a failed submit + browser
// autofill/back-forward cache restoring form state).
const checkedRadio = document.querySelector('input[name="isEraasoftStudent"]:checked');
toggleEraasoftFields(checkedRadio ? checkedRadio.value === "Yes" : false);

function setError(fieldId, message) {
    const errorEl = document.getElementById(`err-${fieldId}`);
    const inputEl = document.getElementById(fieldId);
    if (errorEl) errorEl.textContent = message || "";
    if (inputEl) inputEl.classList.toggle("invalid", Boolean(message));
}

function validateForm(data) {
    let isValid = true;

    // Full name
    if (!data.fullName || data.fullName.trim().length < 3) {
        setError("fullName", "Please enter your full name as on your National ID.");
        isValid = false;
    } else {
        setError("fullName", "");
    }

    // Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
        setError("email", "Please enter a valid email address.");
        isValid = false;
    } else {
        setError("email", "");
    }

    // Phone
    const phonePattern = /^01[0125][0-9]{8}$/;
    if (!phonePattern.test(data.phone)) {
        setError("phone", "Please enter a valid Egyptian phone number (11 digits).");
        isValid = false;
    } else {
        setError("phone", "");
    }

    // WhatsApp
    if (!phonePattern.test(data.whatsapp)) {
        setError("whatsapp", "Please enter a valid Egyptian WhatsApp number (11 digits).");
        isValid = false;
    } else {
        setError("whatsapp", "");
    }

    // Age
    const age = Number(data.age);
    if (!age || age < 18 || age > 35) {
        setError("age", "Age must be between 18 and 35.");
        isValid = false;
    } else {
        setError("age", "");
    }

    // National ID
    const nationalIdPattern = /^[0-9]{14}$/;
    if (!nationalIdPattern.test(data.nationalId)) {
        setError("nationalId", "National ID must be exactly 14 digits.");
        isValid = false;
    } else {
        setError("nationalId", "");
    }

    // Governorate
    if (!data.governorate) {
        setError("governorate", "Please select your governorate.");
        isValid = false;
    } else {
        setError("governorate", "");
    }

    // University
    if (!data.university || data.university.trim().length < 2) {
        setError("university", "Please enter your university.");
        isValid = false;
    } else {
        setError("university", "");
    }

    // Faculty
    if (!data.faculty || data.faculty.trim().length < 2) {
        setError("faculty", "Please enter your faculty.");
        isValid = false;
    } else {
        setError("faculty", "");
    }

    // Academic status
    if (!data.academicStatus) {
        setError("academicStatus", "Please select whether you are a student or a graduate.");
        isValid = false;
    } else {
        setError("academicStatus", "");
    }

    // Gender
    if (!data.gender) {
        setError("gender", "Please select your gender.");
        isValid = false;
    } else {
        setError("gender", "");
    }

    // Eraasoft student
    if (!data.isEraasoftStudent) {
        setError("isEraasoftStudent", "Please select an option.");
        isValid = false;
    } else {
        setError("isEraasoftStudent", "");
    }

    if (data.isEraasoftStudent === "Yes") {
        if (!data.groupCode || !data.groupCode.trim()) {
            setError("groupCode", "Please enter your group code.");
            isValid = false;
        } else {
            setError("groupCode", "");
        }
        if (!data.branch || !data.branch.trim()) {
            setError("branch", "Please enter the branch you used to attend.");
            isValid = false;
        } else {
            setError("branch", "");
        }
        if (!data.instructor || !data.instructor.trim()) {
            setError("instructor", "Please enter your instructor's name.");
            isValid = false;
        } else {
            setError("instructor", "");
        }
    }

    // Track
    if (!data.track) {
        setError("track", "Please select a track.");
        isValid = false;
    } else {
        setError("track", "");
    }

    // Military conscription status
    if (!data.conscriptionStatus) {
        setError("conscriptionStatus", "Please select your conscription status.");
        isValid = false;
    } else {
        setError("conscriptionStatus", "");
    }

    // Project link
    const urlPattern = /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i;
    if (!data.projectLink || !urlPattern.test(data.projectLink.trim())) {
        setError("projectLink", "Please enter a valid project link (starting with http:// or https://).");
        isValid = false;
    } else {
        setError("projectLink", "");
    }

    return isValid;
}

const MODAL_STYLES = {
    error: { icon: "✕", classes: "bg-red-100 text-red-600" },
    info: { icon: "ℹ", classes: "bg-brand-100 text-brand-600" },
};

function showModal(text, type = "error") {
    const style = MODAL_STYLES[type] || MODAL_STYLES.error;
    modalText.textContent = text;
    modalIcon.textContent = style.icon;
    modalIcon.className = "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-3xl " + style.classes;
    modalOverlay.classList.remove("hidden");
}

function hideModal() {
    modalOverlay.classList.add("hidden");
}

modalClose.addEventListener("click", hideModal);
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) hideModal();
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!validateForm(data)) {
        showModal("Please fix the highlighted errors before submitting.", "error");
        return;
    }

    if (SCRIPT_URL.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")) {
        showModal("Setup incomplete: please add your Google Apps Script URL in script.js.", "error");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    // URLSearchParams keeps this a "simple" CORS request (no preflight), so we
    // can read the JSON response the Apps Script returns.
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) params.append(key, value);

    try {
        const res = await fetch(SCRIPT_URL, { method: "POST", body: params });

        // FIX: read the raw text first. If the Apps Script deployment is stale,
        // misconfigured, or throws server-side, it often returns an HTML error
        // page instead of JSON — res.json() would throw a confusing parse error
        // that used to get swallowed by the generic catch below. Logging the
        // raw text makes the real cause visible in the console.
        const rawText = await res.text();
        console.log("Apps Script raw response:", rawText);

        let result;
        try {
            result = JSON.parse(rawText);
        } catch (parseErr) {
            console.error("Response was not valid JSON. Check that the Apps Script is deployed as a new version and doPost() returns ContentService JSON.", parseErr);
            showModal("Unexpected response from the server. Please try again or contact support.", "error");
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit";
            return;
        }

        if (result.result === "duplicate") {
            setError("email", "This email is already registered.");
            showModal("This email address has already been used to register. Please use a different email.", "error");
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit";
            return;
        }

        // FIX: only redirect on an explicit success signal instead of assuming
        // "anything that isn't duplicate" means success. Any other result value
        // (e.g. a server-side error) now shows an error instead of silently
        // redirecting to (or failing to reach) success.html.
        if (result.result === "success") {
            window.location.href = "success.html";
        } else {
            console.error("Unexpected result from Apps Script:", result);
            showModal(result.message || "Something went wrong while submitting. Please try again.", "error");
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit";
        }
    } catch (err) {
        // FIX: log the actual error (network failure, CORS block, etc.) so it's
        // visible in the browser console instead of only showing a generic message.
        console.error("Submit request failed:", err);
        showModal("Something went wrong while submitting. Please check your internet connection and try again.", "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
    }
});
});