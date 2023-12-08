import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { history } from "../../store/config";
import CustomInput from "../../components/CustomInput/CustomInput";
import formActions from "./../../store/actions/formActions";
import "./FormResponse.css";
import CategorizeQuestion from "../QuestionTypes/CategorizeQuestion";
import { useDrag, useDrop } from "react-dnd";


const FormResponse = () => {
	const DraggableOption = ({ answer }) => {
		const [, drag] = useDrag({
			type: 'ANSWER', // Set the drag type to 'ANSWER'
			item: { answer }, // Pass the answer as the item
		});

		return (
			<div ref={drag} className="draggable-option" draggable="true" onDragStart={onDragStart}>
				{answer}
			</div>
		);
	};

	const DropableOption = ({ onDrop, val }) => {
		const [{ isOver }, drop] = useDrop({
			accept: 'ANSWER',
			drop: (item, monitor) => onDrop(monitor.getItem(), item.answer),
			collect: (monitor) => ({
				isOver: !!monitor.isOver(),
			}),
		});
		const containerClassName = `dropable-option ${isOver ? 'active' : ''}`;

		return (
			<div ref={drop} className={containerClassName}>
				{val}
			</div>
		);
	};

	let { id } = useParams();

	const dispatch = useDispatch();
	const { data: form } = useSelector((state) => state.form);
	const { action } = useSelector((state) => state.form);
	const [response, setResponse] = useState({});
	const [isError, setIsError] = useState(false);
	console.log(form);
	useEffect(() => {
		dispatch(formActions.getForm(id));
	}, [id]);

	useEffect(() => {
		if (action === formActions.SAVE_RESPONSE_SUCCESS) {
			history.go(-1);
		}
	}, [action]);

	const saveResponse = () => {
		let filteredResponse = filterResponse();
		let finalResponseObj;
		if (Object.keys(filteredResponse).length) {
			finalResponseObj = {
				id,
				response: filteredResponse,
			};
			dispatch(formActions.saveResponse(finalResponseObj));
			setIsError(false);
		} else {
			setIsError(true);
		}
	};

	const filterResponse = () => {
		let filteredObj = { ...response };
		for (let key in filteredObj) {
			if (filteredObj.hasOwnProperty(key)) {
				if (
					filteredObj[key] == "" ||
					(typeof filteredObj[key] === "object" && Object.keys(filteredObj[key]).length <= 0)
				) {
					delete filteredObj[key];
				}
			}
		}
		return filteredObj;
	};

	const handleOnChange2 = (draggedItem, que) => {
		const draggedAnswer = draggedItem.answer;

		if (draggedAnswer) {
			const updatedResponse = { ...response, [que.id]: draggedAnswer };
			setResponse(updatedResponse);
		}
	};


	const onDragStart = (e, answer) => {
		e.dataTransfer.setData('ANSWER', answer); // Correct type to 'ANSWER'
	};

	const handleOnChange = (e, que, index = -1) => {
		let responseObj = { ...response };
		let ans;
		if (que.type === "1" || que.type === "3") {
			ans = e.target.value;
			responseObj[que.id] = ans;
		} else if (que.type === "2") {
			ans = e.target.checked;
			if (ans) {
				responseObj[que.id] = { ...responseObj[que.id], [index]: e.target.value };
			} else {
				delete responseObj[que.id][index];
			}
		} else {
			ans = e.target.value;
			responseObj[que.id] = ans;
		}
		setResponse(responseObj);
	};

	return (
		<>
			<div className="form-container" onFocus={() => setIsError(false)}>
				{form.length > 0 && (
					<>
						<div className="form-header">
							<span className="response-form-title">{form[0].formJson.title}</span>
						</div>
						{form[0].formJson.title === "Categorize" ? (
							<div className="options-container">
								<div className="draggable-column">
									<h4>Available Answers</h4>
									{form[0].formJson.body.map((que) => (
										<DraggableOption key={que.id} answer={que.answer} onDragStart={(e) => onDragStart(e, que.answer)} />
									))}
								</div>
								<div className="droppable-column">
									<h4>Questions</h4>
									{form[0].formJson.body.map((que) => (
										<DropableOption key={que.id} val={que.prompt} onDrop={(e) => handleOnChange2(e, que)} />
									))}
								</div>
							</div>
						) : form[0].formJson.title === "Cloze"?(
							form[0].formJson.body.map((que, index) => (
								<React.Fragment key={index}>
									<p className="question">{`${index}. ${que.content}`}</p>
									<CustomInput que={que} onChange={(e, que, index) => handleOnChange(e, que, index)} />
									<input type="text" placeholder="Type your Answer" onChange={(e)=>setResponse(e.target.value)} />
								</React.Fragment>
							))
						):
						(
							form[0].formJson.body.map((que, index) => (
								<React.Fragment key={index}>
									<p className="question">{`${que.id}. ${que.question}`}</p>
									<CustomInput que={que} onChange={(e, que, index) => handleOnChange(e, que, index)} />
								</React.Fragment>
							))
						)}
						<div className="form-footer">
							<button className="save-response-btn btn" onClick={() => saveResponse()}>
								Save Response
							</button>
						</div>
					</>
				)}
				{isError && (
					<p className="error error-message">
						<span>Please enter a response!!!</span>
					</p>
				)}
			</div>
		</>
	);
};

export default FormResponse;

