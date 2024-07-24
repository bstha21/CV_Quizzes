import React, { useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import {FaArrowRight, FaArrowLeft} from "react-icons/fa";

export default function QuizUI() {
    const [formData, setFormData] = useState({
        subject: '',
        grade: '',
        duration: '',
        textarea: '',
        pdf_file: null,
    });

    const [apiResponse, setApiResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { subject, grade, duration, textarea, pdf_file } = formData;

        if (!subject || !grade || !duration || !textarea || !pdf_file) {
            alert('Please fill in all fields.');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('subject', subject);
        formDataToSend.append('grade', grade);
        formDataToSend.append('duration', duration);
        formDataToSend.append('command', textarea);
        formDataToSend.append('file', pdf_file);

        setIsLoading(true);

        try {
            const response = await axios.post('https://chatbot.chimpvine.com/generate_lesson_plan', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setApiResponse(response.data);
            setFormData({
                subject: '',
                grade: '',
                duration: '',
                textarea: '',
                pdf_file: null,
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate the lesson plan. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <NavBar />
            <div className="container">
                <div className="row justify-content-center mt-3">
                    {!apiResponse ? (
                        <div className="col-md-5 border border-4 rounded-3 pt-4 pb-3 ps-5 pe-5 shadow p-3 bg-body rounded">
                            <form onSubmit={handleSubmit}>
                                <h4 className="text-center mb-3">Lesson Planner Generator</h4>
                                <div className="mb-2">
                                    <label htmlFor="subject" className="form-label">
                                        Subject <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <select
                                        className="form-select form-select-sm mb-3"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    >
                                        {subjects.map((element, index) => (
                                            <option key={index} value={element.value}>
                                                {element.label}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="grade" className="form-label">
                                        Grade <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <select
                                        className="form-select form-select-sm mb-3"
                                        id="grade"
                                        name="grade"
                                        value={formData.grade}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    >
                                        {grades.map((grade, index) => (
                                            <option key={index} value={grade.value}>
                                                {grade.label}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="duration" className="form-label">
                                        Duration <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <select
                                        className="form-select form-select-sm mb-3"
                                        id="duration"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    >
                                        {lessonDurations.map((duration, index) => (
                                            <option key={index} value={duration.value}>
                                                {duration.label}
                                            </option>
                                        ))}
                                    </select>

                                    <label htmlFor="textarea" className="form-label">
                                        Your Input <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <textarea
                                        type="text"
                                        className="form-control form-control-sm mb-2"
                                        placeholder="Enter your prompt here"
                                        id="textarea"
                                        name="textarea"
                                        value={formData.textarea}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />

                                    <label htmlFor="pdf_file" className="form-label">
                                        File Upload <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control form-control-sm mb-2"
                                        id="pdf_file"
                                        name="pdf_file"
                                        accept="application/pdf"
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="d-flex justify-content-between mt-3">
                                    <button type="submit" className="btn btn-sm" style={{ backgroundColor: '#FF683B', color: 'white' }} disabled={isLoading}>
                                        {isLoading ? 'Generating...' : 'Generate'} <FaArrowRight />
                                    </button>
                                    <button type="button" className="btn btn-sm" style={{ backgroundColor: '#FF683B', color: 'white' }} onClick={() => setFormData({
                                        subject: '',
                                        grade: '',
                                        duration: '',
                                        textarea: '',
                                        pdf_file: null,
                                    })} disabled={isLoading}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="mt-3">
                            {parseLessonPlan(apiResponse.lesson_plan)}
                            <button className="btn btn-sm mt-2 mb-3" style={{ backgroundColor: '#FF683B', color: 'white' }} onClick={() => setApiResponse(null)}>
                                <FaArrowLeft/> Generator Another Lessons
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

const parseLessonPlan = (lessonPlan) => {
    return (
        <div className="container mt-3 mb-2 border border-4 rounded-3 pt-4 pb-3 ps-5 pe-5 shadow p-3 bg-body rounded">
            <div dangerouslySetInnerHTML={{ __html: lessonPlan }} />
        </div>
    );
};

const subjects = [
    { value: "", label: "Choose Subject" },
    { value: "english", label: "English" },
    { value: "math", label: "Math" },
    { value: "science", label: "Science" },
    { value: "social_studies", label: "Social Studies" },
    { value: "reading", label: "Reading" },
    { value: "writing", label: "Writing" },
    { value: "art", label: "Art" },
    { value: "music", label: "Music" },
    { value: "physical_education", label: "Physical Education" },
    { value: "health", label: "Health" },
    { value: "technology", label: "Technology" },
    { value: "library", label: "Library" },
    { value: "foreign_language", label: "Foreign Language" }
];

const grades = [
    { value: "", label: "Choose Grade" },
    { value: "k", label: "Kindergarten" },
    { value: "1", label: "1st Grade" },
    { value: "2", label: "2nd Grade" },
    { value: "3", label: "3rd Grade" },
    { value: "4", label: "4th Grade" },
    { value: "5", label: "5th Grade" },
    { value: "6", label: "6th Grade" },
    { value: "7", label: "7th Grade" },
    { value: "8", label: "8th Grade" },
    { value: "9", label: "9th Grade" },
    { value: "10", label: "10th Grade" },
    { value: "11", label: "11th Grade" },
    { value: "12", label: "12th Grade" }
];

const lessonDurations = [
    { value: "", label: "Choose Duration" },
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
    { value: "75", label: "1 hour 15 minutes" },
    { value: "90", label: "1 hour 30 minutes" },
    { value: "105", label: "1 hour 45 minutes" },
    { value: "120", label: "2 hours" },
    { value: "135", label: "2 hours 15 minutes" },
    { value: "150", label: "2 hours 30 minutes" },
    { value: "165", label: "2 hours 45 minutes" },
    { value: "180", label: "3 hours" }
];
