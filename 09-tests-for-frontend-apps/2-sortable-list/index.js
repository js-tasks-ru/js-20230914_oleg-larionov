export default class SortableList {

    constructor({ items = [] } = {}) {
        this.items = [...items];
        this.element = null;
        this.draggableElement = null; ``;
        this.placeholder = null;
        this.moveOnX = null;
        this.moveOnY = null;
        this.render();
    }

    createElement() {
        const element = document.createElement("ul");
        element.classList.add("sortable-list");
        return element;
    }

    render() {
        this.element = this.createElement();
        this.items.forEach((item) => {
            item.classList.add("sortable-list__item");
            this.element.append(item);
        });
        this.createEventListeners();
    }

    createEventListeners() {
        this.element.addEventListener("pointerdown", this.handleElementPointerDown);
        this.element.ondragstart = () => false;
    }

    createDragEventListeners() {
        document.addEventListener("pointermove", this.handleDocumentPointerMove);
        document.addEventListener("pointerup", this.handleElementPointerUp);
    }

    removeElementEventListeners() {
        this.element.removeEventListener("pointerdown", this.handleElementPointerDown);
        this.element.ondragstart = null;
    }

    removeDragListeners() {
        document.removeEventListener("pointermove", this.handleDocumentPointerMove);
        document.removeEventListener("pointerup", this.handleElementPointerUp);
    }

    handleElementPointerDown = (e) => {
        const deleteHandle = e.target.closest("[data-delete-handle]");
        if (deleteHandle) {
            this.handleItemDelete(e, deleteHandle);
        }
        const grabHandle = e.target.closest("[data-grab-handle]");
        if (grabHandle) {
            this.handleDragStart(e, grabHandle);
        }
    };

    handleItemDelete(e, deleteHandle) {
        let deletedItem = deleteHandle.closest(".sortable-list__item");

        if (!deletedItem) {
            return;
        }
        deletedItem.remove();
        deletedItem = null;
        this.dispatchItemEvent("item-deleted");
    }

    moveDraggableElementTo(x, y) {
        if (!this.draggableElement) {
            return;
        }
        this.draggableElement.style.left = x - this.moveOnX + "px";
        this.draggableElement.style.top = y - this.moveOnY + "px";
    }

    handleDragStart(e, grabHandle) {
        this.draggableElement = grabHandle.closest(".sortable-list__item");

        if (!this.draggableElement) { 
            return
        }

        this.moveOnX = e.pageX - this.draggableElement.getBoundingClientRect().left;
        this.moveOnY = e.pageY - this.draggableElement.getBoundingClientRect().top;

        const draggableElementBoundingRect = this.draggableElement.getBoundingClientRect();
        this.placeholder = document.createElement("li");

        this.placeholder.classList.add("sortable-list__placeholder");
        this.placeholder.style.width = draggableElementBoundingRect.width + "px";
        this.placeholder.style.height = draggableElementBoundingRect.height + "px";
        
        this.draggableElement.before(this.placeholder);
        this.draggableElement.classList.add("sortable-list__item_dragging");
        this.draggableElement.style.width = draggableElementBoundingRect.width + "px";
        this.draggableElement.style.height = draggableElementBoundingRect.height + "px";

        this.moveDraggableElementTo(e.pageX, e.pageY);
        this.createDragEventListeners();
    }

    handleDocumentPointerMove = (e) => {
        this.moveDraggableElementTo(e.pageX, e.pageY);

        this.draggableElement.style.visibility = "hidden";
        const listItemBelowdraggableElement = document.elementFromPoint(e.pageX, e.pageY).closest(".sortable-list__item");
        this.draggableElement.style.visibility = "visible";

        if (!listItemBelowdraggableElement) {
            return;
        }
        const list = Array.from(this.element.children);
        if (list.indexOf(listItemBelowdraggableElement) < list.indexOf(this.placeholder)) {
            listItemBelowdraggableElement.before(this.placeholder);
        }
        else {
            listItemBelowdraggableElement.after(this.placeholder);
        }
    };

    handleElementPointerUp = (e) => {
        this.placeholder.before(this.draggableElement);
        this.placeholder.remove();
        this.placeholder = null;

        this.draggableElement.classList.remove("sortable-list__item_dragging");
        this.draggableElement.style.left = "";
        this.draggableElement.style.top = "";
        this.draggableElement = null;
        this.removeDragListeners();
        this.dispatchItemEvent("item-dragged");
    };

    dispatchItemEvent(eventType) {
        const event = new CustomEvent(eventType, {
            bubbles: true,
        });
        this.element.dispatchEvent(event);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        this.removeElementEventListeners();
    }
}