
const apiUrl = import.meta.env.DEV ? 'http://127.0.0.1:8000/' : 'https://educationorder-bke8f7exgybnbdg6.centralus-01.azurewebsites.net/'

// Toggle chatbot window
const chatbotHeader = document.getElementById('chatbot-header');
const chatbotBody = document.getElementById('chatbot-body');
if (chatbotHeader && chatbotBody) {
    chatbotHeader.addEventListener('click', function () {
        chatbotBody.style.display = (chatbotBody.style.display === 'none' || chatbotBody.style.display === '') ? 'block' : 'none';
    });
}

// Integrate Google Gemini AI via API
const chatbotSendButton = document.getElementById('chatbot-send');
const chatbotInputField = document.getElementById('chatbot-input');
const chatbotMessagesDiv = document.getElementById('chatbot-messages');

if (chatbotSendButton && chatbotInputField && chatbotMessagesDiv) {
    chatbotSendButton.addEventListener('click', function () {
        const userInput = chatbotInputField.value.trim();
        if (userInput !== "") {
            // Append the user's message
            const userMessage = document.createElement('div');
            userMessage.style.textAlign = 'right';
            userMessage.style.margin = '5px';
            userMessage.innerHTML = '<strong>You:</strong> ' + userInput;
            chatbotMessagesDiv.appendChild(userMessage);

            // Append a temporary loading message
            const loadingMessage = document.createElement('div');
            loadingMessage.style.textAlign = 'left';
            loadingMessage.style.margin = '5px';
            loadingMessage.innerHTML = '<strong>Bot:</strong> ...';
            chatbotMessagesDiv.appendChild(loadingMessage);
            chatbotMessagesDiv.scrollTop = chatbotMessagesDiv.scrollHeight;

            // Prepare payload per Gemini documentation
            const payload = {
                contents: [{
                    parts: [{ text: userInput }]
                }]
            };

            // IMPORTANT: Replace with your actual API key or preferably manage securely
            // Using a placeholder key here for demonstration.
            // In a real application, DO NOT expose your API key like this.
            // Use environment variables server-side or secure configuration methods client-side.
            const apiKey = "AIzaSyBimdkgUh-ooOc6RTchwk-bOCsQ5jed0x0"; // Replace with YOUR_API_KEY if testing, but be careful!
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;


            fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(response => {
                    if (!response.ok) {
                        // Try to get more detailed error from the response body
                        return response.json().then(err => {
                            // Extract message if available, otherwise use status text
                            const detail = err.error?.message || response.statusText;
                            throw new Error(`API Error (${response.status}): ${detail}`);
                        }).catch(() => {
                            // If response body isn't JSON or error parsing it
                            throw new Error(`API Error (${response.status}): ${response.statusText}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    // Remove the loading message
                    if (chatbotMessagesDiv.contains(loadingMessage)) {
                        chatbotMessagesDiv.removeChild(loadingMessage);
                    }
                    // Extract generated text (Adjust based on actual Gemini response structure)
                    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";

                    // Display AI response
                    const botMessage = document.createElement('div');
                    botMessage.style.textAlign = 'left';
                    botMessage.style.margin = '5px';
                    // Basic formatting: replace newlines with <br>
                    botMessage.innerHTML = '<strong>Bot:</strong> ' + generatedText.replace(/\n/g, '<br>');
                    chatbotMessagesDiv.appendChild(botMessage);
                    chatbotMessagesDiv.scrollTop = chatbotMessagesDiv.scrollHeight;
                })
                .catch(error => {
                    if (chatbotMessagesDiv.contains(loadingMessage)) {
                        chatbotMessagesDiv.removeChild(loadingMessage);
                    }
                    const errorMessage = document.createElement('div');
                    errorMessage.style.textAlign = 'left';
                    errorMessage.style.margin = '5px';
                    errorMessage.style.color = 'red'; // Make error noticeable
                    errorMessage.innerHTML = '<strong>Bot:</strong> Sorry, an error occurred. (' + error.message + ')';
                    chatbotMessagesDiv.appendChild(errorMessage);
                    chatbotMessagesDiv.scrollTop = chatbotMessagesDiv.scrollHeight;
                    console.error('Error calling Gemini API:', error);
                });

            // Clear the input field.
            chatbotInputField.value = '';
        }
    });

    // Optional: Allow sending message with Enter key
    chatbotInputField.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission if it were in a form
            chatbotSendButton.click();
        }
    });
} else {
    console.error("Chatbot elements not found.");
}


// script.js - Changed initial PFP state (Profile Page Logic)

// --- Global State Variables ---
let isEditing = false;
let savedInterests = ["Mathematics", "Computer Science"];
let currentDisplayYear = new Date().getFullYear();
let currentDisplayMonth = new Date().getMonth();
let calendarNotes = {
    "2024-05-02": "Sprint 5 Code review due",
    "2024-05-15": "Midterm Presentation",
    "2024-04-30": "Meeting with Prof. Vance"
};
let currentPfpSrc = null;

// --- DOM Element References (Scoped within Profile Content if necessary) ---
let profileEditButton, profileUsernameInput, profileDescriptionTextarea,
    profilePicture, profilePictureInput, profilePictureContainer,
    profilePictureOverlay, profilePfpDefaultMessage,
    profileSubjectOptions, profileSubjectInterestContainer,
    profileModalOverlay, profilePfpModal, profileModalCloseButton, profileModalChooseFileButton,
    profileModalDragDropButton, profileModalMessage;
// Tab Widgets (Profile specific)
let profileTabNavContainer, profileTabButtons, profileTabContentPanels;
// Calendar Elements (Profile specific)
let profileCalendarMonthYear, profileCalendarWeekdaysContainer, profileCalendarDaysGrid,
    profilePrevMonthBtn, profileNextMonthBtn;


// --- Core Profile Functions ---
function enableEditing() {
    console.log("Entering Edit Mode (Profile)");
    isEditing = true;
    if (profileUsernameInput) profileUsernameInput.disabled = false;
    if (profileDescriptionTextarea) profileDescriptionTextarea.disabled = false;
    if (profileSubjectOptions) profileSubjectOptions.style.display = 'flex';
    resetPfpOverlayState();
    if (profilePictureContainer) {
        profilePictureContainer.classList.add('editable');
        profilePictureContainer.addEventListener('click', openPfpModal);
    }

    if (profileUsernameInput) profileUsernameInput.style.borderColor = "#ccc";
    if (profileDescriptionTextarea) profileDescriptionTextarea.style.borderColor = "#ccc";
    if (profileEditButton) {
        profileEditButton.textContent = 'Save Changes';
        profileEditButton.removeEventListener('click', enableEditing);
        profileEditButton.addEventListener('click', saveChanges);
    }
    enableSubjectDragging();
}

function saveChanges() {
    console.log("Attempting Save (Profile)...");
    if (profilePictureContainer) {
        profilePictureContainer.removeEventListener('click', openPfpModal);
        profilePictureContainer.classList.remove('editable');
    }

    const username = profileUsernameInput ? profileUsernameInput.value : '';
    const description = profileDescriptionTextarea ? profileDescriptionTextarea.value : '';
    let isValid = true;
    let errorMessages = [];
    if (!isValidUsername(username)) {
        isValid = false; errorMessages.push("Username should not contain special characters or spaces."); if (profileUsernameInput) profileUsernameInput.style.borderColor = "red";
    } else { if (profileUsernameInput) profileUsernameInput.style.borderColor = "#ccc"; }
    const currentWordCount = wordCount(description);
    if (currentWordCount > 75) {
        isValid = false; errorMessages.push(`Description has ${currentWordCount} words (max 75).`); if (profileDescriptionTextarea) profileDescriptionTextarea.style.borderColor = "red";
    } else { if (profileDescriptionTextarea) profileDescriptionTextarea.style.borderColor = "#ccc"; }
    if (!isValid) {
        console.log("Validation Failed (Profile). Errors:", errorMessages);
        alert("Please fix the following errors:\n- " + errorMessages.join("\n- "));
        if (profilePictureContainer) { // Re-enable click listener if validation failed
            profilePictureContainer.addEventListener('click', openPfpModal);
            profilePictureContainer.classList.add('editable');
        }
        return;
    }
    console.log("Validation Passed (Profile). Saving...");
    isEditing = false;
    if (profileUsernameInput) profileUsernameInput.disabled = true;
    if (profileDescriptionTextarea) profileDescriptionTextarea.disabled = true;
    if (profileSubjectOptions) profileSubjectOptions.style.display = 'none';
    if (profileUsernameInput) profileUsernameInput.style.borderColor = "#ccc";
    if (profileDescriptionTextarea) profileDescriptionTextarea.style.borderColor = "#ccc";
    if (profileEditButton) {
        profileEditButton.textContent = 'Edit Profile';
        profileEditButton.removeEventListener('click', saveChanges);
        profileEditButton.addEventListener('click', enableEditing);
    }

    currentPfpSrc = (profilePicture && (profilePicture.src.includes('data:image') || profilePicture.src)) ? profilePicture.src : null;
    console.log("Simulating save of PFP src:", currentPfpSrc ? currentPfpSrc.substring(0, 50) + '...' : 'null');

    resetPfpOverlayState();
    updatePfpVisibility();

    savedInterests = profileSubjectInterestContainer ? Array.from(profileSubjectInterestContainer.children).map(item => item.dataset.subject) : [];
    disableSubjectDragging();
    console.log("Saving profile data:", { username, description, interests: savedInterests });
    alert('Profile changes saved!');
    console.log("Save Complete. Exited Edit Mode (Profile).");
}

// --- Helper & Validation Functions Encho Security (out of bounds) ---
function wordCount(str) { if (!str || typeof str !== 'string' || str.trim() === "") return 0; const matches = str.match(/\S+/g); return matches ? matches.length : 0; }
function isValidUsername(username) { if (!username || typeof username !== 'string') return false; const invalid = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?\s]/; return !invalid.test(username); }
function formatDateKey(year, month, day) { return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; }

// --- Profile Picture Modal Functions ---
function openPfpModal() { if (!isEditing || !profileModalOverlay || !profilePfpModal || !profileModalMessage) return; console.log("Opening PFP Modal (Profile)"); profileModalMessage.textContent = 'How would you like to add a picture?'; profileModalOverlay.style.display = 'block'; profilePfpModal.style.display = 'block'; }
function closePfpModal() { console.log("Closing PFP Modal (Profile)"); if (profileModalOverlay) profileModalOverlay.style.display = 'none'; if (profilePfpModal) profilePfpModal.style.display = 'none'; }
function handleModalChooseFile() { console.log("Modal: Choose File selected (Profile)"); triggerFileInput(); closePfpModal(); }
function handleModalDragDrop() { console.log("Modal: Drag & Drop selected (Profile)"); if (profileModalMessage) profileModalMessage.textContent = 'Close this window and drag your image onto the picture area.'; }

// --- Profile Picture Core Logic ---
function updatePfpVisibility() {
    if (!profilePicture || !profilePfpDefaultMessage) return;
    const hasValidSrc = profilePicture.src && profilePicture.src !== window.location.href && !profilePicture.src.endsWith('/');
    console.log("Updating PFP Visibility (Profile). Has valid src:", hasValidSrc, "Src:", profilePicture.src ? profilePicture.src.substring(0, 30) + '...' : 'null');
    if (hasValidSrc) {
        profilePicture.style.display = 'block'; profilePfpDefaultMessage.style.display = 'none';
    } else {
        profilePicture.style.display = 'none'; profilePfpDefaultMessage.style.display = 'flex';
    }
}
function resetPfpOverlayState() {
    if (!profilePictureOverlay) return;
    profilePictureOverlay.innerHTML = '';
    if (isEditing) {
        console.log("Resetting PFP Overlay for Edit Mode (Profile)");
        const textElement = document.createElement('span'); textElement.textContent = 'Click or Drag'; profilePictureOverlay.appendChild(textElement);
    } else {
        console.log("Resetting PFP Overlay for View Mode - Overlay hidden (Profile)");
    }
}
function triggerFileInput() { console.log("Triggering file input click (Profile)"); if (profilePictureInput) profilePictureInput.click(); }
function handleFile(file) {//Encho security (only image files)
    if (!file || !file.type.startsWith('image/')) { console.warn("handleFile (Profile): Invalid file type or no file.", file); alert("Please select/drop a valid image file (e.g., JPG, PNG, GIF)."); closePfpModal(); return; }
    console.log("Handling valid file (Profile):", file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
        console.log("File read successfully (Profile)");
        if (profilePicture) profilePicture.src = e.target.result; closePfpModal(); updatePfpVisibility();
    };
    reader.onerror = () => { console.error("Error reading file (Profile)."); alert("Error reading file. Please try again."); closePfpModal(); };
    reader.readAsDataURL(file);
}
function handleImageUpload(event) { const file = event.target.files[0]; console.log("File input changed (Profile). File selected:", file ? file.name : 'None (Cancelled)'); if (file) { handleFile(file); } event.target.value = null; }

// --- Profile Picture Drag/Drop Handlers ---
function handlePfpDragOver(e) { e.preventDefault(); if (!isEditing || !profilePictureContainer) return; e.dataTransfer.dropEffect = 'copy'; profilePictureContainer.classList.add('dragover'); }
function handlePfpDragLeave(e) { if (!isEditing || !profilePictureContainer) return; if (e.relatedTarget && profilePictureContainer.contains(e.relatedTarget)) return; profilePictureContainer.classList.remove('dragover'); }
function handlePfpDrop(e) { e.preventDefault(); if (!isEditing || !profilePictureContainer) return; profilePictureContainer.classList.remove('dragover'); const file = e.dataTransfer.files[0]; handleFile(file); closePfpModal(); }

// --- Subject Interest Drag/Drop Functions ---
var draggedSubject = null; // Use var for broader function scope if needed inside listeners
function enableSubjectDragging() {
    if (!profileSubjectOptions || !profileSubjectInterestContainer) return;
    const blocks = document.querySelectorAll('#profile-content .subject-block');
    blocks.forEach(b => { b.draggable = true; b.addEventListener('dragstart', dragStart); b.addEventListener('dragend', dragEnd); });
    [profileSubjectInterestContainer, profileSubjectOptions].forEach(c => { if (c) { c.addEventListener('dragover', dragOver); c.addEventListener('dragenter', dragEnter); c.addEventListener('dragleave', dragLeave); } });
    if (profileSubjectInterestContainer) profileSubjectInterestContainer.addEventListener('drop', dropOnInterestContainer);
    if (profileSubjectOptions) profileSubjectOptions.addEventListener('drop', dropOnOptionsContainer);
    console.log("Subject dragging ENABLED (Profile)");
}
function disableSubjectDragging() {
    if (!profileSubjectOptions || !profileSubjectInterestContainer) return;
    const blocks = document.querySelectorAll('#profile-content .subject-block');
    blocks.forEach(b => { b.draggable = false; b.removeEventListener('dragstart', dragStart); b.removeEventListener('dragend', dragEnd); });
    [profileSubjectInterestContainer, profileSubjectOptions].forEach(c => { if (c) { c.removeEventListener('dragover', dragOver); c.removeEventListener('dragenter', dragEnter); c.removeEventListener('dragleave', dragLeave); c.classList.remove('drag-over'); } });
    if (profileSubjectInterestContainer) profileSubjectInterestContainer.removeEventListener('drop', dropOnInterestContainer);
    if (profileSubjectOptions) profileSubjectOptions.removeEventListener('drop', dropOnOptionsContainer);
    console.log("Subject dragging DISABLED (Profile)");
}
function dragStart(event) { if (!event.target.classList.contains('subject-block')) return; draggedSubject = event.target; event.dataTransfer.setData('text/plain', event.target.dataset.subject); event.dataTransfer.effectAllowed = 'move'; setTimeout(() => { if (draggedSubject) draggedSubject.classList.add('dragging'); }, 0); }
function dragEnd(event) { setTimeout(() => { const currentDragged = document.querySelector('#profile-content .subject-block.dragging'); if (currentDragged) currentDragged.classList.remove('dragging'); if (profileSubjectInterestContainer) profileSubjectInterestContainer.classList.remove('drag-over'); if (profileSubjectOptions) profileSubjectOptions.classList.remove('drag-over'); draggedSubject = null; }, 0); }
function dragOver(event) { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }
function dragEnter(event) { event.preventDefault(); const targetContainer = event.target.closest('#profile-content .subject-interest-container, #profile-content .subject-options'); if (targetContainer && draggedSubject && !targetContainer.contains(draggedSubject)) targetContainer.classList.add('drag-over'); }
function dragLeave(event) { const targetContainer = event.target.closest('#profile-content .subject-interest-container, #profile-content .subject-options'); if (targetContainer && !targetContainer.contains(event.relatedTarget)) targetContainer.classList.remove('drag-over'); if (event.target === profileSubjectInterestContainer || event.target === profileSubjectOptions) event.target.classList.remove('drag-over'); }
function dropOnInterestContainer(event) { event.preventDefault(); const targetContainer = event.target.closest('#profile-content .subject-interest-container'); if (targetContainer && draggedSubject && !targetContainer.contains(draggedSubject)) targetContainer.appendChild(draggedSubject); targetContainer?.classList.remove('drag-over'); }
function dropOnOptionsContainer(event) { event.preventDefault(); const targetContainer = event.target.closest('#profile-content .subject-options'); if (targetContainer && draggedSubject && !targetContainer.contains(draggedSubject)) { targetContainer.appendChild(draggedSubject); sortSubjectOptions(); } targetContainer?.classList.remove('drag-over'); }
function sortSubjectOptions() { if (!profileSubjectOptions) return; const options = Array.from(profileSubjectOptions.children); options.sort((a, b) => a.dataset.subject.localeCompare(b.dataset.subject)); options.forEach(option => profileSubjectOptions.appendChild(option)); }

// --- Profile Tab Switching Functionality ---
function handleProfileTabClick(event) {
    const clickedButton = event.target.closest('#profile-content .widget-tab-button');
    if (!clickedButton || !profileTabButtons || !profileTabContentPanels) return;
    const targetPanelId = clickedButton.dataset.tabTarget; if (!targetPanelId) return;
    profileTabButtons.forEach(button => { button.classList.remove('active'); button.setAttribute('aria-selected', 'false'); });
    profileTabContentPanels.forEach(panel => { panel.classList.remove('active'); });
    clickedButton.classList.add('active'); clickedButton.setAttribute('aria-selected', 'true');
    const targetPanel = document.querySelector(targetPanelId); // Use global querySelector as ID is unique
    if (targetPanel) { targetPanel.classList.add('active'); } else { console.warn("Target profile tab panel not found:", targetPanelId); }
}

// --- Calendar Interaction Functions ---
function handleDayClick(event) {
    const dayCell = event.currentTarget; const dateKey = dayCell.dataset.date; if (!dateKey) return;
    const existingNote = calendarNotes[dateKey] || "";
    const dateParts = dateKey.split('-'); const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
    const note = prompt(`Enter note for ${formattedDate}:`, existingNote);
    if (note !== null) {
        if (note.trim()) { calendarNotes[dateKey] = note.trim(); console.log(`Note saved for ${dateKey}: "${calendarNotes[dateKey]}"`); }
        else { delete calendarNotes[dateKey]; console.log(`Note removed for ${dateKey}`); }
        generateCalendar(currentDisplayYear, currentDisplayMonth);
    }
}
function generateCalendar(year, month) {
    if (!profileCalendarMonthYear || !profileCalendarDaysGrid || !profileCalendarWeekdaysContainer) { console.error("Profile calendar elements not found."); return; }
    const now = new Date(); const currentActualDay = now.getDate(); const currentActualMonth = now.getMonth(); const currentActualYear = now.getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    profileCalendarMonthYear.textContent = `${monthNames[month]} ${year}`;
    const firstDayOfMonth = new Date(year, month, 1).getDay(); const daysInMonth = new Date(year, month + 1, 0).getDate();
    profileCalendarDaysGrid.innerHTML = '';
    // Only generate weekdays if they don't exist
    if (profileCalendarWeekdaysContainer.children.length === 0) {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(day => { const dayElement = document.createElement('div'); dayElement.textContent = day; profileCalendarWeekdaysContainer.appendChild(dayElement); });
    }
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) { const emptyCell = document.createElement('div'); emptyCell.classList.add('calendar-day', 'empty'); profileCalendarDaysGrid.appendChild(emptyCell); }
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div'); dayCell.classList.add('calendar-day'); dayCell.textContent = day;
        const dateKey = formatDateKey(year, month, day); dayCell.dataset.date = dateKey;
        if (day === currentActualDay && month === currentActualMonth && year === currentActualYear) { dayCell.classList.add('today'); }
        if (calendarNotes[dateKey]) { dayCell.classList.add('has-note'); dayCell.setAttribute('title', calendarNotes[dateKey]); }
        dayCell.addEventListener('click', handleDayClick);
        profileCalendarDaysGrid.appendChild(dayCell);
    }
    console.log(`Profile calendar generated for ${monthNames[month]} ${year}`);
}

// --- Profile Initialization ---
function initializeProfile() {
    // Use querySelector within #profile-content to scope DOM element references
    const profileContentDiv = document.getElementById('profile-content');
    if (!profileContentDiv) {
        console.error("Profile content container (#profile-content) not found. Profile script cannot initialize.");
        return;
    }

    // Assign references using the profile container as the base
    profileEditButton = profileContentDiv.querySelector('#editButton');
    profilePicture = profileContentDiv.querySelector('#profilePicture');
    profilePictureInput = profileContentDiv.querySelector('#profilePictureInput');
    profilePictureContainer = profileContentDiv.querySelector('.profile-picture-container');
    profilePictureOverlay = profileContentDiv.querySelector('.profile-picture-overlay');
    profilePfpDefaultMessage = profileContentDiv.querySelector('#pfpDefaultMessage');
    profileUsernameInput = profileContentDiv.querySelector('#username');
    profileDescriptionTextarea = profileContentDiv.querySelector('#description');
    profileSubjectOptions = profileContentDiv.querySelector('#subjectOptions');
    profileSubjectInterestContainer = profileContentDiv.querySelector('#subjectInterestContainer');
    // Modals are often better globally, but querySelector from profileContentDiv works if they are *inside* it
    profileModalOverlay = profileContentDiv.querySelector('#modalOverlay');
    profilePfpModal = profileContentDiv.querySelector('#pfpModal');
    profileModalCloseButton = profileContentDiv.querySelector('#modalCloseButton');
    profileModalChooseFileButton = profileContentDiv.querySelector('#modalChooseFileButton');
    profileModalDragDropButton = profileContentDiv.querySelector('#modalDragDropButton');
    profileModalMessage = profileContentDiv.querySelector('#modalMessage');

    // Profile Tab Widgets References
    profileTabNavContainer = profileContentDiv.querySelector('.widget-tab-nav');
    profileTabButtons = profileContentDiv.querySelectorAll('.widget-tab-button');
    profileTabContentPanels = profileContentDiv.querySelectorAll('.widget-tab-content'); // These IDs should be unique globally anyway

    // Profile Calendar References
    profileCalendarMonthYear = profileContentDiv.querySelector('#calendar-month-year');
    profileCalendarWeekdaysContainer = profileContentDiv.querySelector('#calendar-weekdays-container');
    profileCalendarDaysGrid = profileContentDiv.querySelector('#calendar-days-grid');
    profilePrevMonthBtn = profileContentDiv.querySelector('#prev-month-btn');
    profileNextMonthBtn = profileContentDiv.querySelector('#next-month-btn');

    // Basic check for essential profile elements
    // Added checks for null before accessing properties/methods
    if (!profileEditButton || !profilePictureContainer || !profilePfpModal || !profilePfpDefaultMessage || !profileTabNavContainer || !profileTabButtons || profileTabButtons.length === 0 || !profileCalendarMonthYear || !profileCalendarWeekdaysContainer || !profileCalendarDaysGrid || !profilePrevMonthBtn || !profileNextMonthBtn) {
        console.error("Initialization failed (Profile): Essential DOM elements missing within #profile-content. Check IDs and structure.");
        return; // Stop initialization if critical elements are missing
    }

    // --- Load Initial Profile State ---
    updatePfpVisibility();
    resetPfpOverlayState();
    disableSubjectDragging();
    sortSubjectOptions();

    // Move pre-selected interests only if containers exist
    if (profileSubjectOptions && profileSubjectInterestContainer) {
        savedInterests.forEach(interest => {
            const block = profileSubjectOptions.querySelector(`.subject-block[data-subject="${interest}"]`);
            if (block) profileSubjectInterestContainer.appendChild(block);
        });
    }


    // --- Setup Profile Event Listeners (Check for null before adding listeners) ---
    if (profileEditButton) profileEditButton.addEventListener('click', enableEditing);
    if (profilePictureInput) profilePictureInput.addEventListener('change', handleImageUpload);
    if (profilePictureContainer) {
        profilePictureContainer.addEventListener('dragover', handlePfpDragOver);
        profilePictureContainer.addEventListener('dragleave', handlePfpDragLeave);
        profilePictureContainer.addEventListener('drop', handlePfpDrop);
    }

    // Profile Modal Listeners
    if (profileModalCloseButton) profileModalCloseButton.addEventListener('click', closePfpModal);
    if (profileModalOverlay) profileModalOverlay.addEventListener('click', closePfpModal); // Overlay click closes modal
    if (profileModalChooseFileButton) profileModalChooseFileButton.addEventListener('click', handleModalChooseFile);
    if (profileModalDragDropButton) profileModalDragDropButton.addEventListener('click', handleModalDragDrop);

    // Profile Tab Navigation Listener
    if (profileTabNavContainer) { profileTabNavContainer.addEventListener('click', handleProfileTabClick); }

    // Profile Calendar Navigation Listeners
    if (profilePrevMonthBtn) profilePrevMonthBtn.addEventListener('click', () => {
        currentDisplayMonth--; if (currentDisplayMonth < 0) { currentDisplayMonth = 11; currentDisplayYear--; } generateCalendar(currentDisplayYear, currentDisplayMonth);
    });
    if (profileNextMonthBtn) profileNextMonthBtn.addEventListener('click', () => {
        currentDisplayMonth++; if (currentDisplayMonth > 11) { currentDisplayMonth = 0; currentDisplayYear++; } generateCalendar(currentDisplayYear, currentDisplayMonth);
    });

    // Ensure initial profile tab state is correct
    if (profileTabButtons.length > 0 && profileTabContentPanels.length > 0) {
        let activeTabFound = false;
        profileTabButtons.forEach(button => {
            const targetPanelId = button.dataset.tabTarget;
            // Check if targetPanelId is valid before querying
            if (targetPanelId) {
                const targetPanel = document.querySelector(targetPanelId); // Use global selector as IDs should be unique
                if (button.classList.contains('active')) {
                    button.setAttribute('aria-selected', 'true');
                    if (targetPanel) targetPanel.classList.add('active');
                    activeTabFound = true;
                } else {
                    button.setAttribute('aria-selected', 'false');
                    if (targetPanel) targetPanel.classList.remove('active'); // Ensure others are inactive
                }
            } else {
                console.warn("Profile tab button missing data-tab-target:", button);
            }
        });
        // Ensure first tab is active if none were marked initially and it has a target
        if (!activeTabFound && profileTabButtons[0]) {
            const firstButton = profileTabButtons[0];
            const firstPanelId = firstButton.dataset.tabTarget;
            if (firstPanelId) {
                const firstPanel = document.querySelector(firstPanelId);
                if (firstPanel) {
                    firstButton.classList.add('active');
                    firstButton.setAttribute('aria-selected', 'true');
                    firstPanel.classList.add('active');
                } else {
                    console.warn("First profile tab's target panel not found:", firstPanelId);
                }
            } else {
                console.warn("First profile tab button missing data-tab-target:", firstButton);
            }
        }
    }


    // Generate the calendar for the initial month
    generateCalendar(currentDisplayYear, currentDisplayMonth);

    console.log("Profile Editor Initialized");
}

// --- Run Profile Initialization (Only when the profile section is made visible, or on initial load if needed) ---
let profileInitialized = false;

// --- NEW SCRIPT FOR MAIN TAB SWITCHING ---

const homeTab = document.getElementById('home-tab');
const profileTab = document.getElementById('profile-tab');
const ordersTab = document.getElementById('orders-tab'); // Keep reference if needed later
const authTab = document.getElementById('auth-tab');
const homeContent = document.getElementById('home-content');
const profileContent = document.getElementById('profile-content');
const authContent = document.getElementById('auth-content')

const allTabs = [homeTab, profileTab, ordersTab, authTab];
const allContent = [homeContent, profileContent, authContent]; // Add more content divs here if needed

function showContent(contentToShow) {
    allContent.forEach(content => {
        if (content) { // Check if element exists
            content.style.display = (content === contentToShow) ? 'block' : 'none';
        }
    });
}

function setActiveTab(tabToActivate) {
    allTabs.forEach(tab => {
        if (tab) { // Check if element exists
            tab.classList.toggle('active', tab === tabToActivate);
        }
    });
}

if (homeTab && homeContent) {
    homeTab.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent any default link behavior if it were an <a>
        setActiveTab(homeTab);
        showContent(homeContent);
    });
} else {
    console.warn("Home tab or content element missing. Home tab functionality disabled.");
}

if (profileTab && profileContent) {
    profileTab.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent any default link behavior if it were an <a>
        setActiveTab(profileTab);
        showContent(profileContent);
        // Initialize profile script only the first time it's shown
        if (!profileInitialized) {
            console.log("Initializing profile script for the first time.");
            initializeProfile();
            profileInitialized = true;
        } else {
            console.log("Profile script already initialized.");
        }
    });
} else {
    console.warn("Profile tab or content element missing. Profile tab functionality disabled.");
}

if (authTab && authContent) {
    authTab.addEventListener('click', (e) => {
        e.preventDefault()
        setActiveTab(authContent)
        showContent(authContent)
    })
}

// Ensure initial state is correct (Home tab active, Home content visible)
if (homeTab && homeContent && profileContent) {
    // setActiveTab(homeTab);
    // showContent(homeContent);
} else {
    console.error("Could not set initial tab state - critical elements missing (homeTab, homeContent, or profileContent).");
    // Fallback: Try to show home if possible, or log the issue prominently
    if (homeContent) homeContent.style.display = 'block';
    if (profileContent) profileContent.style.display = 'none';
}


const authRadioLogin = document.querySelector('#auth-radio-login')
const authRadioRegistration = document.querySelector('#auth-radio-registration')

authRadioLogin && authRadioLogin.addEventListener('click', () => {
    document.querySelector('.login-content').style.display = 'block'
    document.querySelector('.registration-content').style.display = 'none'
})

authRadioRegistration && authRadioRegistration.addEventListener('click', () => {
    document.querySelector('.login-content').style.display = 'none'
    document.querySelector('.registration-content').style.display = 'block'
})

// dang nhap
document.querySelector('.login-content form')?.addEventListener('submit', (e) => {
    e.preventDefault()
    e.stopPropagation()
    // console.log(e.target.email.value)
    const email = e.target.email.value;
    const password = e.target.password.value

    console.log(apiUrl )
    fetch(apiUrl + 'api/users/login/', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email, password
        })
    }).then(e => {
        if (e.ok) alert('login success')
        else throw new Error()
    })
    .catch(() => {
        alert("login faile")
    })
})

// tao tai khoan
document.querySelector('.registration-content form').addEventListener('submit', (e) => {
    e.preventDefault()
    e.stopPropagation()

    const first_name = e.target.first_name.value
    const last_name = e.target.last_name.value
    const email = e.target.email.value
    const password = e.target.password.value

    fetch(apiUrl + '/api/users/register/', {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            first_name, last_name, email, password, confirm_password: password
        })
    }).then(e => {
        if (e.ok) alert('register success')
        else throw new Error()
    })
    .catch(() => {
        alert("register faile")
    })

})
// If the profile page is loaded directly, initialize immediately
if (window.location.pathname.includes('pages/profile.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        if (!profileInitialized) {
            initializeProfile();
            profileInitialized = true;
        }
    });
}
console.log('ok')