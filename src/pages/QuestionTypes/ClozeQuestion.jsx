import { useDispatch, useSelector } from "react-redux";
import formActions from "./../../store/actions/formActions";
import { useRef, useState } from "react";

const ClozeQuestion = ({ question, onChange }) => {
    const [selectedText, setSelectedText] = useState('');
    const contentEditableRef = useRef(null);
    const [matchingPairs, setMatchingPairs] = useState([]);
    const dispatch = useDispatch();
    const { action } = useSelector((state) => state.form);

    const handleContentChange = () => {
        onChange({
            ...question,
            content: contentEditableRef.current.innerText,
        });
    };

    const handleInsertBlank = () => {
        const contentEditable = contentEditableRef.current;
        const modifiedContent = contentEditable.innerText.replace(selectedText, '_____');
        contentEditable.innerText = modifiedContent;
        setMatchingPairs((prevPairs) => [
            ...prevPairs,
            {
                content: contentEditable.innerText,
                answer: selectedText,
            },
        ]);
        handleContentChange();
    };

    const handleSelect = () => {
        const selection = window.getSelection();
        setSelectedText(selection.toString());
    };

    const saveForm = () => {
        const formJson = {
            title: "Cloze",
            body: matchingPairs,
        };
        dispatch(formActions.saveForm(formJson));
    };

    return (
        <div>
            <div>
                <label style={{ marginBottom: '8px', display: 'block' }}>Cloze (Fill in the Blank):</label>
                <div
                    ref={contentEditableRef}
                    contentEditable
                    placeholder="Enter the fill-in-the-blank question"
                    onBlur={handleContentChange}
                    onSelect={handleSelect}
                    style={{
                        border: '1px solid #ccc',
                        padding: '8px',
                        borderRadius: '4px',
                        marginBottom: '10px',
                        minHeight: '50px',
                        overflowY: 'auto',
                    }}
                >
                    {question.content}
                </div>
                <button
                    onClick={handleInsertBlank}
                    style={{
                        backgroundColor: '#4caf50',
                        color: 'white',
                        padding: '10px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Insert Blank
                </button>
            </div>
            <button className="save-form-btn btn" onClick={() => saveForm()}>
                Save
            </button>
        </div>
    );
};

export default ClozeQuestion;
