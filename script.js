// 메모 데이터를 저장할 배열
let notes = [];
let labels = new Set();
let selectedLabels = new Set();

// DOM 요소들
const notesList = document.getElementById('notesList');
const labelContainer = document.getElementById('labelContainer');
const labelFilter = document.getElementById('labelFilter');
const labelInput = document.getElementById('labelInput');

// 페이지 로드 시 저장된 데이터 불러오기
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
});

// 로컬 스토리지에서 데이터 로드
function loadFromLocalStorage() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        // 저장된 모든 라벨 복원
        notes.forEach(note => {
            note.labels.forEach(label => labels.add(label));
        });
        updateLabelContainers();
        updateNotesList();
    }
}

// 로컬 스토리지에 데이터 저장
function saveToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// 라벨 입력 이벤트 리스너
labelInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && this.value.trim()) {
        addLabel(this.value.trim());
        this.value = '';
    }
});

// 라벨 추가 함수
function addLabel(labelText) {
    if (!labels.has(labelText)) {
        labels.add(labelText);
        selectedLabels.add(labelText);
        updateLabelContainers();
    }
}

// 라벨 토글 함수
function toggleLabel(label) {
    if (selectedLabels.has(label)) {
        selectedLabels.delete(label);
    } else {
        selectedLabels.add(label);
    }
    updateLabelContainers();
}

// 라벨 컨테이너 업데이트
function updateLabelContainers() {
    // 라벨 선택 영역 업데이트
    labelContainer.innerHTML = Array.from(labels).map(label => 
        `<span class="label ${selectedLabels.has(label) ? 'selected' : ''}" 
         onclick="toggleLabel('${label}')">${label}</span>`
    ).join('');

    // 필터 영역 업데이트
    labelFilter.innerHTML = Array.from(labels).map(label =>
        `<span class="label" onclick="filterByLabel('${label}')">${label}</span>`
    ).join('');
}

// 메모 추가 함수
function addNote() {
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const currentLabels = Array.from(selectedLabels);

    if (title && content) {
        const note = {
            id: Date.now(),
            title,
            content,
            labels: currentLabels,
            date: new Date().toLocaleDateString()
        };

        notes.push(note);
        saveToLocalStorage();
        updateNotesList();
        
        // 입력 필드 초기화
        titleInput.value = '';
        contentInput.value = '';
        selectedLabels.clear();
        updateLabelContainers();
    }
}

// 메모 삭제 함수
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveToLocalStorage();
    updateNotesList();
}

// 메모 목록 업데이트
function updateNotesList(filteredNotes = notes) {
    notesList.innerHTML = filteredNotes.map(note => `
        <div class="note-card">
            <button class="delete-btn" onclick="deleteNote(${note.id})">삭제</button>
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <div class="label-container">
                ${note.labels.map(label => `
                    <span class="label">${label}</span>
                `).join('')}
            </div>
            <small>${note.date}</small>
        </div>
    `).join('');
}

// 라벨로 필터링
function filterByLabel(label) {
    const filteredNotes = notes.filter(note => 
        note.labels.includes(label)
    );
    updateNotesList(filteredNotes);
}

// 검색 기능
function filterNotes() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchText) ||
        note.content.toLowerCase().includes(searchText) ||
        note.labels.some(label => label.toLowerCase().includes(searchText))
    );
    updateNotesList(filteredNotes);
}