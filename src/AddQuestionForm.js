import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';

export const AddQuestionForm = () => {
    const [questionData, setQuestionData] = useState({
        questionID: "",
        text: "",
        graph: {
            title: "",
            description: "",
            chartType: "line",
            lineDots: [{ name: "", data: { x: "", y: "" } }]
        },
        options: [
            { optionBullet: "A", optionText: "" },
            { optionBullet: "B", optionText: "" },
        ],
        correctAnswer: "",
        id: ""
    });

    const handleInputChange = (e, section, index = null, subSection = null) => {
        const { name, value } = e.target;
    
        if (section === "graph") {
            if (subSection) {
                setQuestionData(prevState => ({
                    ...prevState,
                    graph: {
                        ...prevState.graph,
                        [subSection]: value
                    }
                }));
            } else {
                setQuestionData(prevState => ({
                    ...prevState,
                    graph: {
                        ...prevState.graph,
                        [name]: value
                    }
                }));
            }
        } else if (section === "graph.lineDots") {
            setQuestionData(prevState => {
                const updatedLineDots = [...prevState.graph.lineDots];
                updatedLineDots[index][name] = value;
                return { ...prevState, graph: { ...prevState.graph, lineDots: updatedLineDots } };
            });
        } else if (index !== null) {
            setQuestionData(prevState => {
                const updatedSection = [...prevState[section]];
                updatedSection[index] = { ...updatedSection[index], [name]: value };
                return { ...prevState, [section]: updatedSection };
            });
        } else {
            setQuestionData(prevState => ({ ...prevState, [section]: { ...prevState[section], [name]: value } }));
        }
    };
    
    

    const handleLineDotsChange = (e, index, coord) => {
        const { value } = e.target;
        setQuestionData(prevState => {
            const updatedLineDots = [...prevState.graph.lineDots];
            updatedLineDots[index].data[coord] = value;
            return { ...prevState, graph: { ...prevState.graph, lineDots: updatedLineDots } };
        });
    };

    const addLineDot = () => {
        setQuestionData(prevState => ({
            ...prevState,
            graph: {
                ...prevState.graph,
                lineDots: [...prevState.graph.lineDots, { name: "", data: { x: "", y: "" } }]
            }
        }));
    };

    const removeLineDot = (index) => {
        setQuestionData(prevState => {
            const updatedLineDots = prevState.graph.lineDots.filter((_, i) => i !== index);
            return { ...prevState, graph: { ...prevState.graph, lineDots: updatedLineDots } };
        });
    };

    const addOption = () => {
        const optionBullet = String.fromCharCode(65 + questionData.options.length); // Next bullet (A, B, C, ...)
        setQuestionData(prevState => ({
            ...prevState,
            options: [...prevState.options, { optionBullet, optionText: "" }]
        }));
    };

    const removeOption = (index) => {
        setQuestionData(prevState => {
            const updatedOptions = prevState.options.filter((_, i) => i !== index);
            return { ...prevState, options: updatedOptions };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = JSON.stringify({
            ...questionData,
            producerID: "",
            producerName: ""
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://api.question.testy-quest.nl/NewQuestion/ProduceQuestion',
            headers: {
                'Authorization': `Bearer ${Cookies.get('firebaseToken')}`,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="container mt-5 p-5 bg-white border rounded">
            <h2 className="text-dark">Add New Question</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label text-dark">Question Text</label>
                    <input
                        type="text"
                        className="form-control"
                        name="text"
                        value={questionData.text}
                        onChange={(e) => setQuestionData({ ...questionData, text: e.target.value })}
                    />
                </div>
                <div className="mb-3 p-3 border rounded">
                    <h4 className="text-dark">Graph Details</h4>
                    <div className="mb-3">
                        <label className="form-label text-dark">Graph Title</label>
                        <input
                            type="text"
                            className="form-control"
                            name="title"
                            value={questionData.graph.title}
                            onChange={(e) => handleInputChange(e, "graph", null, "title")}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-dark">Graph Description</label>
                        <input
                            type="text"
                            className="form-control"
                            name="description"
                            value={questionData.graph.description}
                            onChange={(e) => handleInputChange(e, "graph", null, "description")}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-dark">Chart Type</label>
                        <select
                            className="form-control"
                            name="chartType"
                            value={questionData.graph.chartType}
                            onChange={(e) => handleInputChange(e, "graph")}
                        >
                            <option value="line">Line</option>
                        </select>
                    </div>
                    <h4 className="text-dark">Line Dots</h4>
                    {questionData.graph.lineDots.map((dot, index) => (
                        <div key={index} className="mb-3 p-3 border rounded">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="text-dark">Dot {index + 1}</h5>
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeLineDot(index)}>×</button>
                            </div>
                            <label className="form-label text-dark">Dot Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={dot.name}
                                onChange={(e) => handleInputChange(e, "graph.lineDots", index)}
                            />
                            <div className="row">
                                <div className="col">
                                    <label className="form-label text-dark">X Coordinate</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="x"
                                        value={dot.data.x}
                                        onChange={(e) => handleLineDotsChange(e, index, "x")}
                                    />
                                </div>
                                <div className="col">
                                    <label className="form-label text-dark">Y Coordinate</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="y"
                                        value={dot.data.y}
                                        onChange={(e) => handleLineDotsChange(e, index, "y")}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button type="button" className="btn btn-secondary mb-3" onClick={addLineDot}>Add Line Dot</button>
                </div>
                <div className="mb-3 p-3 border rounded">
                    <h4 className="text-dark">Options</h4>
                    {questionData.options.map((option, index) => (
                        <div key={index} className="mb-3 p-3 border rounded">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="text-dark">Option {option.optionBullet}</h5>
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeOption(index)}>×</button>
                            </div>
                            <input
                                type="text"
                                className="form-control"
                                name="optionText"
                                value={option.optionText}
                                onChange={(e) => handleInputChange(e, "options", index)}
                            />
                        </div>
                    ))}
                    <button type="button" className="btn btn-secondary mb-3" onClick={addOption}>Add Option</button>
                </div>
                <div className="mb-3 p-3 border rounded">
                    <label className="form-label text-dark">Correct Answer</label>
                    <select
                        className="form-control"
                        name="correctAnswer"
                        value={questionData.correctAnswer}
                        onChange={(e) => setQuestionData({ ...questionData, correctAnswer: e.target.value })}
                    >
                        {questionData.options.map((option, index) => (
                            <option key={index} value={option.optionBullet}>{option.optionBullet}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Submit Question</button>
            </form>
        </div>
    );
};

export default AddQuestionForm;
