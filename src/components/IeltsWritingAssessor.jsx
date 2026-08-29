import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import toast from 'react-hot-toast'
import { GoogleGenAI } from '@google/genai'
import CdiWritingLayout from './CdiWritingLayout'
import {
    FaEdit,
    FaClock,
    FaCheckCircle,
    FaBrain,
    FaChartLine,
    FaRedo,
    FaExclamationTriangle,
    FaFileAlt,
    FaAward,
    FaLightbulb,
    FaGraduationCap,
    FaCopy,
    FaPlay,
    FaPause,
    FaBookOpen,
    FaMagic,
    FaSpellCheck,
    FaArrowLeft,
    FaLayerGroup,
    FaChevronRight,
    FaPenFancy
} from 'react-icons/fa'

export default function IeltsWritingAssessor() {
    const { t, i18n } = useTranslation()

    // 6 Full Mock Exams (Task 1 + Task 2)
    const mockExams = [
        {
            id: 'mock_1',
            title: t('ieltsWriting.mock1Title', 'Practice Test 1'),
            subtitle: 'General Training & Academic mix',
            imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&fit=crop',
            timeLimit: 60 * 60,
            task1: {
                id: 't1_b5_2',
                imageUrl: "https://quickchart.io/chart?c={type:'line',data:{labels:['2000','2005','2010','2015','2020'],datasets:[{label:'Buses',data:[15,13,10,8,6],fill:false,borderColor:'red'},{label:'Metro',data:[8,10,12,15,18],fill:false,borderColor:'blue'},{label:'Trams',data:[5,6,6,5,7],fill:false,borderColor:'green'}]}}",
                promptText: t('ieltsWriting.p2Prompt', 'The line graph below shows the number of passengers using three types of public transport in a European city between 2000 and 2020. Summarize the main features and make comparisons.'),
                keyCollocations: ['steady increase', 'dramatic decline', 'remained stable', 'overall trend'],
                structureTip: t('ieltsWritingAssessor.tip2', 'Overview qismida eng ko\'p ishlatilgan va eng kamaygan transport turini ko\'rsating. Keyin raqamlar bilan taqqoslang.'),
                suggestedWords: 150,
                type: t('ieltsWriting.task1Type', 'Task 1 (Academic)')
            },
            task2: {
                id: 't2_b5_1',
                promptText: t('ieltsWriting.p1Prompt', 'Some people think that mobile phones should be banned in schools, while others believe they are useful educational tools. Discuss both views and give your opinion.'),
                keyCollocations: ['educational tool', 'distraction in class', 'academic performance', 'strict regulations'],
                structureTip: t('ieltsWritingAssessor.tip1', 'Kirish qismida mavzuni paraphrase qiling, keyin telefonlarning zarari va foydasini 2 ta alohida paragrafda muhokama qiling.'),
                suggestedWords: 250,
                type: t('ieltsWriting.task2Type', 'Task 2 (Essay)')
            }
        },
        {
            id: 'mock_2',
            title: t('ieltsWriting.mock2Title', 'Practice Test 2'),
            subtitle: 'Science and History focus',
            imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&fit=crop',
            timeLimit: 60 * 60,
            task1: {
                id: 't1_b7_5',
                imageUrl: "https://quickchart.io/chart?c={type:'bar',data:{labels:['Germany','Netherlands','France','UK','Italy','Greece'],datasets:[{label:'2010',data:[78,74,68,65,55,48],backgroundColor:'blue'},{label:'2020',data:[88,83,76,74,64,57],backgroundColor:'red'}]}}",
                promptText: t('ieltsWriting.p5Prompt', 'The bar chart compares the percentage of university graduates in six European countries who found employment within six months of graduation between 2010 and 2020. Summarize key trends.'),
                keyCollocations: ['positive trajectory', 'consistently outperformed', 'substantial growth', 'lagged behind'],
                structureTip: t('ieltsWritingAssessor.tip5', 'Mamlakatlarning eng yuqori ko\'rsatkichlarini pastki guruhlar bilan guruhlab solishtiring.'),
                suggestedWords: 150,
                type: t('ieltsWriting.task1Type', 'Task 1 (Academic)')
            },
            task2: {
                id: 't2_b6_3',
                promptText: t('ieltsWriting.p3Prompt', 'Online distance learning is replacing traditional classroom teaching in many universities. Do the advantages of this development outweigh the disadvantages?'),
                keyCollocations: ['flexibility and convenience', 'geographical barriers', 'lack of interpersonal interaction', 'self-discipline'],
                structureTip: t('ieltsWritingAssessor.tip3', 'Afzalliklari (moslashuvchanlik, arzonlik) va kamchiliklari (jonli muloqot yetishmasligi)ni aniq ajratib ko\'rsating.'),
                suggestedWords: 250,
                type: t('ieltsWriting.task2Type', 'Task 2 (Essay)')
            }
        },
        {
            id: 'mock_3',
            title: t('ieltsWriting.mock3Title', 'Practice Test 3'),
            subtitle: 'Nature and Technology',
            imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&fit=crop',
            timeLimit: 60 * 60,
            task1: {
                id: 't1_b7_7',
                imageUrl: "https://quickchart.io/graphviz?graph=digraph{rankdir=LR;node[shape=box,style=filled,color=lightblue];Collection->PrimaryScreening->SettlingTank->Aeration->Microfiltration->Disinfection->Distribution}",
                promptText: t('ieltsWriting.p7Prompt', 'The diagram illustrates the process of purifying and recycling wastewater for domestic consumption. Describe the stages involved in this system.'),
                keyCollocations: ['multi-stage process', 'primary screening grid', 'microfiltration and reverse osmosis', 'subsequently pumped'],
                structureTip: t('ieltsWritingAssessor.tip7', 'Jarayonning bosqichma-bosqich o\'tish zanjirini o\'tuvchi so\'zlar (Initially, Following this, Subsequently, Finally) bilan tasvirlang.'),
                suggestedWords: 150,
                type: t('ieltsWriting.task1Type', 'Task 1 (Academic)')
            },
            task2: {
                id: 't2_b7_4',
                promptText: t('ieltsWriting.p4Prompt', 'Some people believe that artificial intelligence will replace human workers in most industries, while others argue it will create new opportunities. Discuss both views and give your own opinion.'),
                keyCollocations: ['catalyst for change', 'render human labor obsolete', 'autonomous algorithms', 'reskilling initiatives'],
                structureTip: t('ieltsWritingAssessor.tip4', 'AI tufayli yo\'qoladigan kasblar va yangi yaratiladigan professional yo\'nalishlarni chuqur dalillang.'),
                suggestedWords: 250,
                type: t('ieltsWriting.task2Type', 'Task 2 (Essay)')
            }
        },
        {
            id: 'mock_4',
            title: t('ieltsWriting.mock4Title', 'Practice Test 4'),
            subtitle: 'Arts and Culture',
            imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&fit=crop',
            timeLimit: 60 * 60,
            task1: {
                id: 't1_b8_10',
                imageUrl: "https://quickchart.io/chart?c={type:'pie',data:{labels:['Coal','Natural%20Gas','Petroleum','Nuclear','Solar/Wind'],datasets:[{data:[42,28,18,7,5]}]}}",
                promptText: t('ieltsWriting.p10Prompt', 'The pie charts show the proportions of energy generated from different sources in a developed nation in 2005 and projected figures for 2035. Summarize the main features and make comparisons.'),
                keyCollocations: ['dominant energy source', 'projected to undergo a major shift', 'diminishing reliance on fossil fuels', 'exponential surge'],
                structureTip: t('ieltsWritingAssessor.tip10', 'Qazilma yoqilg\'ilarining pasayishini tiklanuvchi manbalarning eksponensial o\'sishi bilan qarama-qarshi qo\'yib taqqoslang.'),
                suggestedWords: 150,
                type: t('ieltsWriting.task1Type', 'Task 1 (Academic)')
            },
            task2: {
                id: 't2_b7_6',
                promptText: t('ieltsWriting.p6Prompt', 'Many young people prefer going directly into employment after high school rather than pursuing a university degree. Do the advantages of this trend outweigh the disadvantages?'),
                keyCollocations: ['financial autonomy', 'tertiary education', 'knowledge-based economies', 'career progression capped'],
                structureTip: t('ieltsWritingAssessor.tip6', 'Erta maosh olish (afzallik) bilan uzoq muddatli martaba cheklovi (kamchilik) o\'rtasidagi balansni yoritib bering.'),
                suggestedWords: 250,
                type: t('ieltsWriting.task2Type', 'Task 2 (Essay)')
            }
        },
        {
            id: 'mock_5',
            title: t('ieltsWriting.mock5Title', 'Practice Test 5'),
            subtitle: 'Advanced Academic Reading',
            imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&fit=crop',
            timeLimit: 60 * 60,
            task1: {
                id: 't1_b9_12',
                imageUrl: "https://quickchart.io/graphviz?graph=digraph{node[shape=box];Willington1995->Willington2025;Farmland->ResidentialZone;Factory->CommercialComplex;FishingPort->PublicMarina}",
                promptText: t('ieltsWriting.p12Prompt', 'The maps below show the town of Willington in 1995 and proposed redevelopment plans for 2025. Summarize the main features and make comparisons where relevant.'),
                keyCollocations: ['extensive modernization', 'residential zone expansion', 'pedestrianized thoroughfare', 'reconstructed into commercial complexes'],
                structureTip: t('ieltsWritingAssessor.tip12', 'Shahar xaritasining 30 yillik o\'zgarishini yo\'nalishlar (north, south, east, west) va infratuzilma bo\'yicha taqqoslang.'),
                suggestedWords: 150,
                type: t('ieltsWriting.task1Type', 'Task 1 (Academic)')
            },
            task2: {
                id: 't2_b7_8',
                promptText: t('ieltsWriting.p8Prompt', 'Should governments take sole responsibility for solving environmental issues, or should individuals change their lifestyle habits? Discuss both views and give your opinion.'),
                keyCollocations: ['ecological degradation', 'statutory enforcement', 'pivotal role', 'synchronized effort'],
                structureTip: t('ieltsWritingAssessor.tip8', 'Hukumatning qonuniy vakolatlari va fuqarolarning shaxsiy mas\'uliyatini sinxronlashtirish kerakligini xulosalang.'),
                suggestedWords: 250,
                type: t('ieltsWriting.task2Type', 'Task 2 (Essay)')
            }
        },
        {
            id: 'mock_6',
            title: t('ieltsWriting.mock6Title', 'Practice Test 6'),
            subtitle: 'Comprehensive Exam',
            imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&fit=crop',
            timeLimit: 60 * 60,
            task1: {
                id: 't1_b6_15',
                imageUrl: "https://quickchart.io/graphviz?graph=digraph{rankdir=LR;node[shape=box,style=rounded,color=orange];Harvest->Sort->Dry->Hull->Roast->Grind->Package}",
                promptText: t('ieltsWriting.p15Prompt', 'The diagram illustrates the process of coffee production from coffee bean harvesting to retail packaging. Describe the stages involved.'),
                keyCollocations: ['sequential stages', 'harvested and sorted', 'roasted at high temperatures', 'vacuum-sealed packaging'],
                structureTip: t('ieltsWritingAssessor.tip15', 'Kofe tayyorlash bosqichlarini xronologik tartibda va nisbat shaklida (is roasted, are packaged) yozing.'),
                suggestedWords: 150,
                type: t('ieltsWriting.task1Type', 'Task 1 (Academic)')
            },
            task2: {
                id: 't2_b8_9',
                promptText: t('ieltsWriting.p9Prompt', 'Providing a Universal Basic Income (UBI) to all citizens regardless of employment status is proposed as a solution to wealth inequality. Discuss the feasibility and potential consequences.'),
                keyCollocations: ['socioeconomic disparities', 'fiscal feasibility', 'hyper-automation', 'unprecedented strain on public coffers'],
                structureTip: t('ieltsWritingAssessor.tip9', 'Iqtisodiy barqarorlik, avtomatlashtirish va moliyaviy manbalar o\'rtasidagi murakkab munosabatni C1/C2 lofatlar bilan tahlil qiling.'),
                suggestedWords: 250,
                type: t('ieltsWriting.task2Type', 'Task 2 (Essay)')
            }
        }
    ];

    // Navigation & State Management
    const [screen, setScreen] = useState('home') // 'home' | 'workspace'
    const [selectedPrompt, setSelectedPrompt] = useState(null)

    const featuredMocks = mockExams;

    // Editor & Timer States
    const [essayText1, setEssayText1] = useState('')
    const [essayText2, setEssayText2] = useState('')
    const [timerSeconds, setTimerSeconds] = useState(40 * 60)
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [timeWarning, setTimeWarning] = useState(false)
    const [copiedToast, setCopiedToast] = useState(false)
    const timerIntervalRef = useRef(null)

    // AI Analysis States
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState(null)
    const [showSampleAnswer, setShowSampleAnswer] = useState(false)

    // Reset timer when active prompt changes
    useEffect(() => {
        if (!selectedPrompt) return
        setTimerSeconds(selectedPrompt.timeLimit)
        setIsTimerRunning(false)
        setTimeWarning(false)
        setEssayText1('')
        setEssayText2('')
        setAnalysisResult(null)
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    }, [selectedPrompt])

    // Timer Interval Logic
    useEffect(() => {
        if (isTimerRunning) {
            timerIntervalRef.current = setInterval(() => {
                setTimerSeconds((prev) => {
                    if (prev <= 300 && prev > 0) setTimeWarning(true)
                    if (prev <= 1) {
                        clearInterval(timerIntervalRef.current)
                        setIsTimerRunning(false)
                        setTimeWarning(false)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        } else {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
        }

        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
        }
    }, [isTimerRunning])

    const formatTimer = (totalSecs) => {
        const mins = Math.floor(totalSecs / 60)
        const secs = totalSecs % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }


    // Open a prompt and go to workspace
    const openPrompt = (prompt) => {
        setSelectedPrompt(prompt)
        setEssayText1('')
        setEssayText2('')
        setAnalysisResult(null)
        setTimerSeconds(prompt.timeLimit)
        setIsTimerRunning(false)
        setTimeWarning(false)
        setShowSampleAnswer(false)
        setScreen('workspace')
    }

    // Copy Essay Text
    const copyToClipboard = () => {
        if (essayText1 || essayText2) {
            navigator.clipboard.writeText("Task 1:\n" + essayText1 + "\n\nTask 2:\n" + essayText2)
            setCopiedToast(true)
            setTimeout(() => setCopiedToast(false), 2000)
        }
    }

    // Load Model Answer
    const loadSampleAnswer = () => {
        setAnalysisResult(null)
    }

    // Collocations & Connectors Reference Lists
    const academicCollocations = [
        'substantially', 'paramount', 'prevalent', 'detrimental', 'exponential',
        'inevitable', 'contemplate', 'mitigate', 'unprecedented', 'indispensable',
        'profound impact', 'pivotal role', 'pressing issue', 'widespread adoption',
        'overwhelming evidence', 'fundamental right', 'sustainable development',
        'catalyst for change', 'imperative that', 'far-reaching consequences',
        'play a key role', 'pose a threat', 'take measures', 'drive growth',
        'bridge the gap', 'subsequent period', 'striking feature', 'upward trend'
    ]

    const connectors = [
        'furthermore', 'however', 'consequently', 'in contrast', 'moreover',
        'on the other hand', 'therefore', 'overall', 'in conclusion',
        'nevertheless', 'nonetheless', 'specifically', 'to illustrate',
        'in spite of', 'accordingly', 'conversely', 'notably', 'in addition',
        'as a result', 'on the one hand', 'firstly', 'secondly', 'similarly'
    ]

    const commonOverusedWords = {
        'good': ['beneficial', 'advantageous', 'positive', 'valuable'],
        'bad': ['detrimental', 'harmful', 'adverse', 'negative'],
        'big': ['substantial', 'significant', 'considerable', 'enormous'],
        'important': ['crucial', 'vital', 'essential', 'paramount'],
        'people': ['individuals', 'citizens', 'members of society', 'the public'],
        'problem': ['issue', 'challenge', 'obstacle', 'predicament'],
        'think': ['believe', 'assert', 'maintain', 'contend'],
        'make': ['create', 'foster', 'generate', 'produce']
    }

    // Simulate AI Examiner Evaluation Engine using Local Logic

    const runAIWritingAnalysis = async () => {
        const text1 = essayText1.trim();
        const text2 = essayText2.trim();
        const wordCount1 = text1.split(/\s+/).filter(Boolean).length;
        const wordCount2 = text2.split(/\s+/).filter(Boolean).length;
        const totalWordCount = wordCount1 + wordCount2;

        if (wordCount1 < 15 || wordCount2 < 15) {
            toast.error(
                i18n.language === 'uz' || i18n.language === 'uz-latn' 
                ? "Iltimos, tekshirish uchun Task 1 va Task 2 ga yetarlicha so'z yozing! (Kamida 15 ta)"
                : "Please write enough words for both Task 1 and Task 2 to be evaluated! (At least 15 words)",
                {
                    duration: 4000,
                    style: {
                        borderRadius: '10px',
                        background: '#1f212a',
                        color: '#fff',
                        border: '1px solid #353846'
                    },
                }
            );
            return;
        }

        setIsAnalyzing(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            let parsedResult;

            if (!apiKey) {
                // MOCK RESPONSE FOR TESTING UI WITHOUT API KEY
                await new Promise(resolve => setTimeout(resolve, 2000));
                parsedResult = {
                    overallBand: 6.5,
                    taskResponse: 6.0,
                    coherence: 6.5,
                    lexical: 7.0,
                    grammar: 6.5,
                    foundCollocations: ["steady increase", "crucial role"],
                    foundConnectors: ["furthermore", "however"],
                    overusedWordsDetected: [],
                    strengths: [
                        i18n.language === 'en' ? "Good overall structure." : "Umumiy struktura juda yaxshi tuzilgan.",
                        i18n.language === 'en' ? "Clear paragraphing." : "Paragraflar to'g'ri ajratilgan va mantiqiy bog'langan."
                    ],
                    improvements: [
                        i18n.language === 'en' ? "Use more complex sentences." : "Murakkab gap tuzilmalaridan ko'proq foydalaning.",
                        i18n.language === 'en' ? "Expand vocabulary." : "So'z boyligingizni (vocabulary) yanada kengaytiring."
                    ]
                };
            } else {
                const promptStr = `
You are an expert, strict IELTS examiner. Assess the following IELTS Full Mock Test.
Task 1 (Requires >=150 words):
Prompt: ${selectedPrompt.task1.promptText}
Essay 1:
"${text1}"

Task 2 (Requires >=250 words):
Prompt: ${selectedPrompt.task2.promptText}
Essay 2:
"${text2}"

Evaluate BOTH tasks strictly according to IELTS criteria. Task 2 carries twice the weight of Task 1 for the overall band.
Return a valid JSON object EXACTLY in this format:
{
  "overallBand": 6.5,
  "taskResponse": 6.5,
  "coherence": 6.0,
  "lexical": 7.0,
  "grammar": 6.5,
  "wordCount": ${totalWordCount},
  "minRequired": 400,
  "foundCollocations": ["academic phrase 1", "phrase 2"],
  "foundConnectors": ["therefore", "however"],
  "overusedWordsDetected": [
    { "word": "good", "count": 5, "synonyms": ["excellent", "beneficial"] }
  ],
  "strengths": ["Clear overall structure in both tasks", "Good use of transition words"],
  "improvements": ["Use more complex sentences in Task 2", "Task 1 overview needs more detail"]
}

Rules:
- The strings in 'strengths' and 'improvements' MUST be entirely in ${i18n.language === 'uz' ? 'Uzbek' : i18n.language === 'ru' ? 'Russian' : 'English'} language.
- Provide 2-3 specific, actionable feedback points in strengths and improvements based closely on the actual essay content.
- Ensure the response is pure JSON without markdown codeblocks. Do not include \`\`\`json or \`\`\`.
`;

                const response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                    {
                        contents: [{ parts: [{ text: promptStr }] }],
                        generationConfig: {
                            responseMimeType: "application/json"
                        }
                    }
                );

                let responseText = response.data.candidates[0].content.parts[0].text;
                if (responseText.startsWith('```json')) {
                    responseText = responseText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
                }

                parsedResult = JSON.parse(responseText);
            }
            
            setAnalysisResult({
                underLength: false,
                overallBand: parsedResult.overallBand || 0,
                taskResponse: parsedResult.taskResponse || 0,
                coherence: parsedResult.coherence || 0,
                lexical: parsedResult.lexical || 0,
                grammar: parsedResult.grammar || 0,
                wordCount: totalWordCount,
                minRequired: 400,
                foundCollocations: parsedResult.foundCollocations || [],
                foundConnectors: parsedResult.foundConnectors || [],
                overusedWordsDetected: parsedResult.overusedWordsDetected || [],
                strengths: parsedResult.strengths || [],
                improvements: parsedResult.improvements || []
            });
        } catch (error) {
            console.error("AI Analysis Error:", error);
            alert("Sun'iy intellekt xizmatiga ulanishda xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
        } finally {
            setIsAnalyzing(false);
        }
    }

    if (screen === 'home') {
        return (
            <div className="min-h-screen pt-28 pb-12 font-sans bg-transparent transition-colors flex flex-col items-center">
                <div className="w-full max-w-5xl px-4 lg:px-8">
                {/* Hero Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-14">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-widest"
                    >
                        <FaGraduationCap className="text-sm" />
                        <span>{t('ieltsWritingAssessor.academicWritingTest')}</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight"
                    >
                        {t('ieltsWritingAssessor.writingSimulator')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed"
                    >
                        {t('ieltsWritingAssessor.selectTopicSubtitle')}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredMocks.map((mock, idx) => (
                        <motion.div
                            key={mock.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/80 dark:bg-black/95 glass-card backdrop-blur-2xl rounded-3xl p-6 border border-slate-200 dark:border-red-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(220,38,38,0.15)] hover:shadow-xl dark:hover:shadow-[0_12px_40px_rgba(220,38,38,0.3)] hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-500/20 text-red-600 flex items-center justify-center text-xl">
                                    <FaBookOpen />
                                </div>
                                <span className="text-xs font-bold px-3 py-1 bg-slate-200/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-full">
                                    60 Min
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                                {mock.title}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-1">
                                {mock.subtitle || `${mock.task1.type} & ${mock.task2.type}`}
                            </p>

                            <button
                                onClick={(e) => { e.stopPropagation(); openPrompt(mock); }}
                                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors group-hover:shadow-lg group-hover:shadow-red-600/30"
                            >
                                Start Test <FaPlay className="text-xs" />
                            </button>
                        </motion.div>
                    ))}
                </div>
                </div>
            </div>
        )
    }

    /* ==================== SCREEN 3: MAIN WRITING WORKSPACE ==================== */
    if (screen === 'workspace') {
        return (
            <CdiWritingLayout
                prompt={selectedPrompt}
                essayText1={essayText1}
                setEssayText1={setEssayText1}
                essayText2={essayText2}
                setEssayText2={setEssayText2}
                onExit={() => setScreen('home')}
                onSubmit={runAIWritingAnalysis}
                isAnalyzing={isAnalyzing}
                analysisResult={analysisResult}
                onClearResult={() => setAnalysisResult(null)}
            />
        );
    }
    
    return null;
}
