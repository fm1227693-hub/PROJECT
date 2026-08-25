import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
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
    const { t } = useTranslation()

    // 6 Full Mock Exams (Task 1 + Task 2)
    const mockExams = [
        {
            id: 'mock_1',
            title: t('ieltsWriting.mock1Title', 'IELTS Writing Mock Test 1'),
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
            title: t('ieltsWriting.mock2Title', 'IELTS Writing Mock Test 2'),
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
            title: t('ieltsWriting.mock3Title', 'IELTS Writing Mock Test 3'),
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
            title: t('ieltsWriting.mock4Title', 'IELTS Writing Mock Test 4'),
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
            title: t('ieltsWriting.mock5Title', 'IELTS Writing Mock Test 5'),
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
            title: t('ieltsWriting.mock6Title', 'IELTS Writing Mock Test 6'),
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
            setIsAnalyzing(true);
            setTimeout(() => {
                setAnalysisResult({
                    underLength: true,
                    overallBand: 0.0,
                    taskResponse: 0.0,
                    coherence: 0.0,
                    lexical: 0.0,
                    grammar: 0.0,
                    wordCount: totalWordCount,
                    minRequired: 400,
                    foundCollocations: [],
                    foundConnectors: [],
                    overusedWordsDetected: [],
                    strengths: [
                        t('ieltsWritingAssessor.underLengthTitle', 'Insholardan birining hajmi juda kam. Ball: 0.0')
                    ],
                    improvements: [
                        t('ieltsWritingAssessor.underLengthTip', 'IELTS mezoniga ko\'ra Task 1 uchun kamida 150 ta so\'z, Task 2 uchun 250 ta so\'z yozilishi shart.')
                    ]
                });
                setIsAnalyzing(false);
            }, 600);
            return;
        }

        setIsAnalyzing(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) {
                alert("API Key topilmadi! Iltimos .env faylga VITE_GEMINI_API_KEY kiriting.");
                setIsAnalyzing(false);
                return;
            }

            const ai = new GoogleGenAI({ apiKey });
            
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
- The strings in 'strengths' and 'improvements' MUST be entirely in Uzbek language (because the site users speak Uzbek).
- Provide 2-3 specific, actionable feedback points in strengths and improvements based closely on the actual essay content.
- Ensure the response is pure JSON without markdown codeblocks. Do not include \`\`\`json or \`\`\`.
`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: promptStr,
                config: {
                    responseMimeType: "application/json",
                }
            });

            let responseText = response.text;
            if (responseText.startsWith('```json')) {
                responseText = responseText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
            }

            const parsedResult = JSON.parse(responseText);
            
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
            <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
                {/* Ambient Red Glow */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-red-600/15 via-rose-500/10 to-blue-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredMocks.map(mock => (
                        <div key={mock.id} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer" onClick={() => openPrompt(mock)}>
                            <div className="h-48 overflow-hidden relative">
                                <img src={mock.imageUrl} alt={mock.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                                    Mock Test
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-xl font-bold text-white leading-snug">{mock.title}</h3>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                        <span className="font-bold text-slate-900 dark:text-white">Part 1:</span> {mock.task1.type}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium line-clamp-2">
                                        <span className="font-bold text-slate-900 dark:text-white">Part 2:</span> {mock.task2.type}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-bold">
                                        <FaClock className="text-red-500" />
                                        60 mins
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); openPrompt(mock); }}
                                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold text-sm flex items-center gap-1 transition-colors group-hover:translate-x-1"
                                    >
                                        Start Exam <FaChevronRight className="text-xs" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
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
