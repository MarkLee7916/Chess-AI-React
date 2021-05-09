import React, { useState } from "react";

interface Props {
    initialItem: string
    content: Map<string, () => void>
}

export const Dropdown = ({ initialItem, content }: Props) => {
    const [isContentDisplayed, setContentDisplayed] = useState(false);
    const [itemSelected, setItemSelected] = useState(initialItem);

    // Don't display dropdown items unless user has selected dropdown menu
    const contentDisplay = isContentDisplayed ? "block" : "none";

    function toggleContent() {
        setContentDisplayed(!isContentDisplayed);
    }

    // When user selects a dropdown item, notify parent component, render the item at the top of the dropdown menu and close the dropdown menu
    function handleContentButtonClick(item: string) {
        const notifyCallback = content.get(item);

        toggleContent();
        setItemSelected(item);
        notifyCallback();
    }

    return (
        <div className="dropdown-container">
            <button className="dropdown-button modal-button" onClick={toggleContent}>
                {itemSelected + (isContentDisplayed ? ' ▲' : ' ▼')}
            </button>

            <div className="dropdown-content" style={{ display: contentDisplay }}>
                {Array.from(content.keys()).map((item, index) =>
                    <button className="dropdown-content-button modal-button" onClick={() => handleContentButtonClick(item)} key={index}>
                        {item}
                    </button>
                )}
            </div>
        </div>
    )
}