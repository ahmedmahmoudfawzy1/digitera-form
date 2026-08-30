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
const modalOverlay = document.getElementById("modalOverlay");
const modalIcon = document.getElementById("modalIcon");
const modalText = document.getElementById("modalText");
const modalClose = document.getElementById("modalClose");

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

    try {
        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        });

        // "no-cors" mode returns an opaque response, so we cannot verify the
        // actual result — treat a resolved request as success.
        window.location.href = "success.html";
    } catch (err) {
        showModal("Something went wrong while submitting. Please check your internet connection and try again.", "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
    }
});
