import React, { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import formActions from "./../../store/actions/formActions";
import { history } from '../../store/config';

const MatchingWord = ({ word, onDrop }) => {
    const [, drag] = useDrag({
        type: 'WORD',
        item: { word },
    });

    return (
        <div ref={drag} style={{ padding: '8px', border: '1px solid #ccc', margin: '4px', cursor: 'move' }}>
            {word}
        </div>
    );
};

const MatchingPair = ({ question, onDrop }) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'WORD',
        drop: (item) => onDrop(item.word, question.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div
            ref={drop}
            style={{
                padding: '8px',
                border: isOver ? '2px dashed #000' : '2px solid #000',
                margin: '8px',
            }}
        >
            {question.prompt} {question.answer}
        </div>
    );
};

const CategorizeQuestion = () => {
    const dispatch = useDispatch();
	const { action } = useSelector((state) => state.form);
    const [matchingWords, setMatchingWords] = useState(['Apple', 'Banana', 'Cherry', 'Date']);
    const [matchingPairs, setMatchingPairs] = useState([
        { id: 1, prompt: 'Fruit 1:', answer: '' },
        { id: 2, prompt: 'Fruit 2:', answer: '' },
        { id: 3, prompt: 'Fruit 3:', answer: '' },
        { id: 4, prompt: 'Fruit 4:', answer: '' },
    ]);

    const handleDrop = (word, pairId) => {
        const updatedPairs = matchingPairs.map((pair) =>
            pair.id === pairId ? { ...pair, answer: word } : pair
        );
        setMatchingPairs(updatedPairs);
    };

    const saveForm = () => {
		const formJson = {
			title: "Categorize",
			body: matchingPairs,
		};
		dispatch(formActions.saveForm(formJson));
	};
    useEffect(() => {
		if (action === formActions.SAVE_FORM_SUCCESS) {
			history.back();
		}
	}, [action]);
    return (
        <div>
            <h2>Categories</h2>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <h3>Available Words</h3>
                    {matchingWords.map((word, index) => (
                        <MatchingWord key={index} word={word} onDrop={handleDrop} />
                    ))}
                </div>
                <div style={{ flex: 1 }}>
                    <h3>Matching Pairs</h3>
                    {matchingPairs.map((pair) => (
                        <MatchingPair key={pair.id} question={pair} onDrop={handleDrop} />
                    ))}
                </div>
            </div>
            <button className="save-form-btn btn" onClick={() => saveForm()}>
                Save
            </button>
        </div>

    );
};

export default CategorizeQuestion;