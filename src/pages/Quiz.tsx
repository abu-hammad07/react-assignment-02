import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";

/** ========== Config ==========
 * Adjust these to taste
 */
const QUESTION_COUNT = 10;        // 5–10 as required
const QUESTION_TIME = 20;         // seconds per question (15–30 per spec)
const API_URL = `https://opentdb.com/api.php?amount=${QUESTION_COUNT}&type=multiple&encode=url3986`;

/** ========== Types ==========
 * Open Trivia DB url3986-encoded response
 */
type OTDBQuestion = {
    category: string;
    type: "multiple";
    difficulty: "easy" | "medium" | "hard";
    question: string; // url3986-encoded
    correct_answer: string; // url3986-encoded
    incorrect_answers: string[]; // url3986-encoded
};

type OTDBResponse = {
    response_code: number;
    results: OTDBQuestion[];
};

type QuizQuestion = {
    id: string;
    question: string;         // decoded
    options: string[];        // decoded, shuffled
    correct: string;          // decoded
    difficulty: string;
    category: string;
};

type UserAnswer = {
    questionId: string;
    selected?: string; // undefined if timed out/skipped
    correct: string;
    isCorrect: boolean;
    question: string;
    options: string[];
};

/** ========== Helpers ==========
 * OpenTDB with encode=url3986 lets us decode safely
 */
const d = (s: string) => decodeURIComponent(s.replace(/\+/g, "%20"));

function shuffle<T>(arr: T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/** ========== Component ==========
 */
export default function Quiz() {
    const [status, setStatus] = useState<"idle" | "loading" | "active" | "finished">("idle");
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [index, setIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
    const [locked, setLocked] = useState(false); // lock options after submit or timeout
    const [answers, setAnswers] = useState<UserAnswer[]>([]);
    const timerRef = useRef<number | null>(null);

    const total = questions.length;
    const current = questions[index];

    // Derived score
    const score = useMemo(
        () => answers.reduce((acc, a) => acc + (a.isCorrect ? 1 : 0), 0),
        [answers]
    );

    const progressPct = useMemo(() => {
        if (total === 0) return 0;
        return ((index) / total) * 100;
    }, [index, total]);

    /** Start quiz: fetch questions */
    const startQuiz = async () => {
        setStatus("loading");
        setAnswers([]);
        setIndex(0);
        setTimeLeft(QUESTION_TIME);
        setLocked(false);

        try {
            const res = await fetch(API_URL);
            const data: OTDBResponse = await res.json();

            const normalized: QuizQuestion[] = data.results.map((q, i) => {
                const correct = d(q.correct_answer);
                const options = shuffle([correct, ...q.incorrect_answers.map(d)]);
                return {
                    id: `${i}-${Date.now()}`,
                    question: d(q.question),
                    options,
                    correct,
                    difficulty: q.difficulty,
                    category: d(q.category),
                };
            });

            setQuestions(normalized);
            setStatus("active");
            setTimeLeft(QUESTION_TIME);
        } catch (e) {
            console.error(e);
            alert("Failed to load questions. Please try again.");
            setStatus("idle");
        }
    };

    /** Clear interval */
    const clearTimer = () => {
        if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    /** Start / restart countdown for current question */
    const startTimer = useCallback(() => {
        clearTimer();
        setTimeLeft(QUESTION_TIME);
        timerRef.current = window.setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    // time's up -> auto submit as skipped/wrong and auto-next
                    clearTimer();
                    handleTimeout();
                }
                return t - 1;
            });
        }, 1000);
    }, []);

    /** When active or index changes, start timer */
    useEffect(() => {
        if (status === "active") {
            startTimer();
            setLocked(false);
        }
        return clearTimer; // cleanup on unmount or status change
    }, [status, index, startTimer]);

    /** Handle selecting an option (locks immediately) */
    const handleSelect = (option: string) => {
        if (locked || !current) return;
        // Stop timer and lock
        clearTimer();
        setLocked(true);

        const isCorrect = option === current.correct;
        setAnswers((prev) => [
            ...prev,
            {
                questionId: current.id,
                selected: option,
                correct: current.correct,
                isCorrect,
                question: current.question,
                options: current.options,
            },
        ]);
    };

    /** If time runs out, record as skipped/wrong (no selection) and move next */
    const handleTimeout = () => {
        if (!current) return;
        if (!locked) {
            setLocked(true);
            setAnswers((prev) => [
                ...prev,
                {
                    questionId: current.id,
                    selected: undefined,
                    correct: current.correct,
                    isCorrect: false,
                    question: current.question,
                    options: current.options,
                },
            ]);
            // Small delay so user sees 0, then auto-next
            setTimeout(() => handleNext(), 400);
        }
    };

    /** Next question or finish */
    const handleNext = () => {
        if (index + 1 < total) {
            setIndex((i) => i + 1);
            setLocked(false);
            setTimeLeft(QUESTION_TIME);
            startTimer();
        } else {
            clearTimer();
            setStatus("finished");
        }
    };

    const restart = () => {
        setStatus("idle");
        setQuestions([]);
        setAnswers([]);
        setIndex(0);
        setTimeLeft(QUESTION_TIME);
        setLocked(false);
    };

    /** UI: Buttons */
    const canGoNext = locked; // You can only move next after submit or timeout

    return (
        <>
        <Header />
        <div className="max-w-2xl mx-auto p-6 mt-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Quiz App</h1>
                {status !== "active" && (
                    <button
                        onClick={status === "finished" ? restart : startQuiz}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {status === "finished" ? "Restart" : "Start Quiz"}
                    </button>
                )}
            </div>

            {/* Loading */}
            {status === "loading" && (
                <div className="p-6 border rounded-lg">Loading questions…</div>
            )}

            {/* Active Quiz */}
            {status === "active" && current && (
                <div className="space-y-5">
                    {/* Progress */}
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span>
                                Question {index + 1} / {total}
                            </span>
                            <span>Score: {answers.filter(a => a.isCorrect).length}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded">
                            <div
                                className="h-2 bg-blue-600 rounded transition-all"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    </div>

                    {/* Timer + Meta */}
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">{current.category}</span>{" "}
                            <span className="ml-2 px-2 py-0.5 rounded bg-gray-100">
                                {current.difficulty}
                            </span>
                        </div>
                        <div
                            className={`text-lg font-semibold ${timeLeft <= 5 ? "text-red-600" : "text-gray-800"
                                }`}
                        >
                            ⏳ {timeLeft}s
                        </div>
                    </div>

                    {/* Question */}
                    <div className="text-lg font-medium">{current.question}</div>

                    {/* Options */}
                    <div className="grid gap-3">
                        {current.options.map((opt) => {
                            const selected = answers.find(a => a.questionId === current.id)?.selected;
                            const isSelected = selected === opt;

                            // While locked, show immediate correctness coloring for the current question
                            const showFeedback = locked;
                            const isCorrectOption = opt === current.correct;

                            const base =
                                "w-full text-left px-4 py-3 rounded border transition disabled:opacity-70";
                            const normal =
                                "bg-white border-gray-200 hover:bg-gray-50";
                            const selectedCls =
                                "border-blue-500 ring-2 ring-blue-200";
                            const correctCls =
                                "bg-green-50 border-green-500";
                            const wrongCls =
                                "bg-red-50 border-red-500";

                            let className = `${base} ${normal}`;
                            if (isSelected && !showFeedback) className = `${base} ${selectedCls}`;
                            if (showFeedback) {
                                if (isCorrectOption) className = `${base} ${correctCls}`;
                                else if (isSelected && !isCorrectOption) className = `${base} ${wrongCls}`;
                            }

                            return (
                                <button
                                    key={opt}
                                    className={className}
                                    onClick={() => handleSelect(opt)}
                                    disabled={locked}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>

                    {/* Controls */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={handleNext}
                            disabled={!canGoNext}
                            className={`px-4 py-2 rounded ${canGoNext
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            {index + 1 === total ? "Finish" : "Next"}
                        </button>
                    </div>
                </div>
            )}

            {/* Results */}
            {status === "finished" && (
                <div className="space-y-6">
                    <div className="p-5 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Results</h2>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="p-3 rounded bg-green-50 border border-green-200">
                                <div className="text-gray-600">Total Score</div>
                                <div className="text-2xl font-bold">
                                    {score} / {total}
                                </div>
                            </div>
                            <div className="p-3 rounded bg-blue-50 border border-blue-200">
                                <div className="text-gray-600">Questions</div>
                                <div className="text-2xl font-bold">{total}</div>
                            </div>
                            <div className="p-3 rounded bg-green-50 border border-green-200">
                                <div className="text-gray-600">Correct</div>
                                <div className="text-2xl font-bold">
                                    {answers.filter((a) => a.isCorrect).length}
                                </div>
                            </div>
                            <div className="p-3 rounded bg-red-50 border border-red-200">
                                <div className="text-gray-600">Incorrect / Skipped</div>
                                <div className="text-2xl font-bold">
                                    {answers.filter((a) => !a.isCorrect).length}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={restart}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Restart
                            </button>
                            <button
                                onClick={startQuiz}
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                            >
                                New Quiz
                            </button>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Answer Breakdown</h3>
                        <ol className="space-y-4 list-decimal pl-6">
                            {answers.map((a, i) => {
                                const isCorrect = a.isCorrect;
                                return (
                                    <li key={a.questionId} className="space-y-2">
                                        <div className="font-medium">{i + 1}. {a.question}</div>
                                        <div className="grid gap-2">
                                            {a.options.map((opt) => {
                                                const isSelected = a.selected === opt;
                                                const isCorrectOpt = opt === a.correct;
                                                let cls =
                                                    "px-3 py-2 rounded border bg-white";
                                                if (isCorrectOpt) cls = "px-3 py-2 rounded border bg-green-50 border-green-400";
                                                if (isSelected && !isCorrectOpt)
                                                    cls = "px-3 py-2 rounded border bg-red-50 border-red-400";
                                                return (
                                                    <div key={opt} className={cls}>
                                                        {opt}
                                                        {isCorrectOpt && <span className="ml-2 text-green-700 text-xs">✓ correct</span>}
                                                        {isSelected && !isCorrectOpt && <span className="ml-2 text-red-700 text-xs">your answer</span>}
                                                        {isSelected && isCorrectOpt && <span className="ml-2 text-green-700 text-xs">your answer</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                </div>
            )}

            {/* Idle state */}
            {status === "idle" && (
                <div className="p-6 border rounded-lg">
                    <p className="mb-4">
                        Click <span className="font-semibold">Start Quiz</span> to fetch{" "}
                        {QUESTION_COUNT} multiple-choice questions from Open Trivia DB.
                    </p>
                    <ul className="list-disc pl-6 text-sm text-gray-600">
                        <li>Each question has {QUESTION_TIME} seconds.</li>
                        <li>Timeout auto-skips and marks wrong.</li>
                        <li>Answers lock once selected or timer expires.</li>
                        <li>See full breakdown at the end.</li>
                    </ul>
                </div>
            )}
        </div>
        </>
    );
}
