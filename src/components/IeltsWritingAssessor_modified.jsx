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

    // 15 Comprehensive IELTS Writing Prompts database (Band 5.0 to Band 9.0)
    const mockExams = [
      {
        id: `mock_1`,
        title: t('ieltsWriting.mock1Title', 'IELTS Writing Mock Test 1'),
        imageUrl: `https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&fit=crop`,
        timeLimit: 3600,
        task1: {
          id: `t1_b5_2`,
          imageUrl: `https://quickchart.io/chart?c={type:'line',data:{labels:['2000','2005','2010','2015','2020'],datasets:[{label:'Buses',data:[15,13,10,8,6],fill:false,borderColor:'red'},{label:'Metro',data:[8,10,12,15,18],fill:false,borderColor:'blue'},{label:'Trams',data:[5,6,6,5,7],fill:false,borderColor:'green'}]}}`,
          promptText: t('ieltsWriting.p2Prompt', 'The line graph below shows the number of passengers using three types of public transport in a European city between 2000 and 2020. Summarize the main features and make comparisons.'),
          keyCollocations: [
            `steady increase`,
            `dramatic decline`,
            `remained stable`,
            `overall trend`
          ],
          structureTip: t('ieltsWritingAssessor.tip2', 'Overview qismida eng ko\'p ishlatilgan va eng kamaygan transport turini ko\'rsating. Keyin raqamlar bilan taqqoslang.'),
          suggestedWords: 150,
          type: t('ieltsWriting.task1Type', 'Task 1 (Academic)')
        },
        task2: {
          id: `t2_b5_1`,
          promptText: t('ieltsWriting.p1Prompt', 'Some people think that mobile phones should be banned in schools, while others believe they are useful educational tools. Discuss both views and give your opinion.'),
          keyCollocations: [
            `educational tool`,
            `distraction in class`,
            `academic performance`,
            `strict regulations`
          ],
          structureTip: t('ieltsWritingAssessor.tip1', 'Kirish qismida mavzuni paraphrase qiling, keyin telefonlarning zarari va foydasini 2 ta alohida paragrafda muhokama qiling.'),
          suggestedWords: 250,
          type: t('ieltsWriting.task2Type', 'Task 2 (Essay)')
        }
      },
      {
        id: `mock_2`,
        title: t('ieltsWriting.mock2Title', 'IELTS Writing Mock Test 2'),
        imageUrl: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&fit=crop`,
        timeLimit: 3600,
        task1: {
          id: `t1_b7_5`,
          imageUrl: `https://quickchart.io/chart?c={type:'bar',data:{labels:['Germany','Netherlands','France','UK','Italy','Greece'],datasets:[{label:'2010',data:[78,74,68,65,55,48],backgroundColor:'blue'},{label:'2020',data:[88,83,76,74,64,57],backgroundColor:'red'}]}}`,
          promptText: t('ieltsWriting.p5Prompt', 'The bar chart compares the percentage of university graduates in six European countries who found employment within six months of graduation between 2010 and 2020. Summarize key trends.'),
          keyCollocations: [
            `positive trajectory`,
            `consistently outperformed`,
            `substantial growth`,
            `lagged behind`
          ],
          structureTip: t('ieltsWritingAssessor.tip5', 'Mamlakatlarning eng yuqori ko\'rsatkichlarini pastki guruhlar bilan guruhlab solishtiring.'),
          suggestedWords: 150,
          type: t('ieltsWriting.task1Type', 'Task 1 (Academic)')
        },
        task2: {
          id: `t2_b6_3`,
          promptText: t('ieltsWriting.p3Prompt', 'Online distance learning is replacing traditional classroom teaching in many universities. Do the advantages of this development outweigh the disadvantages?'),
          keyCollocations: [
            `flexibility and convenience`,
            `geographical barriers`,
            `lack of interpersonal interaction`,
            `self-discipline`
          ],
          structureTip: t('ieltsWritingAssessor.tip3', 'Afzalliklari (moslashuvchanlik, arzonlik) va kamchiliklari (jonli muloqot yetishmasligi)ni aniq ajratib ko\'rsating.'),
          suggestedWords: 250,
          type: t('ieltsWriting.task2Type', 'Task 2 (Essay)')
        }
      },
      {
        id: `mock_3`,
        title: t('ieltsWriting.mock3Title', 'IELTS Writing Mock Test 3'),
        imageUrl: `https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&fit=crop`,
        timeLimit: 3600,
        task1: {
          id: `t1_b7_7`,
          imageUrl: `https://quickchart.io/graphviz?graph=digraph{rankdir=LR;node[shape=box,style=filled,color=lightblue];Collection->PrimaryScreening->SettlingTank->Aeration->Microfiltration->Disinfection->Distribution}`,
          promptText: t('ieltsWriting.p7Prompt', 'The diagram illustrates the process of purifying and recycling wastewater for domestic consumption. Describe the stages involved in this system.'),
          keyCollocations: [
            `multi-stage process`,
            `primary screening grid`,
            `microfiltration and reverse osmosis`,
            `subsequently pumped`
          ],
          structureTip: t('ieltsWritingAssessor.tip7', 'Jarayonning bosqichma-bosqich o\'tish zanjirini o\'tuvchi so\'zlar (Initially, Following this, Subsequently, Finally) bilan tasvirlang.'),
          suggestedWords: 150,
          type: t('ieltsWriting.task1Type', 'Task 1 (Academic)')
        },
        task2: {
          id: `t2_b7_4`,
          promptText: t('ieltsWriting.p4Prompt', 'Some people believe that artificial intelligence will replace human workers in most industries, while others argue it will create new opportunities. Discuss both views and give your own opinion.'),
          keyCollocations: [
            `catalyst for change`,
            `render human labor obsolete`,
            `autonomous algorithms`,
            `reskilling initiatives`
          ],
          structureTip: t('ieltsWritingAssessor.tip4', 'AI tufayli yo\'qoladigan kasblar va yangi yaratiladigan professional yo\'nalishlarni chuqur dalillang.'),
          suggestedWords: 250,
          type: t('ieltsWriting.task2Type', 'Task 2 (Essay)')
        }
      },
      {
        id: `mock_4`,
        title: t('ieltsWriting.mock4Title', 'IELTS Writing Mock Test 4'),
        imageUrl: `https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&fit=crop`,
        timeLimit: 3600,
        task1: {
          id: `t1_b8_10`,
          imageUrl: `https://quickchart.io/chart?c={type:'pie',data:{labels:['Coal','Natural%20Gas','Petroleum','Nuclear','Solar/Wind'],datasets:[{data:[42,28,18,7,5]}]}}`,
          promptText: t('ieltsWriting.p10Prompt', 'The pie charts show the proportions of energy generated from different sources in a developed nation in 2005 and projected figures for 2035. Summarize the main features and make comparisons.'),
          keyCollocations: [
            `dominant energy source`,
            `projected to undergo a major shift`,
            `diminishing reliance on fossil fuels`,
            `exponential surge`
          ],
          structureTip: t('ieltsWritingAssessor.tip10', 'Qazilma yoqilg\'ilarining pasayishini tiklanuvchi manbalarning eksponensial o\'sishi bilan qarama-qarshi qo\'yib taqqoslang.'),
          suggestedWords: 150,
          type: t('ieltsWriting.task1Type', 'Task 1 (Academic)')
        },
        task2: {
          id: `t2_b7_6`,
          promptText: t('ieltsWriting.p6Prompt', 'Many young people prefer going directly into employment after high school rather than pursuing a university degree. Do the advantages of this trend outweigh the disadvantages?'),
          keyCollocations: [
            `financial autonomy`,
            `tertiary education`,
            `knowledge-based economies`,
            `career progression capped`
          ],
          structureTip: t('ieltsWritingAssessor.tip6', 'Erta maosh olish (afzallik) bilan uzoq muddatli martaba cheklovi (kamchilik) o\'rtasidagi balansni yoritib bering.'),
          suggestedWords: 250,
          type: t('ieltsWriting.task2Type', 'Task 2 (Essay)')
        }
      },
      {
        id: `mock_5`,
        title: t('ieltsWriting.mock5Title', 'IELTS Writing Mock Test 5'),
        imageUrl: `https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&fit=crop`,
        timeLimit: 3600,
        task1: {
          id: `t1_b9_12`,
          imageUrl: `https://quickchart.io/graphviz?graph=digraph{node[shape=box];Willington1995->Willington2025;Farmland->ResidentialZone;Factory->CommercialComplex;FishingPort->PublicMarina}`,
          promptText: t('ieltsWriting.p12Prompt', 'The maps below show the town of Willington in 1995 and proposed redevelopment plans for 2025. Summarize the main features and make comparisons where relevant.'),
          keyCollocations: [
            `extensive modernization`,
            `residential zone expansion`,
            `pedestrianized thoroughfare`,
            `reconstructed into commercial complexes`
          ],
          structureTip: t('ieltsWritingAssessor.tip12', 'Shahar xaritasining 30 yillik o\'zgarishini yo\'nalishlar (north, south, east, west) va infratuzilma bo\'yicha taqqoslang.'),
          suggestedWords: 150,
          type: t('ieltsWriting.task1Type', 'Task 1 (Academic)')
        },
        task2: {
          id: `t2_b7_8`,
          promptText: t('ieltsWriting.p8Prompt', 'Should governments take sole responsibility for solving environmental issues, or should individuals change their lifestyle habits? Discuss both views and give your opinion.'),
          keyCollocations: [
            `ecological degradation`,
            `statutory enforcement`,
            `pivotal role`,
            `synchronized effort`
          ],
          structureTip: t('ieltsWritingAssessor.tip8', 'Hukumatning qonuniy vakolatlari va fuqarolarning shaxsiy mas\'uliyatini sinxronlashtirish kerakligini xulosalang.'),
          suggestedWords: 250,
          type: t('ieltsWriting.task2Type', 'Task 2 (Essay)')
        }
      },
      {
        id: `mock_6`,
        title: t('ieltsWriting.mock6Title', 'IELTS Writing Mock Test 6'),
        imageUrl: `https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&fit=crop`,
        timeLimit: 3600,
        task1: {
          id: `t1_b6_15`,
          imageUrl: `https://quickchart.io/graphviz?graph=digraph{rankdir=LR;node[shape=box,style=rounded,color=orange];Harvest->Sort->Dry->Hull->Roast->Grind->Package}`,
          promptText: t('ieltsWriting.p15Prompt', 'The diagram illustrates the process of coffee production from coffee bean harvesting to retail packaging. Describe the stages involved.'),
          keyCollocations: [
            `sequential stages`,
            `harvested and sorted`,
            `roasted at high temperatures`,
            `vacuum-sealed packaging`
          ],
          structureTip: t('ieltsWritingAssessor.tip15', 'Kofe tayyorlash bosqichlarini xronologik tartibda va nisbat shaklida (is roasted, are packaged) yozing.'),
          suggestedWords: 150,
          type: t('ieltsWriting.task1Type', 'Task 1 (Academic)')
        },
        task2: {
          id: `t2_b8_9`,
          promptText: t('ieltsWriting.p9Prompt', 'Providing a Universal Basic Income (UBI) to all citizens regardless of employment status is proposed as a solution to wealth inequality. Discuss the feasibility and potential consequences.'),
          keyCollocations: [
            `socioeconomic disparities`,
            `fiscal feasibility`,
            `hyper-automation`,
            `unprecedented strain on public coffers`
          ],
          structureTip: t('ieltsWritingAssessor.tip9', 'Iqtisodiy barqarorlik, avtomatlashtirish va moliyaviy manbalar o\'rtasidagi murakkab munosabatni C1/C2 lofatlar bilan tahlil qiling.'),
          suggestedWords: 250,
          type: t('ieltsWriting.task2Type', 'Task 2 (Essay)')
        }
      }
    ];

    // Navigation & State Management
    const [screen, setScreen] = useState('home') // 'home' | 'workspace'
    const [selectedPrompt, setSelectedPrompt] = useState(null)

    // 6 Featured prompts: 3 Task1 + 3 Task2 (hand-picked from the 15)
    const featuredMocks = mockExams;

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

    // Word and Character counts
    const wordsArray = essayText.trim().split(/\s+/).filter(Boolean)
    const wordCount = wordsArray.length
    const charCount = essayText.length

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
        if (essayText) {
            navigator.clipboard.writeText(essayText)
            setCopiedToast(true)
            setTimeout(() => setCopiedToast(false), 2000)
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) {
                alert("API Key topilmadi! Iltimos .env faylga VITE_GEMINI_API_KEY kiriting.");
                setIsAnalyzing(false);
                return;
            }

            const ai = new GoogleGenAI({ apiKey });
            
            const prompt = `
You are an expert, strict IELTS examiner. Assess the following IELTS ${selectedPrompt.taskType === 'task1' ? 'Task 1' : 'Task 2'} essay.
Task Type: ${selectedPrompt.taskType}
Prompt: ${selectedPrompt.promptText}
Essay:
"${text}"

Evaluate strictly according to IELTS criteria and return a valid JSON object EXACTLY in this format:
{
  "overallBand": 6.5,
  "taskResponse": 6.5,
  "coherence": 6.0,
  "lexical": 7.0,
  "grammar": 6.5,
  "wordCount": ${wordCount},
  "minRequired": ${minWords},
  "foundCollocations": ["academic phrase 1", "phrase 2"],
  "foundConnectors": ["therefore", "however"],
  "overusedWordsDetected": [
    { "word": "good", "count": 5, "synonyms": ["excellent", "beneficial"] }
  ],
  "strengths": ["Clear overall structure", "Good use of transition words"],
  "improvements": ["Use more complex sentences", "Avoid repeating the word 'important'"]
}

Rules:
- The overall band must be the correct rounded average of the 4 criteria.
- The strings in 'strengths' and 'improvements' MUST be entirely in Uzbek language (because the site users speak Uzbek).
- Provide 2-3 specific, actionable feedback points in strengths and improvements based closely on the actual essay content.
- Ensure the response is pure JSON without markdown codeblocks. Do not include \`\`\`json or \`\`\`.
`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                }
            });

            let responseText = response.text;
            if (responseText.startsWith('\`\`\`json')) {
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
                wordCount: wordCount,
                minRequired: minWords,
                foundCollocations: parsedResult.foundCollocations || [],
                foundConnectors: parsedResult.foundConnectors || [],
                overusedWordsDetected: parsedResult.overusedWordsDetected || [],
                strengths: parsedResult.strengths || [],
                improvements: parsedResult.improvements || []
            });

        } catch (error) {
            console.error("AI Analysis Error:", error);
            alert("Inshoni tekshirishda AI xatolikka yo'l qo'ydi yoki API Key xato. Iltimos qayta urinib ko'ring.");
        } finally {
            setIsAnalyzing(false);
        }
    }

    /* ==================== SCREEN 1: HOME - TOPIC CARDS ==================== */
    if (screen === 'home') {
        const CardGrid = ({ prompts, part, color }) => (
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg text-white ${color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-red-500 to-rose-600'}`}>
                        {part}
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white">
                            {part === 1 ? t('ieltsWritingAssessor.part1Title') : t('ieltsWritingAssessor.part2Title')}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {part === 1 ? t('ieltsWritingAssessor.part1Desc') : t('ieltsWritingAssessor.part2Desc')}
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {prompts.map((prompt, idx) => (
                        <motion.div
                            key={prompt.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => openPrompt(prompt)}
                            className="cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl hover:border-red-400 dark:hover:border-red-500 transition-all duration-200 overflow-hidden group flex flex-col"
                        >
                            {prompt.imageUrl && (
                                <div className="h-36 overflow-hidden">
                                    <img src={prompt.imageUrl} alt={prompt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                            )}
                            {!prompt.imageUrl && (
                                <div className={`h-28 flex items-center justify-center ${part === 1 ? 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30' : 'bg-gradient-to-br from-rose-50 to-red-100 dark:from-rose-900/30 dark:to-red-900/30'}`}>
                                    <FaPenFancy className={`text-4xl opacity-20 ${part === 1 ? 'text-blue-600' : 'text-rose-600'}`} />
                                </div>
                            )}
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                                        part === 1
                                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
                                            : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                                    }`}>
                                        {part === 1 ? t('ieltsWritingAssessor.task1') : t('ieltsWritingAssessor.task2')}
                                    </span>
                                </div>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mb-2 line-clamp-2">
                                    {prompt.title}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 italic flex-1">
                                    "{prompt.promptText}"
                                </p>
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                        <FaClock className="text-red-400" />
                                        {prompt.timeLimit / 60} {t('ieltsWritingAssessor.minutes')}
                                    </span>
                                    <span className="text-xs font-black text-red-600 dark:text-red-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        {t('ieltsWritingAssessor.start')} <FaChevronRight className="text-[9px]" />
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        )

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

                {/* Task 1 Cards */}
                <CardGrid prompts={featuredTask1} part={1} color="blue" />

                {/* Divider */}
                <div className="border-t border-slate-200 dark:border-slate-700 my-8" />

                {/* Task 2 Cards */}
                <CardGrid prompts={featuredTask2} part={2} color="red" />
            </div>
        )
    }

    /* ==================== SCREEN 3: MAIN WRITING WORKSPACE ==================== */
    if (screen === 'workspace') {
        return (
            <CdiWritingLayout
                prompt={selectedPrompt}
                essayText={essayText}
                setEssayText={setEssayText}
                wordCount={wordCount}
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
