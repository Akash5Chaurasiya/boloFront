import React, { useState } from 'react';
import CategorizeQuestion from './CategorizeQuestion';
import ClozeQuestion from './ClozeQuestion';
import CreateForm from '../FormCreationPage/CreateForm';
import "./FormBuilder.css";
import { Link } from 'react-router-dom';

const FormBuilder = () => {
    const [formQuestions, setFormQuestions] = useState([]);

    const addQuestion = (question) => {
        setFormQuestions([...formQuestions, question]);
    };

    const handleQuestionChange = (index, updatedQuestion) => {
        const updatedQuestions = [...formQuestions];
        updatedQuestions[index] = updatedQuestion;
        setFormQuestions(updatedQuestions);
    };

    const renderQuestionType = (question, index) => {
        switch (question.type) {
            case 'categorize':
                return (
                    <CategorizeQuestion
                        key={index}
                        question={question}
                        onChange={(updatedQuestion) => handleQuestionChange(index, updatedQuestion)}
                    />
                );
            case 'cloze':
                return (
                    <ClozeQuestion
                        key={index}
                        question={question}
                        onChange={(updatedQuestion) => handleQuestionChange(index, updatedQuestion)}
                    />
                );
            case 'comprehension':
                return (
                    <CreateForm
                        key={index}
                        question={question}
                        onChange={(updatedQuestion) => handleQuestionChange(index, updatedQuestion)}
                    />
                );
            default:
                return null;
        }
    };
    return (
        <div className="home-page">
            <h2>Welcome to Form Builder</h2>
            <div className="form-questions">
                {formQuestions.map((question, index) => (
                    <div key={index}>{renderQuestionType(question, index)}</div>
                ))}
            </div>
            <div className="action-buttons">
                <button className="add-button" onClick={() => addQuestion({ type: 'categorize', content: '' })}>
                    Add Categorize Question
                </button>
                <button className="add-button" onClick={() => addQuestion({ type: 'cloze', content: '' })}>
                    Add Cloze Question
                </button>
                <button className="add-button" onClick={() => addQuestion({ type: 'comprehension', content: '' })}>
                    Add Comprehension Question
                </button>
            </div>
            <button className="submit-button" onClick={() => console.log(formQuestions)}>
                <Link to="/">
                    Exit Form
                </Link>
            </button>
        </div>
    )
};

export default FormBuilder;
