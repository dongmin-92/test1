// 메모 데이터를 저장할 배열
let notes = [];
let labels = new Set();

// DOM 요소들
const notesList = document.getElementById('notesList');
const labelContainer = document.getElementById('labelContainer');
const labelFilter = document.getElementById('labelFilter');
const labelInput = document.getElementById('labelInput');

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
        updateLabelContainers();
    }
}

// 라벨 컨테이너 업데이트
function updateLabelContainers() {
    // 라벨 선택 영역 업데이트
    labelContainer.innerHTML = Array.from(labels).map(label => 
        `<span class="label">${label}</span>`
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
    const selectedLabels = Array.from(labels);

    if (title && content) {
        const note = {
            id: Date.now(),
            title,
            content,
            labels: selectedLabels,
            date: new Date().toLocaleDateString()
        };

        notes.push(note);
        updateNotesList();
        
        // 입력 필드 초기화
        titleInput.value = '';
        contentInput.value = '';
        labels.clear();
        updateLabelContainers();
    }
}

// 메모 삭제 함수
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
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