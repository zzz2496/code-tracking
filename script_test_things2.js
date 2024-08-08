function initializeDragAndSelect(options = {}) {
    const { snapSize = 20, containerSelector = '.container', itemSelector = '.selectable' } = options;

    const container = document.querySelector(containerSelector);
    let selectedItems = new Set();
    let isDraggingSelection = false;
    let isDraggingItem = false;
    let isResizing = false;
    let startX, startY, currentX, currentY;
    let selectionBox = null;
    let initialPositions = new Map();
    let resizeItem = null;

    function snapToGrid(value, gridSize) {
        return Math.round(value / gridSize) * gridSize;
    }

    function snapToGridSize(size, gridSize) {
        return Math.max(gridSize, Math.round(size / gridSize) * gridSize);
    }

    function toggleSelection(item) {
        if (selectedItems.has(item)) {
            item.classList.remove('active');
            selectedItems.delete(item);
        } else {
            item.classList.add('active');
            selectedItems.add(item);
        }
        console.log(Array.from(selectedItems));  // Log selected items for debugging
    }

    function startDraggingSelection(event) {
        isDraggingSelection = true;
        startX = event.clientX;
        startY = event.clientY;

        selectionBox = document.createElement('div');
        selectionBox.className = 'selection-box';
        selectionBox.style.left = `${startX}px`;
        selectionBox.style.top = `${startY}px`;
        container.appendChild(selectionBox);
    }

    function updateSelectionBox(event) {
        currentX = event.clientX;
        currentY = event.clientY;

        selectionBox.style.left = `${Math.min(startX, currentX)}px`;
        selectionBox.style.top = `${Math.min(startY, currentY)}px`;
        selectionBox.style.width = `${Math.abs(currentX - startX)}px`;
        selectionBox.style.height = `${Math.abs(currentY - startY)}px`;

        const rect = selectionBox.getBoundingClientRect();

        document.querySelectorAll(itemSelector).forEach(item => {
            const itemRect = item.getBoundingClientRect();
            if (rect.right >= itemRect.left &&
                rect.left <= itemRect.right &&
                rect.bottom >= itemRect.top &&
                rect.top <= itemRect.bottom) {
                if (!selectedItems.has(item)) {
                    item.classList.add('active');
                    selectedItems.add(item);
                }
            } else {
                if (selectedItems.has(item)) {
                    item.classList.remove('active');
                    selectedItems.delete(item);
                }
            }
        });
    }

    function finalizeSelection() {
        isDraggingSelection = false;
        if (selectionBox) {
            selectionBox.remove();
            selectionBox = null;
        }
        console.log(Array.from(selectedItems));  // Log selected items for debugging
    }

    function startDraggingItem(event, item) {
        if (!selectedItems.has(item)) {
            selectedItems.forEach(selectedItem => {
                selectedItem.classList.remove('active');
            });
            selectedItems.clear();
            selectedItems.add(item);
            item.classList.add('active');
        }
        
        isDraggingItem = true;
        startX = event.clientX;
        startY = event.clientY;
        
        selectedItems.forEach(selectedItem => {
            initialPositions.set(selectedItem, {
                left: selectedItem.offsetLeft,
                top: selectedItem.offsetTop
            });
        });
    }

    function dragItem(event) {
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        selectedItems.forEach(item => {
            const initialPosition = initialPositions.get(item);
            item.style.left = `${snapToGrid(initialPosition.left + dx, snapSize)}px`;
            item.style.top = `${snapToGrid(initialPosition.top + dy, snapSize)}px`;
        });
    }

    function stopDraggingItem() {
        isDraggingItem = false;
        initialPositions.clear();
        console.log(Array.from(selectedItems));  // Log selected items for debugging
    }

    function resizeItemFunction(event) {
        if (!resizeItem) return;
        
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        const rect = resizeItem.getBoundingClientRect();
        const newWidth = snapToGridSize(rect.width + dx, snapSize);
        const newHeight = snapToGridSize(rect.height + dy, snapSize);

        resizeItem.style.width = `${newWidth}px`;
        resizeItem.style.height = `${newHeight}px`;

        startX = event.clientX;
        startY = event.clientY;
    }

    function setupEventListeners() {
        const selectableItems = document.querySelectorAll(itemSelector);

        selectableItems.forEach(item => {
            item.addEventListener('mousedown', (event) => {
                const resizeHandleSize = 10;
                const rect = item.getBoundingClientRect();

                // Check if the click is on the resize handle
                if (event.clientX >= rect.right - resizeHandleSize && event.clientY >= rect.bottom - resizeHandleSize) {
                    isResizing = true;
                    resizeItem = item;
                    item.style.cursor = 'se-resize';
                } else {
                    isResizing = false;
                    item.style.cursor = 'pointer';
                    if (event.ctrlKey || event.metaKey) {
                        toggleSelection(event.target);
                    } else if (selectedItems.has(event.target)) {
                        startDraggingItem(event, item);
                    } else {
                        selectedItems.forEach(selectedItem => {
                            selectedItem.classList.remove('active');
                        });
                        selectedItems.clear();
                        toggleSelection(event.target);
                        startDraggingItem(event, item);
                    }
                }
                event.stopPropagation();
            });

            item.addEventListener('mousemove', (event) => {
                const resizeHandleSize = 10;
                const rect = item.getBoundingClientRect();
                if (event.clientX >= rect.right - resizeHandleSize && event.clientY >= rect.bottom - resizeHandleSize) {
                    item.style.cursor = 'se-resize';
                } else {
                    item.style.cursor = 'pointer';
                }
            });

            item.addEventListener('mouseup', () => {
                isResizing = false;
                resizeItem = null;
            });
        });

        container.addEventListener('mousedown', (event) => {
            if (!event.ctrlKey && !event.metaKey && !event.target.classList.contains(itemSelector.substring(1))) {
                selectedItems.forEach(item => {
                    item.classList.remove('active');
                });
                selectedItems.clear();
                startDraggingSelection(event);
            }
        });

        container.addEventListener('mousemove', (event) => {
            if (isDraggingSelection) {
                updateSelectionBox(event);
            } else if (isDraggingItem) {
                dragItem(event);
            } else if (isResizing) {
                resizeItemFunction(event);
            }
        });

        container.addEventListener('mouseup', () => {
            if (isDraggingSelection) {
                finalizeSelection();
            } else if (isDraggingItem) {
                stopDraggingItem();
            } else if (isResizing) {
                isResizing = false;
                resizeItem = null;
            }
        });
    }

    setupEventListeners();

    return {
        reinitialize() {
            setupEventListeners();
        }
    };
}

// Initialize with options
const dragAndSelect = initializeDragAndSelect({
    snapSize: 20,
    containerSelector: '.container',
    itemSelector: '.selectable'
});

// To reinitialize after DOM changes, call:
// dragAndSelect.reinitialize();