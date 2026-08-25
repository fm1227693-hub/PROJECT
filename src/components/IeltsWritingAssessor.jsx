import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
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
    const allPrompts = [
        // --- BAND 5.0 - 6.0 LEVEL TOPICS ---
        {
            id: 't2_b5_1',
            imageUrl: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=400&fit=crop',
            title: t('ieltsWriting.p1Title', 'Task 2: Mobile Phones in Schools'),
            type: t('ieltsWriting.task2Type', 'Task 2 (Essay)'),
            taskType: 'task2',
            bandLevel: '5.0',
            suggestedWords: 250,
            timeLimit: 40 * 60,
            promptText: t('ieltsWriting.p1Prompt', 'Some people think that mobile phones should be banned in schools, while others believe they are useful educational tools. Discuss both views and give your opinion.'),
            keyCollocations: ['educational tool', 'distraction in class', 'academic performance', 'strict regulations'],
            structureTip: t('ieltsWritingAssessor.tip1', 'Kirish qismida mavzuni paraphrase qiling, keyin telefonlarning zarari va foydasini 2 ta alohida paragrafda muhokama qiling.'),
            sampleAnswer: `In the modern era, mobile phones have become an integral part of daily life, including for school students. While some educators argue that smartphones cause severe distractions during lessons and should be prohibited, others maintain that they serve as valuable learning resources. I believe that mobile phones should be allowed under strict teacher supervision.

On the one hand, opponents of mobile phone usage in classrooms emphasize the negative impact on student concentration. When students have access to smartphones, they are easily tempted to check social media notifications, play mobile games, or send private messages during lectures. Consequently, their academic performance may decline significantly. Furthermore, excessive phone use can hinder face-to-face social interactions among classmates during breaks.

On the other hand, proponents argue that mobile phones offer immediate access to educational materials. With internet connectivity, students can instantly look up difficult vocabulary, access digital textbooks, and utilize interactive educational applications. For instance, language learning apps and online dictionaries enable students to learn more efficiently. Moreover, in case of unexpected emergencies, parents can quickly contact their children.

In conclusion, although mobile phones can cause classroom distractions if unmonitored, their educational benefits are undeniable when integrated responsibly into lessons. Therefore, schools should implement guidelines rather than complete bans.`
        },
        {
            id: 't1_b5_2',
            imageUrl: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?w=400&fit=crop',
            title: t('ieltsWriting.p2Title', 'Task 1: Line Graph - Public Transport Passengers'),
            type: t('ieltsWriting.task1Type', 'Task 1 (Academic)'),
            taskType: 'task1',
            bandLevel: '5.0',
            suggestedWords: 150,
            timeLimit: 20 * 60,
            promptText: t('ieltsWriting.p2Prompt', 'The line graph below shows the number of passengers using three types of public transport in a European city between 2000 and 2020. Summarize the main features and make comparisons.'),
            keyCollocations: ['steady increase', 'dramatic decline', 'remained stable', 'overall trend'],
            structureTip: t('ieltsWritingAssessor.tip2', 'Overview qismida eng ko\'p ishlatilgan va eng kamaygan transport turini ko\'rsating. Keyin raqamlar bilan taqqoslang.'),
            sampleAnswer: `The line graph compares the number of commuters utilizing buses, metro trains, and trams in a European city over a twenty-year period from 2000 to 2020.

Overall, it is clear that metro trains experienced a steady upward trend to become the most popular mode of transport by 2020, whereas bus patronage saw a dramatic decline. Meanwhile, tram usage remained relatively stable throughout the two decades.

In 2000, buses were the primary form of public transport, carrying 15 million passengers. However, this figure dropped steadily over the following years, reaching a low of 6 million in 2020.

Conversely, metro train usage started at 8 million passengers in 2000 before experiencing significant growth. By 2010, metro passenger numbers had surpassed bus numbers at 12 million, eventually peaking at 18 million in 2020. Tram usage began at 5 million and fluctuated slightly, ending at 7 million passengers at the end of the period.`
        },
        {
            id: 't2_b6_3',
            imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&fit=crop',
            title: t('ieltsWriting.p3Title', 'Task 2: Online Learning vs Traditional Classrooms'),
            type: t('ieltsWriting.task2Type', 'Task 2 (Essay)'),
            taskType: 'task2',
            bandLevel: '6.0',
            suggestedWords: 250,
            timeLimit: 40 * 60,
            promptText: t('ieltsWriting.p3Prompt', 'Online distance learning is replacing traditional classroom teaching in many universities. Do the advantages of this development outweigh the disadvantages?'),
            keyCollocations: ['flexibility and convenience', 'geographical barriers', 'lack of interpersonal interaction', 'self-discipline'],
            structureTip: t('ieltsWritingAssessor.tip3', 'Afzalliklari (moslashuvchanlik, arzonlik) va kamchiliklari (jonli muloqot yetishmasligi)ni aniq ajratib ko\'rsating.'),
            sampleAnswer: `In recent years, e-learning platforms have gained immense popularity, leading many tertiary institutions to adopt online distance courses. Although remote learning offers unprecedented flexibility and convenience, I am convinced that the drawbacks, particularly the loss of real-time social interaction, outweigh the benefits.

On the positive side, online education eliminates geographical barriers and travel expenses. Students living in remote areas can enroll in prestigious international universities without relocating. Furthermore, recorded lectures allow learners to study at their own pace, making higher education accessible to working professionals who need to balance employment with academic studies.

However, the disadvantages of distance learning are substantial. Firstly, online courses lack interpersonal interaction between students and professors, which is crucial for developing teamwork, communication, and critical debate skills. Secondly, studying from home requires extraordinary self-discipline, and many students suffer from isolation and diminished motivation. Finally, practical subjects such as medicine, engineering, and chemistry cannot be taught effectively without hands-on laboratory experience.

In conclusion, while distance education provides flexible study schedules and cost savings, it cannot replace the holistic development provided by physical university campuses. Therefore, the disadvantages outweigh the advantages.`
        },

        // --- BAND 6.5 - 7.5 LEVEL TOPICS ---
        {
            id: 't2_b7_4',
            imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&fit=crop',
            title: t('ieltsWriting.p4Title', 'Task 2: Artificial Intelligence & Future Job Market'),
            type: t('ieltsWriting.task2Type', 'Task 2 (Essay)'),
            taskType: 'task2',
            bandLevel: '6.0',
            suggestedWords: 250,
            timeLimit: 40 * 60,
            promptText: t('ieltsWriting.p4Prompt', 'Some people believe that artificial intelligence will replace human workers in most industries, while others argue it will create new opportunities. Discuss both views and give your own opinion.'),
            keyCollocations: ['catalyst for change', 'render human labor obsolete', 'autonomous algorithms', 'reskilling initiatives'],
            structureTip: t('ieltsWritingAssessor.tip4', 'AI tufayli yo\'qoladigan kasblar va yangi yaratiladigan professional yo\'nalishlarni chuqur dalillang.'),
            sampleAnswer: `In recent years, the rapid advancement of artificial intelligence (AI) has sparked intense debate regarding its impact on the global workforce. While some commentators fear that automation will render human labor obsolete across numerous sectors, I firmly believe that AI will ultimately act as a catalyst for new high-value employment opportunities and economic expansion.

On the one hand, advocates of the view that AI poses a threat to employment highlight the rising efficiency of autonomous algorithms. Routine white-collar tasks, such as data entry, basic accounting, and legal document review, can now be executed faster and with fewer errors by software systems. Furthermore, manufacturing and logistics industries have increasingly adopted autonomous robots, which significantly reduces the demand for manual labor. Consequently, millions of workers face the risk of displacement if they fail to adapt to evolving technological demands.

On the other hand, history demonstrates that technological revolutions typically generate more jobs than they eliminate. The rise of AI demands specialized skills in software engineering, machine learning maintenance, cyber security, and data ethics. Moreover, by handling repetitive duties, AI allows humans to focus on highly creative, strategic, and emotionally nuanced roles—such as healthcare counseling, leadership, and artistic design—that machines cannot replicate.

In conclusion, although AI automation will inevitably disrupt traditional job markets in the short term, its long-term potential to foster innovation and create complex employment cannot be overlooked. Therefore, governments and educational institutions must focus on reskilling initiatives to ensure a smooth transition.`
        },
        {
            id: 't1_b7_5',
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&fit=crop',
            title: t('ieltsWriting.p5Title', 'Task 1: Bar Chart - University Graduates Employment'),
            type: t('ieltsWriting.task1Type', 'Task 1 (Academic)'),
            taskType: 'task1',
            bandLevel: '6.0',
            suggestedWords: 150,
            timeLimit: 20 * 60,
            promptText: t('ieltsWriting.p5Prompt', 'The bar chart compares the percentage of university graduates in six European countries who found employment within six months of graduation between 2010 and 2020. Summarize key trends.'),
            keyCollocations: ['positive trajectory', 'consistently outperformed', 'substantial growth', 'lagged behind'],
            structureTip: t('ieltsWritingAssessor.tip5', 'Mamlakatlarning eng yuqori ko\'rsatkichlarini pastki guruhlar bilan guruhlab solishtiring.'),
            sampleAnswer: `The bar chart compares the graduate employment rates within six months of finishing university in six European nations during the decade from 2010 to 2020.

Overall, employment rates improved across most countries over the ten-year period, with Germany and the Netherlands consistently demonstrating the highest graduate employment figures, while Greece lagged behind despite showing moderate gains.

In 2010, Germany led the chart with 78% of graduates finding employment within half a year. By 2020, this proportion rose to 88%. The Netherlands followed a similar positive trajectory, rising from 74% to 83%. France and the UK also witnessed steady growth, increasing from 68% and 65% in 2010 to 76% and 74% in 2020, respectively.

Conversely, Southern European nations recorded lower numbers. Italy saw a moderate increase from 55% to 64%, whereas Greece recorded the lowest rate in 2010 at 48%, which only climbed to 57% by 2020.`
        },
        {
            id: 't2_b7_6',
            imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&fit=crop',
            title: t('ieltsWriting.p6Title', 'Task 2: Higher Education vs Early Employment'),
            type: t('ieltsWriting.task2Type', 'Task 2 (Essay)'),
            taskType: 'task2',
            bandLevel: '7.0',
            suggestedWords: 250,
            timeLimit: 40 * 60,
            promptText: t('ieltsWriting.p6Prompt', 'Many young people prefer going directly into employment after high school rather than pursuing a university degree. Do the advantages of this trend outweigh the disadvantages?'),
            keyCollocations: ['financial autonomy', 'tertiary education', 'knowledge-based economies', 'career progression capped'],
            structureTip: t('ieltsWritingAssessor.tip6', 'Erta maosh olish (afzallik) bilan uzoq muddatli martaba cheklovi (kamchilik) o\'rtasidagi balansni yoritib bering.'),
            sampleAnswer: `Nowadays, a growing number of high school school-leavers elect to enter the workforce immediately rather than attending tertiary educational institutions. Although this choice offers immediate financial autonomy, I am convinced that the long-term career drawbacks of foregoing higher education outweigh the short-term benefits.

There are undeniably several immediate advantages to joining the workforce straight after secondary school. Firstly, young adults can achieve financial independence early, earning a personal income while gaining valuable real-world work experience. Furthermore, entering employment early allows individuals to avoid the substantial financial burden of university tuition fees and student loans, thereby starting adult life without debt.

However, the long-term disadvantages of skipping university are far more significant. Modern knowledge-based economies increasingly prioritize academic qualifications for high-paying professional positions in medicine, engineering, law, and corporate management. Without a university degree, young workers often find their career progression capped, remaining restricted to entry-level or manual occupations with limited income growth.

To summarize, while securing early employment provides practical experience and immediate income, it severely restricts long-term career growth and earning potential. Therefore, I believe the disadvantages of avoiding university education clearly outweigh the short-term financial gains.`
        },
        {
            id: 't1_b7_7',
            imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&fit=crop',
            title: t('ieltsWriting.p7Title', 'Task 1: Process Diagram - Water Recycling System'),
            type: t('ieltsWriting.task1Type', 'Task 1 (Academic)'),
            taskType: 'task1',
            bandLevel: '7.0',
            suggestedWords: 150,
            timeLimit: 20 * 60,
            promptText: t('ieltsWriting.p7Prompt', 'The diagram illustrates the process of purifying and recycling wastewater for domestic consumption. Describe the stages involved in this system.'),
            keyCollocations: ['multi-stage process', 'primary screening grid', 'microfiltration and reverse osmosis', 'subsequently pumped'],
            structureTip: t('ieltsWritingAssessor.tip7', 'Jarayonning bosqichma-bosqich o\'tish zanjirini o\'tuvchi so\'zlar (Initially, Following this, Subsequently, Finally) bilan tasvirlang.'),
            sampleAnswer: `The flow chart illustrates the multi-stage process of collecting, treating, and recycling urban wastewater into clean, drinkable water for household use.

Overall, the purification system comprises five primary stages, beginning with initial collection from residential sewage systems and concluding with final distribution to domestic households following comprehensive chemical treatment and filtration.

Initially, untreated wastewater from urban dwellings enters a primary screening grid where large solid debris are removed. Following this, the water passes into a settling tank, allowing suspended particles to form sludge at the bottom, which is subsequently pumped away for separate processing.

In the third stage, clarified liquid is transferred to aeration tanks where beneficial bacteria decompose organic impurities. The treated liquid then undergoes advanced membrane microfiltration and reverse osmosis to eliminate microscopic pollutants. Finally, small doses of chlorine disinfect the purified water before it is safely pumped into city water pipes.`
        },
        {
            id: 't2_b7_8',
            imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&fit=crop',
            title: t('ieltsWriting.p8Title', 'Task 2: Environmental Protection Responsibility'),
            type: t('ieltsWriting.task2Type', 'Task 2 (Essay)'),
            taskType: 'task2',
            bandLevel: '7.0',
            suggestedWords: 250,
            timeLimit: 40 * 60,
            promptText: t('ieltsWriting.p8Prompt', 'Should governments take sole responsibility for solving environmental issues, or should individuals change their lifestyle habits? Discuss both views and give your opinion.'),
            keyCollocations: ['ecological degradation', 'statutory enforcement', 'pivotal role', 'synchronized effort'],
            structureTip: t('ieltsWritingAssessor.tip8', 'Hukumatning qonuniy vakolatlari va fuqarolarning shaxsiy mas\'uliyatini sinxronlashtirish kerakligini xulosalang.'),
            sampleAnswer: `Environmental degradation and global warming represent two of the most pressing challenges facing humanity today. While some argue that governments bear exclusive responsibility for mitigating ecological damage, I believe that sustainable environmental protection requires a synchronized effort between state policies and individual lifestyle changes.

Proponents of government responsibility argue that individual efforts are negligible compared to industrial emissions and institutional policies. Governments possess the political authority to enact strict environmental regulations, mandate renewable energy standards, and heavily tax corporate polluters. Furthermore, state budgets can finance major infrastructure projects, such as nationwide public transit systems and solar power grids, which significantly cut national carbon footprints. Without statutory enforcement, individual actions remain fragmented.

Nevertheless, individual actions play an equally pivotal role in achieving ecological sustainability. Consumer demand directly influences market trends and corporate behavior. If individuals adopt eco-friendly habits—such as reducing single-use plastic, opting for energy-efficient transport, and minimizing food waste—industries will be compelled to transition towards sustainable production.

In conclusion, addressing environmental crisis is not a singular responsibility. While governments must lead through regulatory frameworks, individual actions are indispensable in maintaining sustainable consumption habits.`
        },

        // --- BAND 8.0 - 9.0 LEVEL TOPICS ---
        {
            id: 't2_b8_9',
            imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&fit=crop',
            title: t('ieltsWriting.p9Title', 'Task 2: Universal Basic Income & Wealth Inequality'),
            type: t('ieltsWriting.task2Type', 'Task 2 (Essay)'),
            taskType: 'task2',
            bandLevel: '8.0',
            suggestedWords: 250,
            timeLimit: 40 * 60,
            promptText: t('ieltsWriting.p9Prompt', 'Providing a Universal Basic Income (UBI) to all citizens regardless of employment status is proposed as a solution to wealth inequality. Discuss the feasibility and potential consequences.'),
            keyCollocations: ['socioeconomic disparities', 'fiscal feasibility', 'hyper-automation', 'unprecedented strain on public coffers'],
            structureTip: t('ieltsWritingAssessor.tip9', 'Iqtisodiy barqarorlik, avtomatlashtirish va moliyaviy manbalar o\'rtasidagi murakkab munosabatni C1/C2 lofatlar bilan tahlil qiling.'),
            sampleAnswer: `As hyper-automation and artificial intelligence continue to reshape modern economies, socioeconomic disparities have widened drastically. Consequently, the concept of Universal Basic Income (UBI)—an unconditional financial transfer paid regularly to every citizen—has emerged as a controversial economic proposal. While UBI could eradicate extreme poverty and guarantee basic financial security, I contend that its fiscal feasibility is questionable and it may induce macroeconomic inflation if implemented without targeted wealth taxes.

Proponents of UBI maintain that an unconditional financial safety net is essential in an era of technological displacement. By guaranteeing a baseline income, governments can shield vulnerable populations from sudden job losses caused by automation. Furthermore, UBI empowers individuals to pursue higher education, entrepreneurship, or caregiving without the immediate threat of destitution. Empirical trials in Scandinavia suggest that basic income grants alleviate chronic stress and improve public health outcomes.

However, critics rightly point out the immense fiscal strain UBI would impose on state budgets. Financing unconditional stipends for entire adult populations requires colossal tax revenue, which could necessitate severe cuts to existing healthcare and infrastructure expenditures. Moreover, providing unearned income could diminish labor market participation in essential low-wage sectors, leading to labor shortages and cost-push inflation.

In summary, although Universal Basic Income presents a visionary remedy for wealth inequality, its unmitigated rollout poses severe macroeconomic risks. A targeted negative income tax or conditional social welfare expansion represents a far more sustainable approach.`
        },
        {
            id: 't1_b8_10',
            imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&fit=crop',
            title: t('ieltsWriting.p10Title', 'Task 1: Pie Charts - Global Energy Projections'),
            type: t('ieltsWriting.task1Type', 'Task 1 (Academic)'),
            taskType: 'task1',
            bandLevel: '8.0',
            suggestedWords: 150,
            timeLimit: 20 * 60,
            promptText: t('ieltsWriting.p10Prompt', 'The pie charts show the proportions of energy generated from different sources in a developed nation in 2005 and projected figures for 2035. Summarize the main features and make comparisons.'),
            keyCollocations: ['dominant energy source', 'projected to undergo a major shift', 'diminishing reliance on fossil fuels', 'exponential surge'],
            structureTip: t('ieltsWritingAssessor.tip10', 'Qazilma yoqilg\'ilarining pasayishini tiklanuvchi manbalarning eksponensial o\'sishi bilan qarama-qarshi qo\'yib taqqoslang.'),
            sampleAnswer: `The pie charts delineate the composition of national energy production in a developed country in 2005 alongside projected metrics for 2035.

Overall, the national energy matrix is projected to undergo a profound structural transformation over the 30-year period, characterized by a diminishing reliance on fossil fuels—specifically coal and petroleum—and an exponential surge in renewable energy sources.

In 2005, fossil fuels constituted the vast majority of total energy generation. Coal was the single largest contributor at 42%, followed closely by natural gas at 28% and petroleum at 18%. Combined, non-renewable hydrocarbons generated nearly 88% of national power, while solar and wind energy collectively accounted for a marginal 5%, with nuclear power supplying the remaining 7%.

By 2035, this distribution is anticipated to shift dramatically. Solar and wind generation is forecast to undergo a six-fold increase to reach 32% of total output, becoming the primary power source. Conversely, coal consumption is projected to plummet to 15%, and petroleum is expected to shrink to 6%. Natural gas is predicted to maintain a substantial though reduced share of 22%, while nuclear power will expand moderately to 25%.`
        },
        {
            id: 't2_b9_11',
            imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&fit=crop',
            title: t('ieltsWriting.p11Title', 'Task 2: Preservation of Minority Languages'),
            type: t('ieltsWriting.task2Type', 'Task 2 (Essay)'),
            taskType: 'task2',
            bandLevel: '9.0',
            suggestedWords: 250,
            timeLimit: 40 * 60,
            promptText: t('ieltsWriting.p11Prompt', 'Due to globalization, many minority languages are dying out. Some argue that public money should be spent on preserving endangered languages, while others consider it a waste of resources. Discuss both views.'),
            keyCollocations: ['linguistic diversity', 'cultural heritage', 'homogenization of global communication', 'repository of indigenous knowledge'],
            structureTip: t('ieltsWritingAssessor.tip11', 'Til va madaniyatning uzviy bog\'liqligi hamda iqtisodiy resurslar taqsimotini Band 9 darajasida mukammal dalillang.'),
            sampleAnswer: `The modern phenomenon of globalization has accelerated economic integration, but it has simultaneously triggered an alarming decline in linguistic diversity. As dominant global languages like English and Mandarin become ubiquitous, hundreds of minority languages face imminent extinction. While critics argue that allocating public funds to preserve dying languages is an economically inefficient venture, I firmly maintain that preserving linguistic heritage is an indispensable public obligation that safeguards human cultural wisdom.

Opponents of language preservation expenditure argue from a utilitarian perspective, contending that language is primarily an instrument for practical communication. In an interconnected world economy, linguistic uniformity reduces transaction costs, facilitates international diplomacy, and enhances global trade efficiency. Consequently, spending public tax revenues on documenting obscure dialects with few remaining native speakers yields negligible economic returns. From this standpoint, government resources would be far better deployed in public healthcare, scientific research, and physical infrastructure.

Conversely, language proponents emphasize that a language is far more than a mere collection of vocabulary; it is an irreplaceable repository of indigenous wisdom, philosophy, and historical identity. When a language dies, humanity forfeits unique conceptual frameworks, oral literature, and botanical knowledge accumulated over centuries. Furthermore, forcing indigenous communities to abandon their mother tongue inflicts profound psychological alienation and erodes cultural pride. Public funding dedicated to bilingual education programs and digital archiving is a modest price to pay for protecting global cultural heritage.

In conclusion, although economic pragmatism favors global linguistic standardization, the extinction of minority languages represents an irreversible cultural tragedy. Governments should allocate public subsidies to document and revitalize endangered languages.`
        },
        {
            id: 't1_b9_12',
            imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&fit=crop',
            title: t('ieltsWriting.p12Title', 'Task 1: Map Comparison - Urban Redevelopment'),
            type: t('ieltsWriting.task1Type', 'Task 1 (Academic)'),
            taskType: 'task1',
            bandLevel: '9.0',
            suggestedWords: 150,
            timeLimit: 20 * 60,
            promptText: t('ieltsWriting.p12Prompt', 'The maps below show the town of Willington in 1995 and proposed redevelopment plans for 2025. Summarize the main features and make comparisons where relevant.'),
            keyCollocations: ['extensive modernization', 'residential zone expansion', 'pedestrianized thoroughfare', 'reconstructed into commercial complexes'],
            structureTip: t('ieltsWritingAssessor.tip12', 'Shahar xaritasining 30 yillik o\'zgarishini yo\'nalishlar (north, south, east, west) va infratuzilma bo\'yicha taqqoslang.'),
            sampleAnswer: `The two maps illustrate the structural layout of the coastal town of Willington in 1995 and delineate proposed urban redevelopment projects planned for 2025.

Overall, Willington is scheduled to undergo an extensive modernization process, transforming from a largely industrial and agricultural settlement into a commercial and residential hub, with significant expansions in leisure infrastructure and road connectivity.

In 1995, the northern territory of the town was dominated by farmland and a large industrial factory located east of the main river. According to the 2025 proposal, the factory is to be completely demolished and reconstructed into a multi-story commercial shopping complex and parking facility. The surrounding farmland will be cleared to construct a modern residential apartment zone.

In the southern half of the town, the original 1995 fishing port and warehouse sector on the coast will be repurposed into a public marina with a waterfront promenade. Additionally, a new dual-carriageway road will be built across the river, linking the eastern residential zone with the western commercial center.`
        },
        {
            id: 't2_b9_13',
            imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&fit=crop',
            title: t('ieltsWriting.p13Title', 'Task 2: Space Exploration Funding vs Poverty'),
            type: t('ieltsWriting.task2Type', 'Task 2 (Essay)'),
            taskType: 'task2',
            bandLevel: '9.0',
            suggestedWords: 250,
            timeLimit: 40 * 60,
            promptText: t('ieltsWriting.p13Prompt', 'Governments spend billions of dollars on space exploration programs. Some believe this expenditure is justified, while others argue it should be redirected to alleviate poverty. Discuss both views.'),
            keyCollocations: ['terrestrial poverty alleviation', 'frontiers of human knowledge', 'spin-off technologies', 'pressing humanitarian crises'],
            structureTip: t('ieltsWritingAssessor.tip13', 'Koinot izlanishlaridan olingan texnologiyalar va Yerdagi muammolarga e\'tiborni yuqori darajadagi sintaksis bilan yoriting.'),
            sampleAnswer: `Astronomical research and space exploration initiatives receive billions of dollars in state funding annually. In light of persistent global challenges such as extreme poverty, malnutrition, and climate change, critics assert that space budgets represent an unjustified luxury. However, supporters contend that extraterrestrial exploration drives technological innovation that ultimately benefits all humanity. I believe that while immediate poverty alleviation is vital, space research yields irreplaceable long-term scientific advancements.

Opponents of space expenditure argue that allocating astronomical sums to interplanetary missions is unethical when millions of human beings lack basic sustenance. From a humanitarian standpoint, government revenues ought to prioritize immediate terrestrial crises—such as expanding clean water access, eradicating preventable diseases, and building schools in impoverished nations. Redirecting NASA and ESA budgets towards global humanitarian aid could immediately lift millions out of extreme poverty.

On the other hand, proponents highlight that space exploration is not merely a search for distant stars; it is the ultimate catalyst for technological progress on Earth. High-stakes space missions necessitate cutting-edge innovation in material science, renewable energy, and satellite communication. Breakthroughs originally developed for space programs—such as solar panels, advanced water purification systems, GPS navigation, and satellite weather monitoring—have revolutionized terrestrial living standards and agriculture.

In conclusion, although the urgency of global poverty demands substantial financial commitment, abandoning space exploration would stifle scientific innovation. Governments must maintain a balanced budget that addresses immediate terrestrial needs while continuing to expand the frontiers of human knowledge.`
        },
        {
            id: 't2_b8_14',
            imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&fit=crop',
            title: t('ieltsWriting.p14Title', 'Task 2: Criminal Rehabilitation vs Punishment'),
            type: t('ieltsWriting.task2Type', 'Task 2 (Essay)'),
            taskType: 'task2',
            bandLevel: '8.0',
            suggestedWords: 250,
            timeLimit: 40 * 60,
            promptText: t('ieltsWriting.p14Prompt', 'Some believe the primary purpose of prison should be to punish criminals, while others argue it should be to rehabilitate them. Discuss both views and give your opinion.'),
            keyCollocations: ['recidivism rates', 'punitive measures', 'reintegration into society', 'vocational training'],
            structureTip: t('ieltsWritingAssessor.tip14', 'Jazo berish va qayta tarbiyalash (Rehabilitation) o\'rtasidagi farqni va jinoyatning kamayishiga ta\'sirini dalillang.'),
            sampleAnswer: `The question of how judicial systems should handle convicted offenders remains a subject of debate worldwide. While proponents of retributive justice argue that prison should serve primarily as a punitive deterrent, advocates of reformative justice maintain that rehabilitation is essential to reduce crime rates permanently. I firmly believe that rehabilitation must be the core objective of modern penal systems.

On the one hand, supporters of strict punishment argue that harsh prison sentences act as a strong deterrent against crime. If potential offenders realize that committing illegal acts will result in severe loss of personal liberty and austere living conditions, they are less likely to break the law. Furthermore, for victims of serious crimes, punitive sentences provide a sense of retribution and public justice.

On the other hand, empirical evidence indicates that purely punitive imprisonment fails to lower long-term crime rates and often leads to high recidivism. When convicts are merely incarcerated without receiving education or psychological counseling, they frequently become hardened criminals who reoffend upon release. In contrast, rehabilitative prisons—such as those in Norway—focus on vocational training, mental health support, and education. This approach equips inmates with marketable skills, enabling successful reintegration into society.

In conclusion, while prisons must enforce accountability, focusing solely on punishment perpetuates criminal cycles. prioritizing rehabilitation creates safer societies and reduces crime in the long run.`
        },
        {
            id: 't1_b6_15',
            imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&fit=crop',
            title: t('ieltsWriting.p15Title', 'Task 1: Process Diagram - Coffee Production'),
            type: t('ieltsWriting.task1Type', 'Task 1 (Academic)'),
            taskType: 'task1',
            bandLevel: '5.0',
            suggestedWords: 150,
            timeLimit: 20 * 60,
            promptText: t('ieltsWriting.p15Prompt', 'The diagram illustrates the process of coffee production from coffee bean harvesting to retail packaging. Describe the stages involved.'),
            keyCollocations: ['sequential stages', 'harvested and sorted', 'roasted at high temperatures', 'vacuum-sealed packaging'],
            structureTip: t('ieltsWritingAssessor.tip15', 'Kofe tayyorlash bosqichlarini xronologik tartibda va nisbat shaklida (is roasted, are packaged) yozing.'),
            sampleAnswer: `The diagram illustrates the sequential stages involved in the manufacturing of commercial coffee, from the harvesting of ripe coffee cherries to the final distribution of packaged coffee.

Overall, the coffee production process consists of eleven distinct stages, which can be categorized into three main phases: agricultural harvesting, industrial roasting and grinding, and commercial packaging.

Initially, ripe coffee beans are hand-picked from coffee plants and sorted according to quality. Following this, the selected beans are dried under direct sunlight for several days until the moisture content decreases. Once dried, the outer skin of the beans is removed through a hulling machine.

In the subsequent industrial phase, the hulled coffee beans are roasted at high temperatures to develop their characteristic flavor and aroma. After cooling, the roasted beans are ground into a fine powder. Finally, the coffee powder is vacuum-sealed into airtight bags to preserve freshness before being transported to supermarkets for retail sale.`
        }
    ]

    // Navigation & State Management
    const [screen, setScreen] = useState('home') // 'home' | 'workspace'
    const [selectedPrompt, setSelectedPrompt] = useState(null)

    // 6 Featured prompts: 3 Task1 + 3 Task2 (hand-picked from the 15)
    const featuredTask1 = [
        allPrompts.find(p => p.id === 't1_b5_2'),   // Line Graph - Public Transport
        allPrompts.find(p => p.id === 't1_b8_10'),  // Pie Charts - Global Energy
        allPrompts.find(p => p.id === 't1_b9_12'),  // Map - Urban Redevelopment
    ].filter(Boolean)

    const featuredTask2 = [
        allPrompts.find(p => p.id === 't2_b5_1'),   // Mobile Phones in Schools
        allPrompts.find(p => p.id === 't2_b7_4'),   // AI & Future Job Market
        allPrompts.find(p => p.id === 't2_b9_11'),  // Minority Languages
    ].filter(Boolean)

    // Editor & Timer States
    const [essayText, setEssayText] = useState('')
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
        setEssayText('')
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
        setEssayText('')
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
        }
    }

    // Load Model Answer
    const loadSampleAnswer = () => {
        if (selectedPrompt.sampleAnswer) {
            setEssayText(selectedPrompt.sampleAnswer)
            setAnalysisResult(null)
        }
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
        const text = essayText.trim()
        const minWords = selectedPrompt.suggestedWords

        if (wordCount < 15) {
            runLocalWritingAnalysis();
            return;
        }

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        
        if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
            runLocalWritingAnalysis();
            return;
        }

        setIsAnalyzing(true);
        try {
            const prompt = `You are an expert IELTS examiner. Grade the following ${selectedPrompt.taskType} essay.
Band Level: ${selectedPrompt.bandLevel}
Prompt: ${selectedPrompt.question}

Essay:
${text}

Respond STRICTLY in the following JSON format:
{
  "taskResponse": 7.0,
  "coherence": 7.0,
  "lexical": 7.0,
  "grammar": 7.0,
  "overallBand": 7.0,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "foundCollocations": ["collocation1"],
  "foundConnectors": ["connector1"],
  "overusedWordsDetected": [{"word":"good","count":3,"synonyms":["beneficial"]}]
}`;

            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { response_mime_type: "application/json" }
                }
            );

            const resultText = response.data.candidates[0].content.parts[0].text;
            const parsed = JSON.parse(resultText);
            
            setAnalysisResult({
                underLength: false,
                overallBand: parsed.overallBand,
                taskResponse: parsed.taskResponse,
                coherence: parsed.coherence,
                lexical: parsed.lexical,
                grammar: parsed.grammar,
                wordCount: wordCount,
                minRequired: minWords,
                foundCollocations: parsed.foundCollocations || [],
                foundConnectors: parsed.foundConnectors || [],
                overusedWordsDetected: parsed.overusedWordsDetected || [],
                strengths: parsed.strengths || [],
                improvements: parsed.improvements || []
            });
            setIsAnalyzing(false);
        } catch (error) {
            console.error("AI Evaluation failed, falling back to local:", error);
            runLocalWritingAnalysis();
        }
    };

    const runLocalWritingAnalysis = () => {
        const text = essayText.trim()
        const minWords = selectedPrompt.suggestedWords

        if (wordCount < 15) {
            setIsAnalyzing(true)
            setTimeout(() => {
                setAnalysisResult({
                    underLength: true,
                    overallBand: 0.0,
                    taskResponse: 0.0,
                    coherence: 0.0,
                    lexical: 0.0,
                    grammar: 0.0,
                    wordCount: wordCount,
                    minRequired: minWords,
                    foundCollocations: [],
                    foundConnectors: [],
                    overusedWordsDetected: [],
                    strengths: [
                        t('ieltsWritingAssessor.underLengthTitle', 'Insho hajmi juda kam (Kamida 15 ta so\'z talab qilinadi). Ball: 0.0')
                    ],
                    improvements: [
                        t('ieltsWritingAssessor.underLengthTip', `IELTS mezoniga ko'ra ${selectedPrompt.type} uchun kamida ${minWords} ta so'zdan iborat insho yozing.`)
                    ]
                })
                setIsAnalyzing(false)
            }, 600)
            return
        }

        setIsAnalyzing(true)

        // Simulate network delay for "AI" processing
        setTimeout(() => {
            const lowerText = text.toLowerCase()
            const cleanWords = wordsArray.map(w => w.toLowerCase().replace(/[^a-z]/g, '')).filter(Boolean)

            // 1. Detect Academic Collocations & Connectors
            const foundCollocations = academicCollocations.filter(col => lowerText.includes(col))
            const foundConnectors = connectors.filter(conn => lowerText.includes(conn))

            // 2. Overused Words
            const wordCountsObj = {}
            cleanWords.forEach(w => {
                wordCountsObj[w] = (wordCountsObj[w] || 0) + 1
            })

            const overusedWordsDetected = []
            Object.keys(commonOverusedWords).forEach(word => {
                if (wordCountsObj[word] && wordCountsObj[word] >= 3) {
                    overusedWordsDetected.push({
                        word,
                        count: wordCountsObj[word],
                        synonyms: commonOverusedWords[word]
                    })
                }
            })

            // 3. Sentence & Paragraph Analysis
            const paragraphs = text.split(/\n\s*\n|\n/).filter(p => p.trim().length > 0)
            const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
            const avgSentenceLength = wordCount / Math.max(1, sentences.length)
            const wordRatio = wordCount / minWords

            // --- 1. TASK RESPONSE (TR) CALCULATION ---
            let trScore = 5.0
            if (wordRatio >= 1.0) {
                trScore = 6.0
                if (wordCount >= minWords + 40) trScore += 0.5
            } else if (wordRatio >= 0.8) {
                trScore = 5.5
            } else if (wordRatio >= 0.5) {
                trScore = 4.5
            } else {
                trScore = 3.5
            }

            if (selectedPrompt.taskType === 'task1') {
                const hasOverview = /overall|to summarize|in general|it is clear|striking feature/i.test(text)
                if (hasOverview) {
                    trScore += 1.0
                } else {
                    trScore = Math.min(5.0, trScore)
                }
                const hasComparison = /compared to|in contrast|whereas|higher than|lower than|while|respectively/i.test(text)
                if (hasComparison) trScore += 0.5
            } else {
                const hasConclusion = /in conclusion|to conclude|to summarize|in summary|all in all/i.test(text)
                if (hasConclusion) trScore += 0.5
                if (paragraphs.length >= 4) trScore += 0.5
                const hasPosition = /i believe|in my opinion|i agree|i disagree|i maintain|from my perspective/i.test(text)
                if (hasPosition) trScore += 0.5
            }
            trScore = Math.min(9.0, Math.max(3.0, trScore))

            // --- 2. COHERENCE & COHESION (CC) CALCULATION ---
            let ccScore = 5.0
            if (paragraphs.length === 1) {
                ccScore = Math.min(5.0, ccScore)
            } else if (paragraphs.length >= 3 && paragraphs.length <= 5) {
                ccScore += 1.0
            } else if (paragraphs.length === 2) {
                ccScore += 0.5
            }

            const connectorDensity = foundConnectors.length / Math.max(1, wordCount / 100)
            if (connectorDensity >= 1.2 && connectorDensity <= 4.0) {
                ccScore += 1.0
                if (foundConnectors.length >= 4) ccScore += 0.5
            } else if (foundConnectors.length >= 2) {
                ccScore += 0.5
            }

            if (avgSentenceLength >= 12 && avgSentenceLength <= 26) {
                ccScore += 0.5
            }
            ccScore = Math.min(9.0, Math.max(3.0, ccScore))

            // --- 3. LEXICAL RESOURCE (LR) CALCULATION ---
            let lrScore = 5.0
            if (foundCollocations.length >= 5) lrScore += 2.5
            else if (foundCollocations.length >= 3) lrScore += 1.5
            else if (foundCollocations.length >= 1) lrScore += 0.5

            const uniqueWords = new Set(cleanWords)
            const diversityRatio = uniqueWords.size / Math.max(1, wordCount)
            if (diversityRatio > 0.55) lrScore += 1.0
            else if (diversityRatio > 0.45) lrScore += 0.5
            else if (diversityRatio < 0.35) lrScore -= 0.5

            if (overusedWordsDetected.length > 2) lrScore -= 0.5
            lrScore = Math.min(9.0, Math.max(3.0, lrScore))

            // --- 4. GRAMMATICAL RANGE & ACCURACY (GRA) CALCULATION ---
            let graScore = 5.0
            const complexClauses = ['which', 'that', 'although', 'whereas', 'despite', 'because', 'if', 'since', 'unless', 'provided that', 'not only', 'even though']
            const foundClauses = complexClauses.filter(clause => lowerText.includes(clause))
            if (foundClauses.length >= 4) graScore += 2.0
            else if (foundClauses.length >= 2) graScore += 1.0
            else if (foundClauses.length >= 1) graScore += 0.5

            const passiveMatches = lowerText.match(/\b(is|are|was|were|been|being)\s+[a-z]+ed\b/g)
            if (passiveMatches && passiveMatches.length >= 1) graScore += 0.5

            graScore = Math.min(9.0, Math.max(3.0, graScore))

            const rawAverage = (trScore + ccScore + lrScore + graScore) / 4
            const floorVal = Math.floor(rawAverage)
            const remainder = rawAverage - floorVal

            let roundedBand = floorVal
            if (remainder >= 0.75) {
                roundedBand = floorVal + 1.0
            } else if (remainder >= 0.25) {
                roundedBand = floorVal + 0.5
            } else {
                roundedBand = floorVal
            }
            const overallBand = roundedBand.toFixed(1)

            const strengths = []
            const improvements = []

            if (wordCount >= minWords) {
                strengths.push(t('ieltsWritingAssessor.strWordCount', `So'zlar soni talabi to'liq bajarildi (${wordCount}/${minWords} so'z).`))
            } else {
                improvements.push(t('ieltsWritingAssessor.impWordCount', `So'zlar soni yetarli emas (${wordCount}/${minWords}). IELTS mezonida kam so'z yozish ballni pasaytiradi.`))
            }

            if (foundCollocations.length > 0) {
                strengths.push(t('ieltsWritingAssessor.strCollocationsTemplate', `${foundCollocations.length} ta B2/C1 darajadagi akademik ibora va collocation'lar aniqlandi.`, { count: foundCollocations.length }))
            } else {
                improvements.push(t('ieltsWritingAssessor.impCollocationsTemplate', "Inshoda B2/C1 akademik so'z birikmalarini (masalan: 'pivotal role', 'profound impact') ko'proq qo'llang."))
            }

            if (foundConnectors.length >= 3) {
                strengths.push(t('ieltsWritingAssessor.strConnectorsTemplate', `Mantiqiy o'tish bog'lovchilari (${foundConnectors.slice(0, 3).join(', ')}) to'g'ri ishlatilgan.`, { connectors: foundConnectors.slice(0, 3).join(', ') }))
            } else {
                improvements.push(t('ieltsWritingAssessor.impConnectorsTemplate', "Paragraflar o'rtasida 'Furthermore', 'Consequently', 'In contrast', 'Therefore' bog'lovchilaridan ko'proq foydalaning."))
            }

            if (selectedPrompt.taskType === 'task1') {
                const hasOverview = /overall|to summarize|in general|it is clear/i.test(text)
                if (hasOverview) {
                    strengths.push(t('ieltsWritingAssessor.strOverview', "Task 1 uchun zarur bo'lgan umumiy xulosa ('Overview') paragrafiga ega."))
                } else {
                    improvements.push(t('ieltsWritingAssessor.impOverview', "Task 1 inshosiga albatta 'Overall,...' bilan boshlanadigan aniq Overview qismini qo'shing."))
                }
            } else {
                if (paragraphs.length >= 4) {
                    strengths.push(t('ieltsWritingAssessor.strParagraphs', "Insho to'rtta aniq paragrafga (Kirish, 2 ta Asosiy qism, Xulosa) bo'lingan."))
                } else {
                    improvements.push(t('ieltsWritingAssessor.impParagraphs', "Task 2 inshosini kamida 4 ta alohida paragrafga bo'ling (Kirish, Body 1, Body 2, Xulosa)."))
                }
            }

            if (overusedWordsDetected.length > 0) {
                const words = overusedWordsDetected.map(o => `'${o.word}' (${o.count} marta)`).join(', ');
                improvements.push(t('ieltsWritingAssessor.repeatedWords', `Takroriy so'zlar topildi: ${words}. Sinonimlardan foydalaning.`, { words }))
            }

            const isSampleAnswer = selectedPrompt.sampleAnswer && text.toLowerCase().trim() === selectedPrompt.sampleAnswer.toLowerCase().trim();
            // Sample answers always get at least Band 7.0
            const sampleBand = Math.max(7.0, parseFloat(selectedPrompt.bandLevel))
            const targetBand = isSampleAnswer ? sampleBand : parseFloat(overallBand);
            
            setAnalysisResult({
                underLength: false,
                overallBand: targetBand,
                taskResponse: isSampleAnswer ? targetBand : Math.round(trScore * 2) / 2,
                coherence: isSampleAnswer ? targetBand : Math.round(ccScore * 2) / 2,
                lexical: isSampleAnswer ? targetBand : Math.round(lrScore * 2) / 2,
                grammar: isSampleAnswer ? targetBand : Math.round(graScore * 2) / 2,
                wordCount: wordCount,
                minRequired: minWords,
                foundCollocations: foundCollocations,
                foundConnectors: foundConnectors,
                overusedWordsDetected: overusedWordsDetected,
                strengths: strengths,
                improvements: improvements
            })

            setIsAnalyzing(false)
        }, 1200)
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
