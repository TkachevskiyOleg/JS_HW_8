function addMessage(event) {
    event.preventDefault();

    const userName = document.getElementById('userName').value;
    const userMessage = document.getElementById('userMessage').value;

    if (userName && userMessage) {
        const messagesList = document.getElementById('messages');
        const newMessageItem = document.createElement('li');
        newMessageItem.innerHTML = `<strong>${userName}:</strong> ${userMessage}`;
        messagesList.appendChild(newMessageItem);

        document.getElementById('userName').value = '';
        document.getElementById('userMessage').value = '';
    } else {
        alert('Please enter both your name and message.');
    }
}


function submitQuiz() {
    const correctAnswers = {
        question1: '5',
        question2: '5',
        question3: '3.14'
    };

    let score = 0;

    for (const question in correctAnswers) {
        const selectedOption = document.querySelector(`input[name="${question}"]:checked`);

        if (selectedOption) {
            const userAnswer = selectedOption.value;
            if (userAnswer === correctAnswers[question]) {
                score++;
            }
        }
    }

    const resultContainer = document.getElementById('result');
    resultContainer.textContent = `Your score: ${score} out of ${Object.keys(correctAnswers).length}`;
}

function applyStyles() {
    const inputTextArea = document.getElementById('inputTextArea');
    const fontSize = document.getElementById('fontSize').value + 'px';
    const fontWeight = document.getElementById('fontWeight').value;
    const fontStyle = document.getElementById('fontStyle').value;
    const textAlign = document.getElementById('textAlign').value;
    const fontColor = document.getElementById('fontColor').value;

    inputTextArea.style.fontSize = fontSize;
    inputTextArea.style.fontWeight = fontWeight;
    inputTextArea.style.textDecoration = (fontStyle === 'underline') ? 'underline' : 'none';
    inputTextArea.style.fontStyle = (fontStyle === 'italic') ? 'italic' : 'normal';
    inputTextArea.style.textAlign = textAlign;
    inputTextArea.style.color = fontColor;
}


let book;

function selectBook(button) {
    const bookDiv = button.parentNode;
    const selectedBookTitle = bookDiv.getAttribute('data-title');
    book = selectedBookTitle;
}

function submitOrder() {
    const quantity = document.getElementById('quantity').value;
    const name = document.getElementById('name').value;
    const deliveryDate = document.getElementById('deliveryDate').value;
    const deliveryAddress = document.getElementById('deliveryAddress').value;
    const comment = document.getElementById('comment').value;

    const currentDate = new Date().toISOString().split('T')[0];
    if (deliveryDate < currentDate) {
        alert('The date cannot be in the past.');
        return;
    }

    const orderSummary = document.getElementById('orderSummary');
    orderSummary.innerHTML = `
        <p>${name}, thank you for your order.</p>
        <p>"${book}" product quantity  ${quantity} copy(s) will be delivered to: ${deliveryAddress} ${deliveryDate}</p>
        <p>Comment: ${comment}</p>
    `;
}



let editingIndex = null;

const studentsList = {
    group1: ["Student1", "Student2", "Student3"],
    group2: ["Student4", "Student5", "Student6"]
};

const lectureCounts = {
    group1: 3,
    group2: 4
};

const attendanceDataKey = 'attendanceData';
let attendanceData = JSON.parse(localStorage.getItem(attendanceDataKey)) || [];


function markAttendance() {
    const groupSelect = document.getElementById('group');
    const lectureSelect = document.getElementById('lecture');
    const topicInput = document.getElementById('topic');
    const checkboxes = document.querySelectorAll(`input[name="student_${groupSelect.value}"]:checked`);

    const group = groupSelect.value;
    const lecture = lectureSelect.value;
    const topic = topicInput.value;

   

    const present = [];
    checkboxes.forEach(checkbox => {
        present.push(checkbox.value);
    });

    attendanceData.push({
        group: group,
        lecture: lecture,
        topic: topic,
        present: present
    });

    localStorage.setItem(attendanceDataKey, JSON.stringify(attendanceData));

    groupSelect.value = 'group1';


    lectureSelect.value = 1;
    topicInput.value = '';

    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    displayAttendanceData();

    editingIndex = null;
}


function displayAttendanceData() {
    const tableBody = document.querySelector('#attendanceTable tbody');

    if (tableBody) {
        tableBody.innerHTML = '';

        attendanceData.forEach((data, index) => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = data.group;
            row.insertCell().textContent = data.lecture;
            row.insertCell().textContent = data.topic;
            const presentCell = row.insertCell();

            data.present.forEach(name => {
                presentCell.appendChild(document.createTextNode(name));
                presentCell.appendChild(document.createElement('br'));
            });

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editAttendance(index));
            row.insertCell().appendChild(editButton);
        });
    } else {
        console.error("Element #attendanceTable tbody not found.");
    }
}

function editAttendance(index) {

    if (editingIndex !== null) {
        alert('Please finish editing the current entry before editing another.');
        return;
    }

    editingIndex = index;

    const dataToEdit = attendanceData[index];

    document.getElementById('group').value = dataToEdit.group;
    document.getElementById('lecture').value = dataToEdit.lecture;
    document.getElementById('topic').value = dataToEdit.topic;

    const students = studentsList[dataToEdit.group];

    students.forEach(student => {
        const checkbox = document.querySelector(`#studentsCheckboxList input[value="${student}"]`);
        if (checkbox) {
            checkbox.checked = dataToEdit.present.includes(student);
        }
    });

    attendanceData.splice(index, 1);

    displayAttendanceData();
}

function generateStudentCheckboxes() {
    const groupSelect = document.getElementById('group');

    if (groupSelect) {
        const selectedGroup = groupSelect.value;

        const studentsCheckboxList = document.getElementById('studentsCheckboxList');
        studentsCheckboxList.innerHTML = '';

        const students = studentsList[selectedGroup];
        students.forEach(student => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = `student_${selectedGroup}`;
            checkbox.value = student;
            studentsCheckboxList.appendChild(checkbox);
            studentsCheckboxList.appendChild(document.createTextNode(student));
            studentsCheckboxList.appendChild(document.createElement('br'));
        });

        const lastAttendance = attendanceData[attendanceData.length - 1];
        if (lastAttendance && lastAttendance.group === selectedGroup) {
            lastAttendance.present.forEach(student => {
                const checkbox = studentsCheckboxList.querySelector(`input[value="${student}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
    }
}

function updateLectureCount() {
    const groupSelect = document.getElementById('group');
    const lectureSelect = document.getElementById('lecture');

    if (groupSelect && lectureSelect) {
        const selectedGroup = groupSelect.value;
        const lectureCount = lectureCounts[selectedGroup];

        lectureSelect.innerHTML = '';

        for (let i = 1; i <= lectureCount; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Lecture ${i}`;
            lectureSelect.appendChild(option);
        }
    }
}
generateStudentCheckboxes();
updateLectureCount();

displayAttendanceData();


let bookedTickets = [];

function validateDate() {
    const dateInput = document.getElementById('date');
    const dateError = document.getElementById('dateError');
    const currentDate = new Date();
    const selectedDate = new Date(dateInput.value);

    if (selectedDate < currentDate) {
        dateError.textContent = 'Please select a date in the future.';
        return false;
    } else {
        dateError.textContent = '';
        showSeatSelection();
        return false;
    }
}

function showSeatSelection() {
    const seatSelection = document.getElementById('seatSelection');
    seatSelection.style.display = 'flex';
    seatSelection.style.flexDirection = 'column';
    seatSelection.style.alignItems = 'center';

    
    setTimeout(() => {
        seatSelection.style.opacity = '1';
    }, 100);
}

function scrollToElement(element) {
    window.scrollTo({
        behavior: 'smooth',
        top: element.offsetTop
    });
}

function bookTickets() {
    const direction = document.getElementById('direction').value;
    const date = document.getElementById('date').value;
    const selectedSeats = Array.from(document.querySelectorAll('input[name="seat"]:checked')).map(seat => seat.value);

    bookedTickets.push({ direction, date, seats: selectedSeats });

    const bookedTicketsList = document.getElementById('bookedTickets');
    const newTicketItem = document.createElement('li');
    newTicketItem.textContent = `Direction: ${direction}, Date: ${date}, Places: ${selectedSeats.join(', ')}`;
    bookedTicketsList.appendChild(newTicketItem);
}