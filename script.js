// IMPORTANT: replace this with your own Google Apps Script Web App URL
// (see apps-script.gs and README.md for setup instructions)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbynuxMKnr_LqFW0BoozwdFioZorxYOx1VfeEyBUqmpjb7MejcX8aOD_-NUVgmzm7Y8Kww/exec";

const form = document.getElementById("registrationForm");
const eraasoftRadios = document.querySelectorAll('input[name="isEraasoftStudent"]');
const eraasoftFields = document.getElementById("eraasoftFields");
const trainingType = document.getElementById("trainingType");
const trackGroup = document.getElementById("trackGroup");
const trackSelect = document.getElementById("track");
const submitBtn = document.getElementById("submitBtn");
const formMessage = document.getElementById("formMessage");

const TRACKS = {
    Business: ["Data Analysis"],
    Technical: ["Front-end", "Back-end .NET", "Flutter", "UI/UX", "Back-end PHP"]
};

// Show/hide Eraasoft-specific fields
eraasoftRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
        const showFields = e.target.value === "Yes";
        eraasoftFields.classList.toggle("hidden", !showFields);

        const groupCode = document.getElementById("groupCode");
        const branch = document.getElementById("branch");
        const instructor = document.getElementById("instructor");
        [groupCode, branch, instructor].forEach((input) => {
            input.required = showFields;
            if (!showFields) input.value = "";
        });
    });
});

// Populate track options based on training type
trainingType.addEventListener("change", () => {
    const type = trainingType.value;
    const options = TRACKS[type] || [];

    trackSelect.innerHTML = '<option value="" disabled selected>Select track</option>';
    options.forEach((opt) => {
        const el = document.createElement("option");
        el.value = opt;
        el.textContent = opt;
        trackSelect.appendChild(el);
    });

    const show = options.length > 0;
    trackGroup.classList.toggle("hidden", !show);
    trackSelect.required = show;
});

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

    // Training type
    if (!data.trainingType) {
        setError("trainingType", "Please select a training type.");
        isValid = false;
    } else {
        setError("trainingType", "");
    }

    // Track
    if (!data.track) {
        setError("track", "Please select a track.");
        isValid = false;
    } else {
        setError("track", "");
    }

    return isValid;
}

function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    formMessage.classList.remove("hidden");
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!validateForm(data)) {
        showMessage("Please fix the errors above before submitting.", "error");
        return;
    }

    if (SCRIPT_URL.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")) {
        showMessage("Setup incomplete: please add your Google Apps Script URL in script.js.", "error");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    formMessage.classList.add("hidden");

    try {
        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        });

        // "no-cors" mode returns an opaque response, so we cannot verify the
        // actual result — treat a resolved request as success.
        showMessage("Thank you! Your registration has been submitted successfully.", "success");
        form.reset();
        eraasoftFields.classList.add("hidden");
        trackGroup.classList.add("hidden");
    } catch (err) {
        showMessage("Something went wrong while submitting. Please check your internet connection and try again.", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
    }
});
