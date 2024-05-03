import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import NavBar from './NavBar';
import Spinner from '../spinner/Spinner';
import jsPDF from 'jspdf';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuizUI = () => {
    const mystyle = {
        color: 'red',
    };

    const btnStyle = {
        backgroundColor: '#FF683B',
        color: 'white',
    };

    const gapStyle = {
        marginRight: '10px',
    };

    const defaultNumberOfQuestionnaires = 10;
    const questionsPerPage = 10;

    const [inputData, setInputData] = useState({
        subject: '',
        topic: '',
        language: '',
        numberOfQuestions: defaultNumberOfQuestionnaires,
    });

    const [userQuizQuestions, setUserQuizQuestions] = useState([]);
    const [additionalQuizQuestions, setAdditionalQuizQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [approvalStatus, setApprovalStatus] = useState({});
    const [loading, setLoading] = useState(false);
    const [regenerationAttempts, setRegenerationAttempts] = useState(5)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const downloadPdfRef = useRef(null);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = () => {
        if (username === 'fondbuzz' && password === 'Z9[7&.4c@v]+') {
            setAuthenticated(true);
            toast.success('Access Granted');
        } else {
            toast.error('Invalid username or password');
            setUsername('');
            setPassword('');
        }
    };

    const handleReset = () => {
        setUsername('');
        setPassword('');
    };

    const txtStyle = {
        color: "#8172DB"
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateInput = () => {
        if (!inputData.subject.trim()) {
            alert('Please enter a subject.');
            return false;
        }

        if (!inputData.topic.trim()) {
            alert('Please enter a topic.');
            return false;
        }

        if (!inputData.language.trim()) {
            alert('Please select a language.');
            return false;
        }

        if (parseInt(inputData.numberOfQuestions) !== 10) {
            alert('Number of questions should be exactly 10.');
            return;
        }
        return true;
    };

    const handleGenerateQuiz = async () => {
        if (!validateInput()) {
            return;
        }

        try {
            setLoading(true);

            const apiUrl = `http://54.196.157.167:5001/generate_quiz?topic=${inputData.topic}&language=${inputData.language}&subject=${inputData.subject}&number=${inputData.numberOfQuestions}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                toast.error('Some problem encountered. Please try again later.');
            }

            const data = await response.json();

            if (data && data.Quiz && Array.isArray(data.Quiz) && data.Quiz.length > 0) {
                const quizWithIds = data.Quiz.map((question) => ({
                    ...question,
                    id: uuidv4(),
                }));
                setUserQuizQuestions(quizWithIds.slice(0, defaultNumberOfQuestionnaires));
                setAdditionalQuizQuestions(quizWithIds.slice(defaultNumberOfQuestionnaires));
                setCurrentPage(1);
                setApprovalStatus({});
                toast.success('Quiz generated successfully');
            } else {
                console.error('Invalid API response. Expected a non-empty array:', data);
                toast.error('Some error encountered. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching quiz questions:', error);
            toast.error('Failed to fetch quiz questions. Please try again later.');
        } finally {
            setLoading(false);
        }
    };


    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = userQuizQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    const handleBack = () => {
        setInputData({
            subject: '',
            topic: '',
            language: '',
            numberOfQuestions: defaultNumberOfQuestionnaires,
        });
        setUserQuizQuestions([]);
        setAdditionalQuizQuestions([]);
        setCurrentPage(1);
        setSelectedQuestions([]);
        setApprovalStatus({});
    };

    const handleCancel = () => {
        setSelectedQuestions([]);
        setApprovalStatus({});
    };

    const handleApprove = (id) => {
        setApprovalStatus((prev) => ({ ...prev, [id]: true }));
        setSelectedQuestions((prevSelected) => [...prevSelected, id]);
    };

    const handleReject = (id) => {
        setApprovalStatus((prev) => ({ ...prev, [id]: false }));
    };

    const handleToggleSelectAll = () => {
        const allQuestionsSelected = selectedQuestions.length === userQuizQuestions.length;

        if (allQuestionsSelected) {
            setSelectedQuestions([]);
        } else {
            const allQuestions = userQuizQuestions.map((question) => question.id);
            setSelectedQuestions(allQuestions);
        }
    };

    const generatePdf = () => {
        if (selectedQuestions.length === 0) {
            alert('Please select questions to download as PDF.');
            return;
        }

        const pdf = new jsPDF();
        const fontSize = 10;
        const maxQuestionsPerPage = 3;
        let questionCounter = 0;
        let yOffset = 20;
        let currentPage = 1;

        const addQuestionPage = () => {
            if (questionCounter > 0) {
                pdf.addPage();
                currentPage++;
                yOffset = 20;
            }
        };

        selectedQuestions.forEach((questionId, index) => {
            const question = userQuizQuestions.find(q => q.id === questionId);
            if (question) {
                if (questionCounter % maxQuestionsPerPage === 0) {
                    addQuestionPage();
                }

                pdf.setFontSize(fontSize);
                pdf.text(`Question ${questionCounter + 1} : ${question.Question}`, 10, yOffset);
                yOffset += fontSize + 2;
                ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'].forEach(answerKey => {
                    pdf.text(`${answerKey.charAt(answerKey.length - 1)}. ${question[answerKey]}`, 15, yOffset);
                    yOffset += fontSize + 2;
                });
                yOffset += 5; // Space between questions
                questionCounter++;
            } else {
                console.error(`Question with ID ${questionId} not found.`);
            }
        });

        addQuestionPage(); // Add page for Correct Answers

        selectedQuestions.forEach((questionId, index) => {
            const question = userQuizQuestions.find(q => q.id === questionId);
            if (question) {
                pdf.text(`Question ${index + 1} : Correct Answer: ${question['Correct Answer']}`, 10, yOffset);
                yOffset += fontSize + 5;
            }
        });

        const pageCount = pdf.internal.getNumberOfPages();
        pdf.setPage(currentPage);
        const pageWidth = pdf.internal.pageSize.width;
        const pageHeight = pdf.internal.pageSize.height;
        const centerX = pageWidth / 2;
        const centerY = pageHeight - 10;
        pdf.text(`Page ${currentPage} of ${pageCount}`, centerX, centerY, { align: 'center' });

        pdf.save('selected_questions.pdf');
        handleBack();
        toast.success('PDF downloaded successfully');
    };

    const handleDownloadPdf = () => {
        generatePdf();
    };

    const handleRegenerateQuestion = (index) => {
        if (additionalQuizQuestions.length <= index) {
            console.error(`No additional question found at index: ${index}`);
            toast.error('Error regenerating question');
            return;
        }

        if (regenerationAttempts === 0) {
            toast.warning('You have already attempted to regenerate 5 questions.');
            return;
        }

        const newQuestion = additionalQuizQuestions[index];
        if (newQuestion) {
            setUserQuizQuestions((prevQuestions) => {
                const updatedQuestions = [...prevQuestions];
                updatedQuestions[indexOfFirstQuestion + index] = newQuestion; // Update the correct index
                return updatedQuestions;
            });
            setAdditionalQuizQuestions((prevAdditional) => prevAdditional.filter((_, i) => i !== index));
            setRegenerationAttempts(prevAttempts => prevAttempts - 1); // Decrease regeneration attempts
            toast.success('Question regenerated successfully');
        } else {
            console.error('No additional question found at index:', index);
            toast.error('Error regenerating question');
        }
    };

    if (!authenticated) {
        return (
            <>
                <NavBar />
                <ToastContainer
                    position="top-right"
                    autoClose={1500}
                />
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-5 border border-4 rounded-3 pt-4 pb-3 ps-5 pe-5 shadow p-3 bg-body rounded">
                            <h4 className="text-center mb-4 mt-3" style={txtStyle}>Welcome to Quiz Generator</h4>
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Username <span style={mystyle}>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mb-2"
                                        value={username}
                                        onChange={handleUsernameChange}

                                    />
                                    <label className="form-label">Password <span style={mystyle}>*</span></label>
                                    <input
                                        type="password"
                                        className="form-control form-control-sm mb-2"
                                        value={password}
                                        autoComplete="off"
                                        onChange={handlePasswordChange}
                                    />

                                </div>
                            </form>
                            <div className="d-flex justify-content-between mb-4">
                                <button
                                    className="btn btn-sm"
                                    onClick={handleLogin}
                                    style={btnStyle}
                                >
                                    Log In
                                </button>
                                <button
                                    className="btn btn-sm"
                                    onClick={handleReset}
                                    style={btnStyle}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <NavBar />
            <ToastContainer
                position="top-right"
                autoClose={1500}
            />
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6 border border-4 rounded-3 pt-4 pb-3 ps-5 pe-5 shadow p-3 bg-body rounded">
                        {loading ? (
                            <div className="text-center">
                                <Spinner />
                            </div>
                        ) : userQuizQuestions.length === 0 ? (
                            <form>
                                <h4 className="text-center mb-4">Quiz Generator</h4>
                                <div className="mb-3">
                                    <label htmlFor="subject" className="form-label">
                                        Subjects <span style={mystyle}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mb-3"
                                        id="subject"
                                        name="subject"
                                        value={inputData.subject}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />

                                    <label htmlFor="topic" className="form-label">
                                        Topics <span style={mystyle}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mb-3"
                                        id="topic"
                                        name="topic"
                                        value={inputData.topic}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />

                                    <label htmlFor="language" className="form-label">
                                        Language <span style={mystyle}>*</span>
                                    </label>
                                    <select
                                        className="form-select form-select-sm mb-3"
                                        id="language"
                                        name="language"
                                        value={inputData.language}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    >
                                        <option defaultValue>Choose Language</option>
                                        <option value="english">English</option>
                                        <option value="spanish">Spanish</option>
                                        <option value="thai">Thailand</option>
                                    </select>

                                    <label htmlFor="numberOfQuestions" className="form-label">
                                        Number of Questions <span style={mystyle}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm mb-3"
                                        id="numberOfQuestions"
                                        name="numberOfQuestions"
                                        value={inputData.numberOfQuestions}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="d-flex justify-content-between mb-4">
                                    <button
                                        type="button"
                                        className="btn btn-sm"
                                        style={btnStyle}
                                        onClick={handleGenerateQuiz}
                                        disabled={loading}
                                    >
                                        Generate <i className="fa-solid fa-arrow-right"></i>
                                    </button>
                                    <button
                                        type="reset"
                                        className="btn btn-sm"
                                        style={btnStyle}
                                        onClick={handleCancel}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                {currentQuestions.length > 0 && (
                                    <>
                                        <div>
                                            <div className="d-flex justify-content-center mb-2 fw-bold" style={{ color: "red" }}>To regenerate any Q/A: You have only {regenerationAttempts} attempt !</div>
                                            {currentQuestions.map((question, index) => (
                                                <div key={index} className="card mb-3">
                                                    <div className="card-header">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                value=""
                                                                id={`flexCheckDefault${question.id}`}
                                                                checked={selectedQuestions.includes(question.id)}
                                                                onChange={() => {
                                                                    const isApprovedOrAllSelected = approvalStatus[question.id] || selectedQuestions.length === userQuizQuestions.length;
                                                                    if (isApprovedOrAllSelected) {
                                                                        const updatedQuestions = selectedQuestions.includes(question.id)
                                                                            ? selectedQuestions.filter((id) => id !== question.id)
                                                                            : [...selectedQuestions, question.id];
                                                                        setSelectedQuestions(updatedQuestions);
                                                                    }
                                                                }}
                                                                disabled={!approvalStatus[question.id] && selectedQuestions.length !== userQuizQuestions.length}
                                                            />
                                                            <label className="form-check-label">
                                                                <h6 className="card-title">
                                                                    {indexOfFirstQuestion + index + 1}. {question.Question}
                                                                </h6>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="card-body fs-6">
                                                        A.{question['Answer 1']}
                                                        <span style={gapStyle}></span>
                                                        B.{question['Answer 2']}
                                                        <span style={gapStyle}></span>
                                                        C.{question['Answer 3']}
                                                        <span style={gapStyle}></span>
                                                        D.{question['Answer 4']}
                                                        <span className='d-flex justify-content-end mt-3 fst-italic fs-6'>
                                                            Correct Answer: {question['Correct Answer']}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="card-footer"
                                                        style={{
                                                            backgroundColor: approvalStatus[question.id]
                                                                ? '#D1FFBD'
                                                                : approvalStatus[question.id] === false
                                                                    ? ''
                                                                    : '',
                                                        }}
                                                    >
                                                        {approvalStatus[question.id] === true ? (
                                                            <div className="text-center">
                                                                Approved <i className="fa-solid fa-check"></i>
                                                            </div>
                                                        ) : approvalStatus[question.id] === false ? (
                                                            <div className="d-flex justify-content-center">
                                                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleRegenerateQuestion(index)}>
                                                                    Regenerate <i className="fa-solid fa-arrows-spin"></i>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="d-flex justify-content-between">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-success btn-sm"
                                                                    onClick={() => handleApprove(question.id)}
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => handleReject(question.id)}
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                                <div className="d-flex justify-content-between mb-3">
                                    <button
                                        type="button"
                                        className="btn btn-sm"
                                        style={btnStyle}
                                        onClick={handleBack}
                                    >
                                        <i className="fa-solid fa-angle-left me-1"></i> Back
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm"
                                        style={btnStyle}
                                        onClick={handleToggleSelectAll}
                                    >
                                        {selectedQuestions.length === 0
                                            ? 'Select All'
                                            : selectedQuestions.length === userQuizQuestions.length
                                                ? 'Unselect All'
                                                : 'Select All'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm"
                                        style={btnStyle}
                                        onClick={handleDownloadPdf}
                                        ref={downloadPdfRef}
                                    >
                                        Download PDF
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm"
                                        style={btnStyle}
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default QuizUI;
