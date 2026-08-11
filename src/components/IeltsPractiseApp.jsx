import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { FaBookOpen, FaCommentDots, FaPenNib } from "react-icons/fa";

/* ---------------------------------------------------------
   MA'LUMOTLAR BAZASI (O'ZGARTIRILMADI)
   Har bir daraja (5,6,7,8,9) uchun Reading va Speaking
   endi 3 tadan QISM (Part 1, Part 2, Part 3) bor.
   JAMI: 5 daraja x 3 qism = 15 ta noyob Reading mavzusi
   va 15 ta noyob Speaking mavzusi. Hech bir mavzu yoki
   matn boshqa darajada yoki boshqa qismda takrorlanmaydi.
--------------------------------------------------------- */

const LEVELS = [5, 6, 7, 8, 9];
const PARTS = [1, 2, 3];
const TFNG = ["True", "False", "Not Given"];

/* ============ READING: har bir daraja uchun 3 ta noyob mavzu (Part 1/2/3) ============ */

const readingByLevel = {
  5: {
    1: {
      title: "School Libraries",
      passage:
        "Most schools have a library where students can borrow books for free. Libraries are important because not every family can buy books at home. In a school library, students can find storybooks, dictionaries, and books about science or history. Many libraries also have computers so students can do research for their homework. Librarians help students find the right book and often organise reading clubs. Some schools now have a \"quiet hour\" every day when students must read a book instead of using their phones. Teachers say this helps students improve their vocabulary and imagination. Libraries also lend books to teachers, who use them to prepare lessons.",
      questions: [
        { type: "tfng", text: "School libraries charge money for borrowing books.", answer: "False" },
        { type: "tfng", text: "Every family can afford to buy books at home.", answer: "False" },
        { type: "tfng", text: "Some libraries have computers for research.", answer: "True" },
        { type: "tfng", text: "All schools have a quiet hour every day.", answer: "Not Given" },
        { type: "tfng", text: "Reading can help students improve their vocabulary.", answer: "True" },
        { type: "mcq", text: "What do librarians help students do?", options: ["Fix computers", "Find the right book", "Write homework for them", "Clean the library"], answer: "Find the right book" },
        { type: "mcq", text: "During \"quiet hour\", what must students do?", options: ["Use their phones", "Read a book", "Do sports", "Sleep"], answer: "Read a book" },
        { type: "mcq", text: "Who else can borrow books from the library?", options: ["Only students", "Teachers too", "Only librarians", "Parents only"], answer: "Teachers too" },
        { type: "mcq", text: "What kinds of books can students find in the library?", options: ["Only comics", "Storybooks, dictionaries, science and history books", "Only textbooks", "Only magazines"], answer: "Storybooks, dictionaries, science and history books" },
        { type: "tfng", text: "Teachers use library books to prepare lessons.", answer: "True" },
        { type: "tfng", text: "Reading clubs are organised by librarians.", answer: "True" },
        { type: "mcq", text: "Why are school libraries described as important?", options: ["They are quiet places to sleep", "Not every family can buy books", "They are required by law", "They replace teachers"], answer: "Not every family can buy books" },
        { type: "tfng", text: "Students are never allowed to use phones in school.", answer: "Not Given" },
      ],
    },
    2: {
      title: "A Trip to the Zoo",
      passage:
        "Every spring, schools in the city organise a class trip to the local zoo. Students walk around in small groups with a teacher and look at animals such as lions, elephants, and monkeys. Guides at the zoo explain what each animal eats and where it originally comes from. Many students bring a notebook to draw pictures of the animals they like best. The zoo also has a small farm area where younger children can touch and feed friendly animals like rabbits and goats. At midday, families often sit together in the picnic area to eat lunch. Teachers say that zoo trips help students learn about nature in a way that books alone cannot. At the end of the day, most students agree that the elephants were their favourite part of the trip.",
      questions: [
        { type: "tfng", text: "The zoo trip happens every spring.", answer: "True" },
        { type: "tfng", text: "Students visit the zoo alone without a teacher.", answer: "False" },
        { type: "tfng", text: "Guides explain where animals originally come from.", answer: "True" },
        { type: "tfng", text: "Every student draws a picture of a lion.", answer: "Not Given" },
        { type: "tfng", text: "Younger children can touch animals in the farm area.", answer: "True" },
        { type: "mcq", text: "Where do families eat lunch?", options: ["In the classroom", "In the picnic area", "At the farm", "Outside the zoo"], answer: "In the picnic area" },
        { type: "mcq", text: "What do guides explain to students?", options: ["Ticket prices", "What animals eat and where they come from", "How to draw animals", "Zoo opening hours"], answer: "What animals eat and where they come from" },
        { type: "mcq", text: "Which animals can younger children feed?", options: ["Lions and elephants", "Rabbits and goats", "Monkeys and birds", "Fish and snakes"], answer: "Rabbits and goats" },
        { type: "mcq", text: "What do teachers say about zoo trips?", options: ["They are too expensive", "They help students learn about nature", "They are boring for students", "They replace all lessons"], answer: "They help students learn about nature" },
        { type: "tfng", text: "Most students say the elephants were their favourite part.", answer: "True" },
        { type: "mcq", text: "What do many students bring with them?", options: ["A notebook to draw pictures", "A camera only", "Food for the animals", "A map of the city"], answer: "A notebook to draw pictures" },
        { type: "tfng", text: "The zoo is only open in spring.", answer: "Not Given" },
        { type: "mcq", text: "Who usually walks around the zoo together?", options: ["Students alone", "Small groups with a teacher", "Only guides", "Only younger children"], answer: "Small groups with a teacher" },
      ],
    },
    3: {
      title: "Keeping a Pet",
      passage:
        "Many children ask their parents for a pet at some point. Dogs and cats are the most common choices, but some families prefer smaller pets like fish, birds, or rabbits because they need less space and less daily care. Before getting a pet, families should think about how much time they can spend feeding, walking, and cleaning up after it. Vets often say that pets need regular check-ups to stay healthy, just like people do. Owning a pet can teach children responsibility, since they may need to help with feeding or cleaning the pet's home. Pets can also make people feel less lonely, as many owners say their pet feels like a member of the family. However, pets can be expensive, and owners must budget for food, toys, and vet visits throughout the year.",
      questions: [
        { type: "tfng", text: "Dogs and cats are the most common pets.", answer: "True" },
        { type: "tfng", text: "Fish and birds need more daily care than dogs.", answer: "False" },
        { type: "tfng", text: "Vets recommend regular check-ups for pets.", answer: "True" },
        { type: "tfng", text: "Owning a pet can teach children responsibility.", answer: "True" },
        { type: "tfng", text: "All families can easily afford a pet.", answer: "Not Given" },
        { type: "mcq", text: "Why might a family choose a smaller pet?", options: ["They are cheaper to buy", "They need less space and daily care", "They live longer", "They are more popular"], answer: "They need less space and daily care" },
        { type: "mcq", text: "What should families think about before getting a pet?", options: ["Only the cost of buying it", "How much time they can spend on it", "What colour it should be", "Where to buy it"], answer: "How much time they can spend on it" },
        { type: "mcq", text: "According to the passage, how can pets affect owners emotionally?", options: ["They make people feel less lonely", "They make people more nervous", "They have no emotional effect", "They make people forgetful"], answer: "They make people feel less lonely" },
        { type: "mcq", text: "What must owners budget for?", options: ["Only food", "Food, toys, and vet visits", "Only vet visits", "Only toys"], answer: "Food, toys, and vet visits" },
        { type: "tfng", text: "Pets require regular financial spending throughout the year.", answer: "True" },
        { type: "mcq", text: "What responsibility might children have with a pet?", options: ["Driving it to the vet", "Helping with feeding or cleaning", "Paying for its food", "Choosing its name only"], answer: "Helping with feeding or cleaning" },
        { type: "tfng", text: "Some owners consider their pet a member of the family.", answer: "True" },
        { type: "tfng", text: "Rabbits need daily walks like dogs.", answer: "Not Given" },
      ],
    },
  },

  6: {
    1: {
      title: "The Rise of Community Gardens",
      passage:
        "In recent years, community gardens have become increasingly common in towns and cities. These are shared spaces where local residents grow vegetables, fruit, and flowers together, often on land that was previously unused. Supporters argue that community gardens improve public health by encouraging people to eat fresh produce and spend time outdoors. They also help bring neighbours together, since gardening often involves regular meetings and shared responsibilities such as watering and weeding. Some city councils now provide small grants to help groups start a garden, along with basic tools and seeds. However, organisers note that community gardens require long-term commitment, and enthusiasm can fade if members do not see quick results. Despite these challenges, many gardens have continued for over a decade, becoming a valued part of local life.",
      questions: [
        { type: "tfng", text: "Community gardens are usually built on land that was already in use.", answer: "False" },
        { type: "tfng", text: "Community gardens can encourage healthier eating habits.", answer: "True" },
        { type: "tfng", text: "All city councils provide grants for community gardens.", answer: "Not Given" },
        { type: "tfng", text: "Gardening often involves shared tasks like watering and weeding.", answer: "True" },
        { type: "tfng", text: "Enthusiasm for community gardens never decreases over time.", answer: "False" },
        { type: "mcq", text: "According to the passage, what is one social benefit of community gardens?", options: ["They increase property prices", "They bring neighbours together", "They reduce traffic", "They replace public parks"], answer: "They bring neighbours together" },
        { type: "mcq", text: "What do some city councils provide to new garden groups?", options: ["Free housing", "Grants, tools and seeds", "Legal advice only", "Paid staff"], answer: "Grants, tools and seeds" },
        { type: "mcq", text: "What challenge do organisers mention?", options: ["Lack of sunlight", "Long-term commitment is required", "Vegetables are too expensive", "Councils ban gardening"], answer: "Long-term commitment is required" },
        { type: "mcq", text: "How long have many community gardens continued to operate?", options: ["A few weeks", "Over a decade", "Exactly one year", "Less than a month"], answer: "Over a decade" },
        { type: "tfng", text: "Community gardens have existed in some form for over a decade in several places.", answer: "True" },
        { type: "mcq", text: "What is grown in community gardens, according to the passage?", options: ["Only flowers", "Vegetables, fruit and flowers", "Only trees", "Only herbs"], answer: "Vegetables, fruit and flowers" },
        { type: "tfng", text: "Community gardens require no ongoing effort once established.", answer: "False" },
        { type: "tfng", text: "The passage states community gardens are funded entirely by private companies.", answer: "Not Given" },
      ],
    },
    2: {
      title: "The Growth of Online Learning",
      passage:
        "Over the past decade, online learning platforms have transformed how many people acquire new skills. Universities now offer entire courses over the internet, allowing students who live far from campus to study without relocating. Supporters point out that online courses are often cheaper than traditional classes and can be completed at any time that suits the learner, making them popular among working adults. Critics, however, argue that online learning can feel isolating, since students miss out on face-to-face discussion with classmates and teachers. Some universities have tried to solve this by adding live video sessions where students can ask questions in real time. Research suggests that students who interact regularly with instructors, even online, tend to complete their courses more successfully than those who study entirely alone. As internet access continues to expand worldwide, more people are expected to choose online study over traditional classrooms.",
      questions: [
        { type: "tfng", text: "Online courses require students to relocate to a campus.", answer: "False" },
        { type: "tfng", text: "Online courses are often cheaper than traditional classes.", answer: "True" },
        { type: "tfng", text: "All students find online learning isolating.", answer: "Not Given" },
        { type: "tfng", text: "Some universities added live video sessions to help students.", answer: "True" },
        { type: "tfng", text: "Students who interact with instructors tend to complete courses more successfully.", answer: "True" },
        { type: "mcq", text: "Who are online courses said to be popular among?", options: ["Only teenagers", "Working adults", "Only retired people", "Only children"], answer: "Working adults" },
        { type: "mcq", text: "What do critics say about online learning?", options: ["It is too expensive", "It can feel isolating", "It is always shorter", "It has no benefits at all"], answer: "It can feel isolating" },
        { type: "mcq", text: "How have some universities tried to reduce isolation?", options: ["By cancelling online courses", "By adding live video sessions", "By increasing tuition fees", "By removing all discussion"], answer: "By adding live video sessions" },
        { type: "mcq", text: "What is expected as internet access expands worldwide?", options: ["Fewer people will study online", "More people will choose online study", "Traditional classrooms will disappear immediately", "Online courses will become illegal"], answer: "More people will choose online study" },
        { type: "tfng", text: "Online courses can be completed at any time that suits the learner.", answer: "True" },
        { type: "mcq", text: "What has research suggested about regular instructor interaction?", options: ["It has no effect on success", "It is linked to more successful course completion", "It makes courses more expensive", "It is only useful for beginners"], answer: "It is linked to more successful course completion" },
        { type: "tfng", text: "Traditional classroom teaching has completely disappeared.", answer: "False" },
        { type: "tfng", text: "The passage mentions a specific number of online universities.", answer: "Not Given" },
      ],
    },
    3: {
      title: "Urban Wildlife",
      passage:
        "As cities expand, many wild animals have adapted to living alongside humans rather than retreating to the countryside. Foxes, raccoons, and certain bird species are now commonly seen in urban parks and even residential gardens. Researchers suggest that these animals are drawn to cities by the abundance of food, whether from bins, gardens, or deliberate feeding by residents. While some people enjoy seeing wildlife close to home, others worry that urban animals can spread disease or damage property. City councils have responded in different ways: some install animal-proof bins, while others run public education campaigns encouraging residents not to feed wild animals directly. Scientists note that urban wildlife populations can differ genetically from their rural relatives after many generations of city living, since they face different pressures such as traffic and artificial lighting. This ongoing adaptation offers researchers a unique opportunity to study evolution happening in real time.",
      questions: [
        { type: "tfng", text: "All wild animals have retreated from cities as they expand.", answer: "False" },
        { type: "tfng", text: "Foxes and raccoons are commonly seen in urban parks.", answer: "True" },
        { type: "tfng", text: "Urban animals are attracted by the abundance of food.", answer: "True" },
        { type: "tfng", text: "Every resident enjoys seeing wildlife near their home.", answer: "Not Given" },
        { type: "tfng", text: "Some city councils install animal-proof bins.", answer: "True" },
        { type: "mcq", text: "What concern do some people have about urban wildlife?", options: ["It increases house prices", "It can spread disease or damage property", "It reduces traffic", "It is illegal"], answer: "It can spread disease or damage property" },
        { type: "mcq", text: "What have some city councils done to address concerns?", options: ["Banned all wildlife from cities", "Run public education campaigns", "Removed all parks", "Ignored the issue completely"], answer: "Run public education campaigns" },
        { type: "mcq", text: "What can happen to urban wildlife populations over many generations?", options: ["They can differ genetically from rural relatives", "They always become extinct", "They stop reproducing", "They lose the ability to move"], answer: "They can differ genetically from rural relatives" },
        { type: "mcq", text: "What pressures do urban animals face that rural animals do not, according to the passage?", options: ["Traffic and artificial lighting", "Lack of oxygen", "Extreme cold", "Lack of predators"], answer: "Traffic and artificial lighting" },
        { type: "tfng", text: "Scientists see urban wildlife as an opportunity to study evolution in real time.", answer: "True" },
        { type: "mcq", text: "What is one thing public campaigns encourage residents to avoid?", options: ["Feeding wild animals directly", "Walking in parks", "Recycling waste", "Owning pets"], answer: "Feeding wild animals directly" },
        { type: "tfng", text: "Urban foxes are genetically identical to rural foxes in every case.", answer: "Not Given" },
        { type: "tfng", text: "Bird species are mentioned as adapting to city life.", answer: "True" },
      ],
    },
  },

  7: {
    1: {
      title: "The Science of Sleep and Memory",
      passage:
        "Researchers have increasingly turned their attention to the relationship between sleep and memory consolidation, the process by which short-term experiences are converted into stable, long-term memories. Studies using brain imaging suggest that during deep sleep, the hippocampus, a region associated with memory formation, replays patterns of neural activity that occurred during the day, effectively rehearsing and strengthening newly acquired information. This replay appears to be particularly important for declarative memory, which includes facts and events, whereas procedural memory, such as motor skills, may rely more heavily on different sleep stages. Sleep deprivation studies have shown that participants who are prevented from entering deep sleep perform significantly worse on recall tasks the following day, even when total sleep duration remains constant. Some researchers argue that this points to a specific restorative function of deep sleep, rather than sleep duration alone being the determining factor. Nevertheless, the precise mechanisms remain a subject of ongoing investigation, and individual variation in sleep architecture complicates efforts to draw universal conclusions.",
      questions: [
        { type: "tfng", text: "Memory consolidation converts short-term experiences into long-term memories.", answer: "True" },
        { type: "tfng", text: "The hippocampus is unrelated to memory formation.", answer: "False" },
        { type: "tfng", text: "Procedural memory relies on exactly the same sleep stages as declarative memory.", answer: "False" },
        { type: "tfng", text: "Sleep deprivation studies always increase total sleep duration.", answer: "False" },
        { type: "tfng", text: "Individual variation in sleep architecture makes universal conclusions difficult.", answer: "True" },
        { type: "mcq", text: "What does the hippocampus reportedly do during deep sleep?", options: ["It shuts down completely", "It replays neural activity from the day", "It only processes procedural memory", "It stops forming new connections"], answer: "It replays neural activity from the day" },
        { type: "mcq", text: "What did sleep deprivation studies find about recall tasks?", options: ["Performance improved", "Performance was unaffected", "Performance worsened even with constant total sleep duration", "Performance depended only on age"], answer: "Performance worsened even with constant total sleep duration" },
        { type: "mcq", text: "What do some researchers argue based on the deprivation findings?", options: ["Sleep duration alone determines memory", "Deep sleep has a specific restorative function", "Memory cannot be studied scientifically", "Procedural memory is more important than declarative memory"], answer: "Deep sleep has a specific restorative function" },
        { type: "mcq", text: "What complicates drawing universal conclusions about sleep and memory?", options: ["Lack of funding", "Individual variation in sleep architecture", "Disagreement about what memory is", "Absence of brain imaging technology"], answer: "Individual variation in sleep architecture" },
        { type: "tfng", text: "Declarative memory includes facts and events.", answer: "True" },
        { type: "mcq", text: "According to the passage, what technique have researchers used to study this topic?", options: ["Surveys only", "Brain imaging", "Animal testing exclusively", "Historical records"], answer: "Brain imaging" },
        { type: "tfng", text: "The exact mechanisms linking sleep and memory are fully understood.", answer: "False" },
        { type: "tfng", text: "Motor skills are an example of declarative memory.", answer: "False" },
      ],
    },
    2: {
      title: "The Economics of Renewable Energy",
      passage:
        "For much of the twentieth century, renewable energy sources such as solar and wind power were widely regarded as prohibitively expensive compared to fossil fuels. Over the past two decades, however, the cost of manufacturing solar panels and wind turbines has fallen dramatically, driven partly by improvements in manufacturing efficiency and partly by economies of scale as production has expanded globally. In many regions, solar and wind power are now the cheapest sources of new electricity generation, even without government subsidies. This shift has significant implications for energy policy, as countries that once viewed renewable energy as an environmental compromise can now frame it as an economically rational choice. Nevertheless, the intermittent nature of solar and wind power, meaning that output depends on weather conditions, presents a persistent challenge for grid operators, who must balance supply and demand at every moment. Battery storage technology has improved considerably, but remains expensive at the scale required to fully offset intermittency. Some analysts argue that a diversified energy mix, combining renewables with other low-carbon sources, offers the most realistic path towards reliable, affordable, and sustainable electricity systems.",
      questions: [
        { type: "tfng", text: "Renewable energy was once considered cheaper than fossil fuels throughout the twentieth century.", answer: "False" },
        { type: "tfng", text: "The cost of manufacturing solar panels and wind turbines has fallen in recent decades.", answer: "True" },
        { type: "tfng", text: "Solar and wind power always require government subsidies to be the cheapest option.", answer: "False" },
        { type: "tfng", text: "Grid operators must balance supply and demand at every moment.", answer: "True" },
        { type: "tfng", text: "Battery storage technology is currently cheap enough to fully offset intermittency.", answer: "False" },
        { type: "mcq", text: "What has driven the fall in renewable energy costs?", options: ["Government bans on fossil fuels", "Manufacturing efficiency and economies of scale", "Reduced global electricity demand", "New international treaties"], answer: "Manufacturing efficiency and economies of scale" },
        { type: "mcq", text: "What challenge does the intermittent nature of solar and wind power present?", options: ["It makes electricity illegal", "It requires grid operators to balance supply and demand carefully", "It eliminates the need for storage", "It only affects developing countries"], answer: "It requires grid operators to balance supply and demand carefully" },
        { type: "mcq", text: "How can countries now frame renewable energy, according to the passage?", options: ["As purely an environmental compromise", "As an economically rational choice", "As a temporary solution only", "As irrelevant to policy"], answer: "As an economically rational choice" },
        { type: "mcq", text: "What do some analysts suggest is the most realistic path forward?", options: ["Relying solely on solar power", "A diversified energy mix combining renewables with other low-carbon sources", "Abandoning renewable energy entirely", "Banning battery storage research"], answer: "A diversified energy mix combining renewables with other low-carbon sources" },
        { type: "tfng", text: "Solar and wind power are now the cheapest sources of new electricity in many regions.", answer: "True" },
        { type: "mcq", text: "What does \"intermittent\" refer to in the context of the passage?", options: ["Constant and predictable output", "Output that depends on weather conditions", "Output that never changes", "A type of battery storage"], answer: "Output that depends on weather conditions" },
        { type: "tfng", text: "The passage claims fossil fuels are now completely obsolete worldwide.", answer: "Not Given" },
        { type: "tfng", text: "Economies of scale have expanded globally in renewable energy production.", answer: "True" },
      ],
    },
    3: {
      title: "The Psychology of Procrastination",
      passage:
        "Procrastination, the act of delaying tasks despite knowing that doing so may lead to negative consequences, has long been dismissed as a simple failure of time management. More recent psychological research, however, suggests that procrastination is better understood as an emotional regulation problem rather than a planning deficiency. According to this view, people procrastinate primarily to avoid negative feelings, such as anxiety or self-doubt, associated with a particular task, rather than because they misjudge how long the task will take. This reframing has practical implications: strategies that focus solely on scheduling and productivity techniques may address the symptoms of procrastination without tackling its underlying emotional causes. Some psychologists advocate for self-compassion as a more effective intervention, arguing that individuals who forgive themselves for past procrastination are less likely to procrastinate again, whereas harsh self-criticism tends to increase the likelihood of future delay by reinforcing negative emotions linked to the task. Critics of this emotional-regulation model caution that it may not fully account for cases where procrastination is linked to attention-related difficulties, suggesting that a single explanatory framework may be insufficient to capture the full complexity of the behaviour.",
      questions: [
        { type: "tfng", text: "Procrastination has traditionally been viewed as simply a time-management failure.", answer: "True" },
        { type: "tfng", text: "Recent research suggests procrastination is purely about misjudging how long tasks take.", answer: "False" },
        { type: "tfng", text: "People procrastinate mainly to avoid negative feelings linked to a task.", answer: "True" },
        { type: "tfng", text: "Harsh self-criticism is shown to reduce future procrastination.", answer: "False" },
        { type: "tfng", text: "All psychologists agree that the emotional-regulation model fully explains procrastination.", answer: "False" },
        { type: "mcq", text: "What do some psychologists recommend as an effective intervention?", options: ["Stricter deadlines", "Self-compassion", "Harsher self-criticism", "Ignoring the task entirely"], answer: "Self-compassion" },
        { type: "mcq", text: "What is procrastination reframed as, according to recent research?", options: ["A planning deficiency", "An emotional regulation problem", "A purely genetic trait", "A sign of laziness only"], answer: "An emotional regulation problem" },
        { type: "mcq", text: "What is one limitation of the emotional-regulation model mentioned by critics?", options: ["It explains every case perfectly", "It may not fully account for attention-related difficulties", "It has never been tested", "It only applies to children"], answer: "It may not fully account for attention-related difficulties" },
        { type: "mcq", text: "What practical implication does the reframing of procrastination have?", options: ["Scheduling techniques alone may not address underlying causes", "Productivity apps solve procrastination completely", "Procrastination cannot be treated at all", "Only medication can help"], answer: "Scheduling techniques alone may not address underlying causes" },
        { type: "tfng", text: "Self-forgiveness for past procrastination is linked to less future procrastination.", answer: "True" },
        { type: "mcq", text: "According to the passage, what tends to reinforce negative emotions linked to a task?", options: ["Self-compassion", "Harsh self-criticism", "Better scheduling", "Taking breaks"], answer: "Harsh self-criticism" },
        { type: "tfng", text: "The passage concludes that a single framework fully explains all procrastination.", answer: "False" },
        { type: "tfng", text: "Anxiety is mentioned as an emotion linked to procrastination.", answer: "True" },
      ],
    },
  },

  8: {
    1: {
      title: "Deforestation and Global Rainfall Patterns",
      passage:
        "The relationship between large-scale deforestation and shifts in regional rainfall patterns has become a focal point of climate research, particularly in tropical regions where forest cover plays a disproportionate role in moisture cycling. Forests do not merely respond to rainfall; they actively generate it through a process known as evapotranspiration, whereby trees draw water from the soil and release it into the atmosphere as vapour, which subsequently condenses and falls as precipitation, often hundreds of kilometres downwind. This mechanism, sometimes termed the \"biotic pump,\" implies that deforestation in one region can trigger reduced rainfall in an entirely different, sometimes distant, area, a phenomenon that complicates efforts to attribute drought to purely local causes. Satellite data collected over recent decades has lent considerable support to this hypothesis, revealing correlations between forest loss in the Amazon basin and declining precipitation in agricultural regions further south. Critics of the theory caution that correlation does not establish causation, and that broader atmospheric circulation patterns, themselves influenced by global ocean temperatures, may account for much of the observed variability. Nonetheless, the growing body of evidence has prompted several governments to reconsider forest policy not solely as an issue of biodiversity conservation, but as one with direct implications for agricultural water security.",
      questions: [
        { type: "tfng", text: "Forests only respond to rainfall rather than influencing it.", answer: "False" },
        { type: "tfng", text: "Evapotranspiration involves trees releasing water vapour into the atmosphere.", answer: "True" },
        { type: "tfng", text: "The biotic pump mechanism suggests deforestation effects are always local.", answer: "False" },
        { type: "tfng", text: "Satellite data has shown a correlation between Amazon deforestation and reduced rainfall elsewhere.", answer: "True" },
        { type: "tfng", text: "All scientists agree that deforestation is the sole cause of regional drought.", answer: "False" },
        { type: "mcq", text: "What is the \"biotic pump\"?", options: ["A machine used to irrigate farmland", "The mechanism by which forests generate rainfall through evapotranspiration", "A satellite monitoring system", "A government forestry policy"], answer: "The mechanism by which forests generate rainfall through evapotranspiration" },
        { type: "mcq", text: "What do critics of the theory argue?", options: ["Deforestation has no effect on climate at all", "Correlation does not establish causation, and ocean-influenced circulation may explain variability", "Satellite data is always inaccurate", "Forests have no role in the water cycle"], answer: "Correlation does not establish causation, and ocean-influenced circulation may explain variability" },
        { type: "mcq", text: "Where has declining precipitation been correlated with Amazon deforestation?", options: ["Agricultural regions further south", "Northern Europe", "Coastal cities in Asia", "The Sahara Desert"], answer: "Agricultural regions further south" },
        { type: "mcq", text: "How are some governments now viewing forest policy?", options: ["As purely a biodiversity issue", "As having direct implications for agricultural water security", "As irrelevant to agriculture", "As a matter only for scientists to decide"], answer: "As having direct implications for agricultural water security" },
        { type: "tfng", text: "Rainfall generated by forests can fall hundreds of kilometres downwind.", answer: "True" },
        { type: "mcq", text: "What role do global ocean temperatures play, according to critics?", options: ["None at all", "They may influence atmospheric circulation patterns affecting rainfall", "They only affect coastal areas", "They are unrelated to deforestation research"], answer: "They may influence atmospheric circulation patterns affecting rainfall" },
        { type: "tfng", text: "The passage concludes that deforestation definitively causes all regional droughts.", answer: "False" },
        { type: "mcq", text: "What has the growing body of evidence prompted several governments to do?", options: ["Ban all agriculture near forests", "Reconsider forest policy as linked to water security", "Ignore satellite data entirely", "Ban satellite monitoring"], answer: "Reconsider forest policy as linked to water security" },
      ],
    },
    2: {
      title: "The Limits of Automated Translation",
      passage:
        "Machine translation systems have advanced considerably since the introduction of neural network-based models, which represent a marked departure from earlier, rule-based approaches that relied on explicit grammatical instructions. Contemporary systems are trained on vast corpora of bilingual text, learning statistical patterns that allow them to generate fluent translations without any human ever specifying explicit grammatical rules. Despite these advances, translation quality remains highly uneven across language pairs, largely reflecting the volume and quality of training data available; widely spoken languages with abundant digital text tend to be translated far more accurately than low-resource languages, for which comparatively little parallel text exists. Moreover, neural systems continue to struggle with idiomatic expressions, cultural references, and instances where meaning depends heavily on context that spans multiple sentences, since most models process text in relatively short segments. Some researchers have proposed incorporating document-level context into training, though doing so substantially increases computational demands. Professional translators note that while machine translation can now produce serviceable drafts for many routine texts, literary and legal translation, where precision and nuance are paramount, still require substantial human intervention, suggesting that full automation remains a distant prospect for such domains.",
      questions: [
        { type: "tfng", text: "Neural translation models rely on explicit grammatical rules specified by humans.", answer: "False" },
        { type: "tfng", text: "Translation quality is uniform across all language pairs.", answer: "False" },
        { type: "tfng", text: "Low-resource languages tend to have less parallel training text available.", answer: "True" },
        { type: "tfng", text: "Neural systems process text with full awareness of context spanning many sentences by default.", answer: "False" },
        { type: "tfng", text: "Literary and legal translation currently require substantial human intervention.", answer: "True" },
        { type: "mcq", text: "What is a key difference between neural and earlier rule-based translation systems?", options: ["Neural systems require explicit grammar rules", "Neural systems learn statistical patterns from bilingual text instead of explicit rules", "Rule-based systems were always more accurate", "Neural systems cannot translate idioms at all"], answer: "Neural systems learn statistical patterns from bilingual text instead of explicit rules" },
        { type: "mcq", text: "Why do widely spoken languages tend to be translated more accurately?", options: ["They are grammatically simpler", "They have abundant training data available", "They require less computation", "They were the first to be studied"], answer: "They have abundant training data available" },
        { type: "mcq", text: "What do neural systems continue to struggle with?", options: ["Basic vocabulary", "Idiomatic expressions and context spanning multiple sentences", "Counting words", "Formatting documents"], answer: "Idiomatic expressions and context spanning multiple sentences" },
        { type: "mcq", text: "What has incorporating document-level context been shown to do?", options: ["Reduce computational demands", "Substantially increase computational demands", "Eliminate the need for training data", "Make translations less accurate"], answer: "Substantially increase computational demands" },
        { type: "tfng", text: "Machine translation can produce serviceable drafts for many routine texts.", answer: "True" },
        { type: "mcq", text: "According to professional translators, what remains a distant prospect?", options: ["Full automation of literary and legal translation", "Any use of machine translation at all", "Translation of routine texts", "Training on bilingual corpora"], answer: "Full automation of literary and legal translation" },
        { type: "tfng", text: "The passage states that all researchers agree computational cost is not a concern.", answer: "False" },
        { type: "tfng", text: "Legal translation is described as requiring less nuance than routine texts.", answer: "False" },
      ],
    },
    3: {
      title: "The Paradox of Choice in Consumer Behaviour",
      passage:
        "Conventional economic theory has long assumed that greater choice benefits consumers by allowing them to select the option that best matches their preferences. However, a body of psychological research has challenged this assumption, suggesting that beyond a certain point, an abundance of options can actually reduce consumer satisfaction and even discourage purchasing altogether, a phenomenon often referred to as the paradox of choice. In an often-cited experiment, researchers set up sampling booths offering either a small or a large selection of jams; while the larger display attracted more initial interest, it resulted in significantly fewer actual purchases than the smaller display, suggesting that excessive choice can be paralysing rather than empowering. Proposed explanations include the increased cognitive effort required to compare numerous options, as well as heightened anticipatory regret, the fear that an alternative choice might have been superior. Retailers have responded to this research in varied ways: some have deliberately curated smaller product ranges to simplify decision-making, while others have introduced filtering tools and algorithmic recommendations to help customers navigate large inventories without feeling overwhelmed. It is worth noting, however, that subsequent replications of the original jam experiment have produced mixed results, with some studies failing to reproduce the effect under different conditions, suggesting that the paradox of choice may be more context-dependent than initially assumed.",
      questions: [
        { type: "tfng", text: "Conventional economic theory assumes greater choice always benefits consumers.", answer: "True" },
        { type: "tfng", text: "The larger jam display resulted in more purchases than the smaller display.", answer: "False" },
        { type: "tfng", text: "Anticipatory regret refers to fear that an alternative choice might have been better.", answer: "True" },
        { type: "tfng", text: "All retailers have responded to this research by removing all product choices entirely.", answer: "False" },
        { type: "tfng", text: "Subsequent replications of the jam experiment always confirmed the original results.", answer: "False" },
        { type: "mcq", text: "What is the \"paradox of choice\"?", options: ["The idea that more choice always increases satisfaction", "The idea that excessive choice can reduce satisfaction and discourage purchasing", "A marketing technique used by all retailers", "A rule in classical economic theory"], answer: "The idea that excessive choice can reduce satisfaction and discourage purchasing" },
        { type: "mcq", text: "What did the larger jam display attract, according to the passage?", options: ["More initial interest but fewer purchases", "Fewer purchases and less interest", "More purchases and less interest", "No interest at all"], answer: "More initial interest but fewer purchases" },
        { type: "mcq", text: "What explanations are proposed for the paradox of choice?", options: ["Lower prices and better marketing", "Increased cognitive effort and heightened anticipatory regret", "Reduced product quality", "Government regulation"], answer: "Increased cognitive effort and heightened anticipatory regret" },
        { type: "mcq", text: "How have some retailers responded to this research?", options: ["By curating smaller product ranges or adding filtering tools", "By ignoring consumer psychology entirely", "By eliminating all choice", "By raising prices"], answer: "By curating smaller product ranges or adding filtering tools" },
        { type: "tfng", text: "Filtering tools and algorithmic recommendations have been introduced by some retailers.", answer: "True" },
        { type: "mcq", text: "What do the mixed results of replication studies suggest?", options: ["The paradox of choice is universally true in all contexts", "The paradox of choice may be more context-dependent than first assumed", "The original experiment was completely fabricated", "Consumer behaviour cannot be studied scientifically"], answer: "The paradox of choice may be more context-dependent than first assumed" },
        { type: "tfng", text: "The passage concludes that the paradox of choice has been proven true in every single study.", answer: "False" },
        { type: "tfng", text: "The jam experiment is described as an often-cited study.", answer: "True" },
      ],
    },
  },

  9: {
    1: {
      title: "Algorithmic Decision-Making and the Erosion of Institutional Accountability",
      passage:
        "The proliferation of algorithmic decision-making systems across public institutions, from welfare eligibility determinations to judicial risk assessments, has precipitated a quiet but consequential transformation in the locus of institutional accountability. Traditionally, when a bureaucratic decision adversely affected an individual, there existed, at least in principle, an identifiable human actor or chain of actors who could be called upon to justify the reasoning behind it. The introduction of proprietary, often opaque, algorithmic systems has, in numerous documented instances, attenuated this chain of justification, as decision-makers increasingly defer to outputs generated by processes they neither designed nor fully comprehend. Proponents of algorithmic governance contend that such systems, properly calibrated, can reduce the inconsistency and implicit bias that pervade human discretionary judgement, and that empirical audits, where permitted, can in fact render institutional decision-making more transparent than its human-administered predecessor. Sceptics counter that this argument presupposes a level of auditability that commercial confidentiality frequently precludes, and that the delegation of consequential judgement to systems immune from the ordinary demands of explanation constitutes a substantive, rather than merely procedural, diminishment of accountability. This tension is further complicated by the observation that many affected individuals lack the technical literacy, and often the legal standing, to meaningfully contest an algorithmically-derived determination, even where formal appeal mechanisms nominally exist. Some legal scholars have consequently proposed a right to \"meaningful explanation\" as a necessary corollary to any expansion of algorithmic authority within public administration, though the practical contours of such a right remain contested and, as yet, only partially codified in law.",
      questions: [
        { type: "tfng", text: "Traditionally, bureaucratic decisions could always be traced to an identifiable human actor.", answer: "True" },
        { type: "tfng", text: "Proprietary algorithmic systems are always fully transparent to the officials who use them.", answer: "False" },
        { type: "tfng", text: "Proponents of algorithmic governance argue such systems can reduce human bias.", answer: "True" },
        { type: "tfng", text: "Commercial confidentiality is described as an obstacle to auditability.", answer: "True" },
        { type: "tfng", text: "All affected individuals have the technical literacy to contest algorithmic decisions.", answer: "False" },
        { type: "mcq", text: "What do sceptics argue about delegating judgement to algorithmic systems?", options: ["It has no effect on accountability", "It constitutes a substantive diminishment of accountability", "It always improves transparency", "It is legally required in all countries"], answer: "It constitutes a substantive diminishment of accountability" },
        { type: "mcq", text: "What have some legal scholars proposed as a corollary to algorithmic authority?", options: ["A ban on all algorithmic systems", "A right to \"meaningful explanation\"", "Mandatory human review of every decision", "Unlimited commercial confidentiality"], answer: "A right to \"meaningful explanation\"" },
        { type: "mcq", text: "What complicates individuals' ability to contest algorithmic determinations?", options: ["Lack of technical literacy and legal standing", "Excessive appeal mechanisms", "Too much transparency", "Overregulation"], answer: "Lack of technical literacy and legal standing" },
        { type: "mcq", text: "According to proponents, what can empirical audits achieve where permitted?", options: ["Nothing of significance", "Render decision-making more transparent than human-administered predecessors", "Eliminate the need for legal appeal", "Guarantee equal outcomes for all"], answer: "Render decision-making more transparent than human-administered predecessors" },
        { type: "tfng", text: "The practical contours of a \"right to meaningful explanation\" are fully codified in law worldwide.", answer: "False" },
        { type: "mcq", text: "What is the passage's overall stance on algorithmic decision-making?", options: ["Entirely positive with no caveats", "Entirely negative with no benefits acknowledged", "It presents both proponents' and sceptics' arguments without a firm final verdict", "It argues algorithms should replace all human judgement immediately"], answer: "It presents both proponents' and sceptics' arguments without a firm final verdict" },
        { type: "tfng", text: "Judicial risk assessments are mentioned as one application of algorithmic decision-making.", answer: "True" },
        { type: "mcq", text: "Why do decision-makers increasingly defer to algorithmic outputs, according to the passage?", options: ["They fully understand the underlying processes", "They neither designed nor fully comprehend the processes but defer anyway", "They are legally required to do so in every case", "Algorithms are always more accurate than humans"], answer: "They neither designed nor fully comprehend the processes but defer anyway" },
      ],
    },
    2: {
      title: "Epistemic Humility in an Age of Information Abundance",
      passage:
        "The unprecedented accessibility of information in the digital era has paradoxically coincided with what many scholars describe as a crisis of epistemic overconfidence, wherein individuals, equipped with the capacity to retrieve vast quantities of data almost instantaneously, frequently overestimate the reliability and completeness of their own understanding. This phenomenon appears to be compounded by the architecture of search engines and recommendation algorithms, which tend to surface content that reinforces existing beliefs, thereby creating an illusion of consensus that may not withstand scrutiny were a broader range of perspectives to be considered. Philosophers of knowledge have long argued that genuine epistemic humility, an appropriate recognition of the limits of one's own understanding, requires active engagement with disconfirming evidence, a practice that algorithmic curation may inadvertently discourage by minimising exposure to it. Some cognitive scientists further contend that the sheer volume of accessible information can induce a false sense of mastery, since the ease of locating a fact is often conflated, at a psychological level, with genuine comprehension of the broader context in which that fact is embedded. This conflation, sometimes termed the \"illusion of explanatory depth,\" has been documented across numerous domains, from mechanical devices to political policy, wherein individuals asked to articulate detailed explanations of phenomena they claim to understand frequently discover, mid-explanation, considerable gaps in their own knowledge. Proposed remedies include deliberate exposure to opposing viewpoints and pedagogical approaches that reward the identification of uncertainty rather than merely the confident assertion of conclusions, though implementing such approaches at scale within existing educational and media institutions remains a formidable challenge.",
      questions: [
        { type: "tfng", text: "Greater access to information has been linked to a decrease in epistemic overconfidence.", answer: "False" },
        { type: "tfng", text: "Search engines and recommendation algorithms tend to surface belief-reinforcing content.", answer: "True" },
        { type: "tfng", text: "Genuine epistemic humility requires active engagement with disconfirming evidence.", answer: "True" },
        { type: "tfng", text: "The \"illusion of explanatory depth\" has only been documented in political contexts.", answer: "False" },
        { type: "tfng", text: "Implementing proposed remedies at scale is described as straightforward.", answer: "False" },
        { type: "mcq", text: "What is the \"illusion of explanatory depth\"?", options: ["The tendency to underestimate one's knowledge", "Conflating the ease of finding a fact with genuine comprehension of it", "A technique used by search engines", "A form of algorithmic curation"], answer: "Conflating the ease of finding a fact with genuine comprehension of it" },
        { type: "mcq", text: "What do algorithmic recommendation systems tend to do, according to the passage?", options: ["Present a balanced range of perspectives", "Reinforce existing beliefs and create an illusion of consensus", "Eliminate epistemic overconfidence", "Encourage disconfirming evidence"], answer: "Reinforce existing beliefs and create an illusion of consensus" },
        { type: "mcq", text: "What do cognitive scientists suggest about accessible information volume?", options: ["It always improves comprehension", "It can induce a false sense of mastery", "It has no psychological effect", "It only affects mechanical knowledge"], answer: "It can induce a false sense of mastery" },
        { type: "mcq", text: "What do proposed remedies include?", options: ["Reducing all access to information", "Deliberate exposure to opposing viewpoints and rewarding identification of uncertainty", "Banning search engines entirely", "Increasing algorithmic curation"], answer: "Deliberate exposure to opposing viewpoints and rewarding identification of uncertainty" },
        { type: "tfng", text: "People asked to explain phenomena in detail sometimes discover gaps in their own knowledge.", answer: "True" },
        { type: "mcq", text: "According to philosophers of knowledge, what does epistemic humility require?", options: ["Confident assertion of conclusions", "Recognition of the limits of one's own understanding", "Avoidance of all uncertainty", "Reliance solely on algorithms"], answer: "Recognition of the limits of one's own understanding" },
        { type: "tfng", text: "The passage claims this issue has already been fully resolved by educational institutions.", answer: "False" },
        { type: "tfng", text: "The illusion of explanatory depth has been documented across domains including mechanical devices.", answer: "True" },
      ],
    },
    3: {
      title: "The Contested Boundaries of Corporate Personhood",
      passage:
        "The legal doctrine of corporate personhood, whereby corporations are treated as distinct legal entities possessing certain rights and obligations analogous to those of natural persons, has occasioned sustained controversy since its formal articulation in various jurisdictions over the past century and a half. Proponents of the doctrine argue that it serves an indispensable practical function, enabling corporations to enter contracts, own property, and be sued, thereby facilitating commercial activity without exposing individual shareholders to unlimited personal liability. Critics, however, contend that the extension of personhood beyond these narrow practical functions, particularly into domains such as political speech and religious expression, represents a conceptual overreach that anthropomorphises an entity fundamentally distinct from a natural person in its motivations, accountability, and capacity for moral reasoning. This controversy has been thrown into particularly sharp relief by judicial decisions extending certain constitutional protections to corporations, decisions that critics argue conflate the aggregation of economic power with the exercise of individual conscience, while proponents counter that such protections merely safeguard the associative rights of the individuals who constitute the corporation. A further complication arises from the increasingly transnational nature of corporate structures, which has generated jurisdictional ambiguities regarding which legal system's conception of corporate personhood should govern a given entity's rights and liabilities, particularly in cases involving alleged human rights violations committed by subsidiaries operating in jurisdictions with markedly different regulatory regimes than those of the parent company. Legal scholars remain divided as to whether existing doctrine is adequate to address these emergent complexities, or whether a fundamental reconceptualization of corporate legal status is required to reconcile commercial pragmatism with evolving normative expectations regarding accountability.",
      questions: [
        { type: "tfng", text: "Corporate personhood allows corporations to enter contracts and own property.", answer: "True" },
        { type: "tfng", text: "All critics of corporate personhood reject the doctrine's practical functions entirely.", answer: "Not Given" },
        { type: "tfng", text: "Corporate personhood limits shareholders' exposure to unlimited personal liability.", answer: "True" },
        { type: "tfng", text: "Critics argue that extending personhood into political speech anthropomorphises corporations.", answer: "True" },
        { type: "tfng", text: "Transnational corporate structures create no jurisdictional complications, according to the passage.", answer: "False" },
        { type: "mcq", text: "What practical function do proponents attribute to corporate personhood?", options: ["It grants corporations religious beliefs", "It enables contracts, property ownership, and limited liability", "It eliminates the need for courts", "It gives corporations voting rights in elections"], answer: "It enables contracts, property ownership, and limited liability" },
        { type: "mcq", text: "What do critics argue about extending constitutional protections to corporations?", options: ["It appropriately reflects individual conscience", "It conflates economic power with individual conscience", "It has no effect on political speech", "It is universally accepted by legal scholars"], answer: "It conflates economic power with individual conscience" },
        { type: "mcq", text: "What complication arises from transnational corporate structures?", options: ["Jurisdictional ambiguity over which legal system's rules should apply", "The complete elimination of corporate liability", "Universal agreement on legal standards", "The abolition of subsidiary companies"], answer: "Jurisdictional ambiguity over which legal system's rules should apply" },
        { type: "mcq", text: "What are legal scholars divided about, according to the passage?", options: ["Whether corporations should exist at all", "Whether existing doctrine is adequate or requires reconceptualization", "Whether shareholders should have any rights", "Whether courts should be abolished"], answer: "Whether existing doctrine is adequate or requires reconceptualization" },
        { type: "tfng", text: "Judicial decisions have extended certain constitutional protections to corporations.", answer: "True" },
        { type: "mcq", text: "What do proponents say about protections extended to corporations?", options: ["They safeguard the associative rights of the individuals who constitute the corporation", "They are purely symbolic and have no legal effect", "They apply only to non-profit organisations", "They were rejected by all courts"], answer: "They safeguard the associative rights of the individuals who constitute the corporation" },
        { type: "tfng", text: "The passage concludes definitively that corporate personhood doctrine must be abolished.", answer: "False" },
        { type: "tfng", text: "The doctrine has existed for over a century in various jurisdictions.", answer: "True" },
      ],
    },
  },
};

/* ============ GRAMMAR: darajaga xos (Part shart emas, 10 tadan savol) ============ */

const grammarBank = {
  5: [
    { text: "She ___ to school every day.", options: ["go", "goes", "going", "went"], answer: "goes" },
    { text: "They ___ watching TV right now.", options: ["is", "am", "are", "was"], answer: "are" },
    { text: "I ___ a car yesterday.", options: ["buy", "bought", "buys", "buying"], answer: "bought" },
    { text: "There ___ many books on the table.", options: ["is", "are", "be", "was"], answer: "are" },
    { text: "He is ___ than his brother.", options: ["tall", "taller", "tallest", "more tall"], answer: "taller" },
    { text: "I have ___ apple in my bag.", options: ["a", "an", "the", "-"], answer: "an" },
    { text: "We ___ to the cinema last night.", options: ["go", "went", "goes", "going"], answer: "went" },
    { text: "She ___ her homework every evening.", options: ["do", "does", "doing", "did"], answer: "does" },
    { text: "This is ___ book I have ever read.", options: ["good", "better", "the best", "best"], answer: "the best" },
    { text: "They ___ football on Sundays.", options: ["play", "plays", "playing", "played"], answer: "play" },
  ],
  6: [
    { text: "If it rains, we ___ stay home.", options: ["will", "would", "can", "must"], answer: "will" },
    { text: "I have never ___ to Japan.", options: ["be", "been", "being", "was"], answer: "been" },
    { text: "The letter ___ by John yesterday.", options: ["was written", "wrote", "is written", "write"], answer: "was written" },
    { text: "You like coffee, ___?", options: ["don't you", "do you", "aren't you", "isn't it"], answer: "don't you" },
    { text: "She has lived here ___ 2010.", options: ["for", "since", "from", "at"], answer: "since" },
    { text: "My keys ___ missing since morning.", options: ["has been", "have been", "is", "was"], answer: "have been" },
    { text: "He asked me where ___.", options: ["I live", "do I live", "I lived", "did I live"], answer: "I lived" },
    { text: "___ you finished your homework yet?", options: ["Did", "Have", "Has", "Do"], answer: "Have" },
    { text: "The movie was ___ boring that we left.", options: ["so", "such", "too", "very"], answer: "so" },
    { text: "If I were you, I ___ apologise.", options: ["will", "would", "can", "should"], answer: "would" },
  ],
  7: [
    { text: "If I had studied harder, I ___ the exam.", options: ["would pass", "would have passed", "will pass", "passed"], answer: "would have passed" },
    { text: "The man ___ car was stolen called the police.", options: ["who", "whose", "which", "whom"], answer: "whose" },
    { text: "She said she ___ tired.", options: ["is", "was", "has been", "be"], answer: "was" },
    { text: "If I were rich, I ___ travel the world.", options: ["will", "would", "can", "must"], answer: "would" },
    { text: "This is the house ___ I grew up.", options: ["which", "where", "who", "whose"], answer: "where" },
    { text: "By next year, she ___ here for a decade.", options: ["will have worked", "will work", "has worked", "works"], answer: "will have worked" },
    { text: "He denied ___ the money.", options: ["steal", "stealing", "to steal", "stole"], answer: "stealing" },
    { text: "Not only ___ late, but he also forgot the documents.", options: ["he was", "was he", "he is", "is he"], answer: "was he" },
    { text: "The report, ___ was published yesterday, caused controversy.", options: ["that", "which", "who", "whom"], answer: "which" },
    { text: "I wish I ___ more time to prepare.", options: ["have", "had", "has", "having"], answer: "had" },
  ],
  8: [
    { text: "Had I known earlier, I ___ differently.", options: ["would act", "would have acted", "act", "acted"], answer: "would have acted" },
    { text: "It is essential that he ___ present.", options: ["is", "be", "was", "being"], answer: "be" },
    { text: "Rarely ___ such dedication.", options: ["we have seen", "have we seen", "we saw", "did we saw"], answer: "have we seen" },
    { text: "The proposal is believed ___ by the board next week.", options: ["to approve", "to be approved", "approving", "approved"], answer: "to be approved" },
    { text: "If she hadn't missed the flight, she ___ jet-lagged now.", options: ["wouldn't be", "wouldn't have been", "isn't", "won't be"], answer: "wouldn't be" },
    { text: "Under no circumstances ___ this door be left unlocked.", options: ["should", "must", "will", "can"], answer: "should" },
    { text: "The committee insisted that the report ___ revised.", options: ["is", "be", "was", "being"], answer: "be" },
    { text: "So exhausted ___ that she fell asleep instantly.", options: ["was she", "she was", "did she", "she did"], answer: "was she" },
    { text: "He would rather she ___ tomorrow.", options: ["comes", "come", "came", "will come"], answer: "came" },
    { text: "Little ___ that the deal would collapse.", options: ["he knew", "did he know", "he did know", "knew he"], answer: "did he know" },
  ],
  9: [
    { text: "It was not until the results arrived ___ we understood the scale of the problem.", options: ["that", "when", "where", "which"], answer: "that" },
    { text: "What the committee failed to consider ___ the long-term economic repercussions.", options: ["were", "was", "are", "being"], answer: "was" },
    { text: "Seldom ___ a proposal met with such unanimous approval.", options: ["has", "have", "did", "was"], answer: "has" },
    { text: "Were it not for his intervention, the merger ___ collapsed.", options: ["would have", "would", "will have", "had"], answer: "would have" },
    { text: "The findings, far from ___ the theory, actually undermine it.", options: ["supporting", "support", "supported", "to support"], answer: "supporting" },
    { text: "So subtle ___ the shift that few analysts noticed it.", options: ["was", "were", "did", "is"], answer: "was" },
    { text: "It is imperative that the evidence ___ scrutinised before publication.", options: ["is", "be", "was", "being"], answer: "be" },
    { text: "Not until much later ___ the true implications become apparent.", options: ["did", "does", "would", "had"], answer: "did" },
    { text: "His argument, compelling ___ it was, failed to sway the jury.", options: ["as", "though", "that", "which"], answer: "though" },
    { text: "Had the funding been secured sooner, the project ___ on schedule.", options: ["would finish", "would have finished", "finishes", "finished"], answer: "would have finished" },
  ],
};

/* ============ SPEAKING: har bir daraja uchun 3 ta noyob mavzu (Part 1/2/3) ============ */

const speakingByLevel = {
  5: {
    1: {
      title: "My Daily Routine",
      questions: [
        { q: "What time do you usually wake up?", a: "I usually wake up at seven o'clock in the morning." },
        { q: "What do you eat for breakfast?", a: "I usually eat bread and eggs, and I drink tea." },
        { q: "How do you go to school or work?", a: "I go to school by bus. It takes about twenty minutes." },
        { q: "What do you do after school or work?", a: "After school, I usually do my homework and then relax at home." },
        { q: "What time do you go to bed?", a: "I usually go to bed at ten o'clock at night." },
        { q: "Do you like your daily routine?", a: "Yes, I like my routine because it is simple and I know what to do every day." },
        { q: "What is the busiest part of your day?", a: "The busiest part of my day is the morning, because I have to get ready quickly." },
        { q: "Do you have the same routine every day?", a: "No, my routine is different on weekends. I wake up later and relax more." },
        { q: "Who do you usually see during your day?", a: "I usually see my family in the morning and my classmates during the day." },
        { q: "What would you like to change about your routine?", a: "I would like to wake up earlier so I have more time in the morning." },
      ],
    },
    2: {
      title: "Describe Your Favourite Season",
      questions: [
        { q: "Describe your favourite season. You should say: which season it is, what the weather is like, what you do during this season, and explain why you like it.", a: "My favourite season is spring. The weather is warm but not too hot, and the flowers start to bloom everywhere. During spring, I like to walk in the park with my family and take photos of the flowers. I like this season because the weather is comfortable and everything looks fresh and colourful." },
        { q: "What clothes do you wear in this season?", a: "In spring, I usually wear a light jacket in the morning and a t-shirt in the afternoon, because the temperature changes during the day." },
        { q: "What foods do people usually eat in this season?", a: "People usually eat fresh fruit like strawberries and salads, because the weather is getting warmer." },
        { q: "Do children enjoy this season?", a: "Yes, children enjoy it a lot because they can play outside without wearing heavy coats." },
        { q: "Is this season the same in every part of your country?", a: "Not exactly, in the mountains it stays cooler for longer, but in the city it becomes warm very quickly." },
      ],
    },
    3: {
      title: "Seasons and Weather in General",
      questions: [
        { q: "How do seasons affect people's daily activities?", a: "Seasons affect what people wear, what they eat, and what activities they do, for example more people go outside in warm seasons." },
        { q: "Why do some people prefer cold seasons to warm ones?", a: "Some people prefer cold seasons because they enjoy activities like skiing, or simply because they feel more comfortable in cooler weather." },
        { q: "Do you think weather affects people's mood?", a: "Yes, I think sunny weather usually makes people feel happier, while grey, rainy days can make people feel tired or sad." },
        { q: "How has climate changed in your country in recent years?", a: "I have noticed that summers seem hotter than before, and the seasons seem less predictable than in the past." },
        { q: "Should schools change their holidays based on the seasons?", a: "I think it could be helpful, for example having a longer break in the hottest part of summer so children are more comfortable." },
      ],
    },
  },
  6: {
    1: {
      title: "Shopping Habits",
      questions: [
        { q: "How often do you go shopping?", a: "I generally go shopping once a week, usually at the weekend when I have more free time." },
        { q: "Do you prefer shopping online or in physical stores?", a: "I generally prefer shopping online because it saves time and I can compare prices easily." },
        { q: "What kinds of things do you usually buy?", a: "I usually buy groceries and occasionally clothes, depending on what I need that week." },
        { q: "Do you enjoy shopping with other people or alone?", a: "I generally enjoy shopping with a friend, since it makes the experience more enjoyable and I can get their opinion." },
        { q: "Have your shopping habits changed in recent years?", a: "Yes, I used to shop mainly in stores, but nowadays I shop online much more often." },
        { q: "Do you think advertising influences what people buy?", a: "Yes, I believe advertising has a strong influence, especially on younger people who see it constantly on social media." },
        { q: "What do you think about discounts and sales?", a: "I think discounts can be useful, but sometimes people buy things they don't actually need just because of a sale." },
        { q: "Is shopping considered a popular leisure activity in your country?", a: "Yes, shopping is quite popular as a leisure activity, especially at large shopping centres on weekends." },
        { q: "Do you plan your purchases in advance or buy things spontaneously?", a: "I generally try to plan my purchases in advance, although I do occasionally buy things spontaneously." },
        { q: "What could shops do to improve the shopping experience?", a: "I think shops could improve by offering better customer service and clearer information about their products." },
      ],
    },
    2: {
      title: "Describe a Skill You Would Like to Learn",
      questions: [
        { q: "Describe a skill you would like to learn. You should say: what the skill is, why you want to learn it, how you would learn it, and explain how it would benefit you.", a: "I would like to learn how to cook properly. I want to learn it because I currently rely on ready-made meals, which are not very healthy. I would learn it by watching online cooking videos and practising simple recipes at home. This skill would benefit me because I could eat healthier food and save money by not eating out so often." },
        { q: "Is it difficult to learn this skill on your own?", a: "It can be a bit difficult at first, since I might make mistakes, but with practice and online tutorials, I think it becomes easier over time." },
        { q: "How much time would you need to learn this skill well?", a: "I imagine it would take several months of regular practice to feel confident cooking a range of different dishes." },
        { q: "Would you rather learn this skill from a course or by yourself?", a: "I would probably prefer a mix of both, taking a short course for the basics and then practising by myself afterwards." },
        { q: "Do you think this skill will be useful for your whole life?", a: "Yes, I think cooking is a practical skill that will be useful throughout my life, regardless of my job or where I live." },
      ],
    },
    3: {
      title: "Learning New Skills in General",
      questions: [
        { q: "Why do people want to learn new skills as adults?", a: "People often want to learn new skills to improve their career prospects, to save money, or simply for personal enjoyment." },
        { q: "Is it easier for children or adults to learn new skills?", a: "I think it depends on the skill; children may learn languages more easily, but adults often have better discipline for structured learning." },
        { q: "How has technology changed the way people learn new skills?", a: "Technology has made learning much more accessible, since people can now watch tutorials or take online courses instead of needing an in-person teacher." },
        { q: "Do you think schools should teach more practical life skills?", a: "Yes, I believe schools should teach practical skills like cooking, budgeting, and basic repairs, since these are useful in everyday life." },
        { q: "What skills do you think will become more important in the future?", a: "I think skills related to technology and digital literacy will become increasingly important as more jobs require these abilities." },
      ],
    },
  },
  7: {
    1: {
      title: "The Role of Public Transport",
      questions: [
        { q: "How developed is public transport in your city?", a: "Public transport in my city is fairly well developed, with an extensive bus network, although the metro system is still expanding." },
        { q: "What are the main advantages of using public transport?", a: "The main advantages include reduced traffic congestion, lower costs compared to owning a car, and a smaller environmental footprint." },
        { q: "Why do some people prefer to drive rather than use public transport?", a: "Some people prefer driving because it offers greater flexibility and comfort, particularly for those living in areas with limited transport coverage." },
        { q: "Do you think governments should invest more in public transport?", a: "Yes, I believe governments should prioritise investment in public transport, as it can significantly reduce congestion and pollution in the long run." },
        { q: "How might public transport change in the next twenty years?", a: "I imagine public transport will become increasingly automated and electric, with smart systems optimising routes based on real-time demand." },
        { q: "What impact does public transport have on the environment?", a: "Public transport generally has a considerably smaller environmental impact than private vehicles, since it transports more people while producing fewer emissions per capita." },
        { q: "Should public transport be free for everyone?", a: "This is debatable; while free transport could increase usage, it might also strain public budgets unless carefully funded through alternative means." },
        { q: "What problems do cities face when public transport is inadequate?", a: "Inadequate public transport often leads to greater traffic congestion, higher pollution levels, and reduced accessibility for those without private vehicles." },
        { q: "How does public transport affect people's quality of life?", a: "Efficient public transport can significantly enhance quality of life by reducing commute times and providing affordable access to jobs and services." },
        { q: "Is it more effective to build new roads or improve public transport to reduce congestion?", a: "I would argue that improving public transport is generally more effective, since building new roads tends to encourage more car use rather than solving congestion." },
      ],
    },
    2: {
      title: "Describe a Time You Helped Someone in Your Community",
      questions: [
        { q: "Describe a time you helped someone in your community. You should say: who you helped, what you did, why they needed help, and explain how you felt afterwards.", a: "I once helped an elderly neighbour carry her groceries up several flights of stairs, since the lift in our building was broken. She needed help because the bags were quite heavy and she has difficulty with stairs. Afterwards, I felt genuinely satisfied, since it was a small gesture that clearly made a meaningful difference to her day, and it reminded me how important small acts of kindness can be within a community." },
        { q: "Do you think people help their neighbours as much as they used to?", a: "I would say people generally help each other less than in the past, partly because modern life is busier and communities are less tightly connected." },
        { q: "What could be done to encourage more community spirit?", a: "Local events, such as street gatherings or community projects, could help encourage neighbours to interact and build stronger relationships." },
        { q: "Is it more common for younger or older people to volunteer?", a: "In my experience, it varies considerably, though older people who are retired often have more time available to volunteer regularly." },
        { q: "How does helping others affect a person's own wellbeing?", a: "Research suggests that helping others can genuinely improve a person's own sense of wellbeing and purpose, not just benefit the person receiving help." },
      ],
    },
    3: {
      title: "Community and Social Responsibility",
      questions: [
        { q: "Do you think individuals have a responsibility to help their communities?", a: "I would argue that individuals do bear some responsibility, though the extent of this obligation is naturally debatable and depends on personal circumstances." },
        { q: "How has urbanisation affected the sense of community in cities?", a: "Urbanisation has arguably weakened traditional community bonds, since people in cities often live more anonymously and have less regular contact with neighbours." },
        { q: "What role should governments play in encouraging civic participation?", a: "Governments could play a significant role by funding community centres and organising initiatives that bring residents together for shared purposes." },
        { q: "Is volunteering more beneficial to the volunteer or to society?", a: "I believe it benefits both considerably, since society gains practical support while volunteers often develop new skills and a stronger sense of purpose." },
        { q: "Do you think social media has strengthened or weakened community ties?", a: "I would suggest it has done both; it connects people across distances but can also reduce face-to-face interaction within local communities." },
      ],
    },
  },
  8: {
    1: {
      title: "Ethical Consumerism",
      questions: [
        { q: "What does the term \"ethical consumerism\" mean to you?", a: "To me, ethical consumerism refers to the practice of making purchasing decisions based on the social and environmental impact of a product, rather than price or convenience alone." },
        { q: "Why has ethical consumerism become more prominent in recent years?", a: "I think heightened awareness of climate change and labour exploitation, amplified through social media, has prompted consumers to scrutinise the origins of the products they buy." },
        { q: "Do you think individual purchasing decisions can genuinely influence corporate behaviour?", a: "To some extent, yes, though I would argue that meaningful change tends to require collective consumer pressure combined with regulatory intervention, rather than isolated individual choices." },
        { q: "What are the limitations of relying on consumers to drive ethical change?", a: "One significant limitation is that ethical products are often priced at a premium, which effectively excludes lower-income consumers from participating meaningfully in this movement." },
        { q: "Should governments regulate companies more strictly regarding ethical practices, rather than leaving it to consumer choice?", a: "I would contend that government regulation is essential, since voluntary consumer-driven change alone has proven insufficient to address systemic issues like exploitative labour practices." },
        { q: "How reliable is the information companies provide about their ethical credentials?", a: "Unfortunately, I think much of this information is unreliable, given the prevalence of \"greenwashing\", where companies exaggerate their environmental credentials for marketing purposes." },
        { q: "What role might technology play in improving transparency in supply chains?", a: "Emerging technologies such as blockchain could potentially allow consumers to trace a product's entire supply chain, though widespread adoption remains a considerable challenge." },
        { q: "Do you think ethical consumerism is accessible to people from all economic backgrounds?", a: "Honestly, I don't think it currently is, since ethically produced goods typically carry a price premium that puts them out of reach for many households." },
        { q: "How might businesses be incentivised to adopt more ethical practices?", a: "Businesses could be incentivised through tax benefits for verified ethical practices, alongside reputational risks and potential penalties for demonstrably unethical conduct." },
        { q: "What is your view on the long-term future of ethical consumerism?", a: "I suspect it will become increasingly mainstream as younger, more socially conscious generations gain greater purchasing power, though genuine systemic change will likely require sustained regulatory support." },
      ],
    },
    2: {
      title: "Describe a Difficult Decision You Made",
      questions: [
        { q: "Describe a difficult decision you made. You should say: what the decision was, what factors you considered, why it was difficult, and explain what the outcome was.", a: "One particularly difficult decision I made was choosing between accepting a stable job offer and pursuing further study abroad. I had to weigh factors such as financial security, career prospects, and the personal growth that studying overseas might offer. It was difficult because both options carried significant long-term implications, and I felt considerable pressure to make the \"right\" choice. Ultimately, I decided to pursue further study, and while it involved short-term financial sacrifice, it has since opened up opportunities I would not otherwise have had." },
        { q: "Do you think it's better to make decisions quickly or take time to consider them?", a: "I would argue it depends on the stakes involved; for major life decisions, taking sufficient time to weigh the options carefully is generally more prudent." },
        { q: "How do you usually cope with the stress of making a difficult decision?", a: "I typically try to break the decision down into smaller factors and discuss it with people I trust, which helps clarify my own priorities." },
        { q: "Do older people generally make better decisions than younger people?", a: "Not necessarily, though older people often benefit from greater life experience, which can inform more considered judgement in certain situations." },
        { q: "What role does regret play in how people evaluate their past decisions?", a: "I think regret can be instructive if approached constructively, though dwelling on it excessively can prevent people from making confident decisions in the future." },
      ],
    },
    3: {
      title: "Decision-Making and Rationality",
      questions: [
        { q: "Do you think humans are generally rational decision-makers?", a: "I would argue that humans are only partially rational, since emotional and social factors frequently override purely logical reasoning in practice." },
        { q: "How do cognitive biases affect the decisions people make?", a: "Cognitive biases can distort judgement considerably, for instance leading people to overweight recent events or seek information that confirms existing beliefs." },
        { q: "Should important decisions, such as those in medicine or law, be left to algorithms rather than humans?", a: "I would be cautious about this; while algorithms can reduce certain biases, delegating consequential decisions entirely to algorithms raises significant accountability concerns." },
        { q: "What factors most commonly lead to poor decision-making under pressure?", a: "Time constraints, emotional stress, and incomplete information are among the factors that most commonly compromise decision-making under pressure." },
        { q: "Can decision-making be taught, or is it primarily an innate skill?", a: "I would contend that decision-making can certainly be improved through education and experience, even though some individuals may have a natural predisposition towards sound judgement." },
      ],
    },
  },
  9: {
    1: {
      title: "The Philosophy of Progress",
      questions: [
        { q: "Is technological advancement synonymous with genuine human progress?", a: "I would argue that conflating the two is a categorical error; technological sophistication does not inherently correlate with improvements in wellbeing, equity, or the resilience of social institutions." },
        { q: "Can a society be said to be progressing if inequality increases alongside material prosperity?", a: "This raises a fundamental question about what metric of progress we privilege; if we define progress purely in aggregate economic terms, the answer might be yes, but a more holistic account would surely regard rising inequality as a regression in distributive justice." },
        { q: "To what extent is the notion of progress a culturally contingent construct?", a: "Considerably so, I would suggest; what one society regards as progress, say, industrialisation, another might interpret as environmental degradation or the erosion of traditional social structures, so the concept resists any universally agreed definition." },
        { q: "Should societies prioritise measurable outcomes, such as GDP, or less quantifiable values like wellbeing, when assessing progress?", a: "I would contend that an overreliance on quantifiable metrics like GDP obscures crucial, harder-to-measure dimensions of human flourishing, and that a more balanced framework should incorporate wellbeing indices alongside conventional economic data." },
        { q: "Is it possible for scientific progress to outpace a society's ethical or institutional capacity to manage it responsibly?", a: "Undoubtedly; the current discourse surrounding artificial intelligence exemplifies this precisely, where technical capability has arguably outstripped the regulatory and ethical frameworks required to govern its deployment responsibly." },
        { q: "How might future generations judge the notion of progress that dominates contemporary discourse?", a: "It is entirely plausible that future generations will view certain present-day conceptions of progress, particularly those premised on unlimited economic growth, as fundamentally shortsighted, given the ecological constraints we are only beginning to reckon with." },
        { q: "Does the pursuit of progress necessarily entail the abandonment of prior traditions or ways of life?", a: "Not necessarily, though there is often a tension between innovation and continuity; the most resilient societies, I would suggest, are those that manage to integrate progressive change with a considered preservation of valuable traditions." },
        { q: "Is there a risk that the concept of progress is instrumentalised to justify policies that primarily benefit narrow interests?", a: "Absolutely; the rhetoric of progress has historically been, and continues to be, deployed to legitimise policies whose benefits accrue disproportionately to specific economic or political interests, while framing dissent as regressive." },
        { q: "Can regression in one domain, such as environmental sustainability, be justified by advancement in another, such as technology?", a: "I would be sceptical of any such trade-off, since environmental degradation often carries irreversible consequences that no degree of technological advancement can straightforwardly offset or reverse." },
        { q: "What criteria would you propose for a more defensible definition of societal progress?", a: "I would propose a multidimensional criterion encompassing distributive equity, ecological sustainability, institutional accountability, and subjective wellbeing, rather than any single, reductive metric of advancement." },
      ],
    },
    2: {
      title: "Describe a Belief You Once Held but No Longer Agree With",
      questions: [
        { q: "Describe a belief you once held but no longer agree with. You should say: what the belief was, why you held it, what changed your mind, and explain how this has affected your outlook.", a: "I once firmly believed that success was primarily a function of individual effort alone, largely discounting the role of structural circumstance. I held this view partly because of the narratives I was exposed to growing up, which tended to valorise self-made achievement. What ultimately changed my mind was exposure to a broader range of sociological research, along with direct observation of how disparate starting points shape people's opportunities regardless of effort. This shift has made me considerably more circumspect about attributing outcomes solely to personal merit, and has, I think, made me a more empathetic observer of others' circumstances." },
        { q: "Do you think it's common for people to change deeply held beliefs?", a: "I would say it's relatively uncommon for people to revise deeply held beliefs substantially, since doing so often requires confronting uncomfortable cognitive dissonance." },
        { q: "What factors make people resistant to changing their beliefs?", a: "Social identity, prior investment in a belief, and the psychological discomfort of admitting error are among the factors that make belief revision particularly difficult." },
        { q: "Is it a sign of weakness or strength to change one's mind?", a: "I would firmly characterise it as a sign of intellectual strength, since it demonstrates a willingness to prioritise accuracy over the comfort of consistency." },
        { q: "How important is exposure to differing viewpoints in shaping a person's beliefs?", a: "I consider it fundamentally important, since insulated exposure to only one perspective tends to entrench existing beliefs rather than subject them to meaningful scrutiny." },
      ],
    },
    3: {
      title: "Belief, Certainty, and Intellectual Change",
      questions: [
        { q: "Why do some people cling to beliefs even when presented with strong contradictory evidence?", a: "This phenomenon, often attributed to motivated reasoning, arises because abandoning a belief can threaten a person's broader identity or social affiliations, not merely their factual understanding." },
        { q: "Does education make people more open to changing their beliefs, or simply more skilled at defending them?", a: "I suspect it can do both, depending on the pedagogical approach; education that rewards critical enquiry fosters openness, whereas education that merely transmits conclusions can entrench defensiveness." },
        { q: "Is absolute certainty ever justified in complex social or political matters?", a: "I would argue that absolute certainty is rarely justified in such domains, given the inherent complexity and contested values involved, though a reasonable degree of confidence is certainly attainable." },
        { q: "How does social media influence the likelihood of belief revision?", a: "Social media, through algorithmic curation, tends to entrench existing beliefs by limiting exposure to genuinely challenging perspectives, thereby making belief revision considerably less likely." },
        { q: "What responsibility do public institutions have in fostering a culture that values intellectual humility?", a: "I would contend that public institutions, particularly educational ones, bear substantial responsibility for cultivating intellectual humility, since the alternative risks a citizenry more susceptible to polarisation and misinformation." },
      ],
    },
  },
};

/* ---------------------------------------------------------
   YORDAMCHI KICHIK KOMPONENTLAR (GSAP Effects bilan boyitilgan)
--------------------------------------------------------- */

function BackButton({ onClick }) {
  const { t } = useTranslation();
  const btnRef = useRef(null);

  const handleMouseEnter = () => {
    if (gsap.effects.pulse) {
      gsap.effects.pulse(btnRef.current, { scale: 1.05, duration: 0.3 });
    }
  };

  const handleMouseLeave = () => {
    if (gsap.effects.pulse) {
      gsap.effects.pulse(btnRef.current, { scale: 1, duration: 0.3 });
    }
  };

  return (
    <button
      ref={btnRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="group mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-white/70 px-5 py-2 text-sm font-semibold text-red-600 shadow-lg shadow-red-500/5 backdrop-blur-xl transition-all hover:bg-red-600 hover:text-white dark:border-red-500/30 dark:bg-slate-900/60 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-slate-950"
    >
      <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
      <span>{t("ieltsEngine.backBtn", "Orqaga").replace("← ", "")}</span>
    </button>
  );
}

function Shell({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && gsap.effects.fadeIn) {
      gsap.effects.fadeIn(containerRef.current, { duration: 0.8, y: 20 });
    }
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen w-full overflow-hidden px-4 py-12 text-slate-100 selection:bg-red-500 selection:text-white">
      {/* Zamonaviy Neon Glow Orbs — boshqa bo'limlar bilan uyg'un palitra */}
      <div className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-purple-500/15 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-indigo-500/10 blur-[130px]" />

      {/* Nozik nuqtali grid naqsh — boshqa sahifalar bilan bir xil detal */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(148,163,184,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-3xl">{children}</div>
    </div>
  );
}

function Header({ title, subtitle }) {
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current && gsap.effects.fadeIn) {
      gsap.effects.fadeIn(headerRef.current, { duration: 0.6, y: -10 });
    }
  }, [title]);

  return (
    <div ref={headerRef} className="mb-8 text-center">
      <h1 className="bg-gradient-to-r from-white via-red-200 to-purple-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm text-slate-400 sm:text-base">{subtitle}</p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   ASOSIY ILOVA (GSAP Effects bilan boyitilgan)
--------------------------------------------------------- */

export default function IeltsPracticeApp() {
  const { t } = useTranslation();
  const [screen, setScreen] = useState("home");
  const [level, setLevel] = useState(null);
  const [part, setPart] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Yangi qo'shilgan state'lar (Start, Timer, Toast)
  const [testStarted, setTestStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minut = 1200 soniya
  const [toastMessage, setToastMessage] = useState(null);

  const heroRef = useRef(null);

  // Taymer logikasi
  useEffect(() => {
    let timer;
    if (testStarted && !submitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setSubmitted(true);
            setToastMessage(t("ieltsEngine.timeUpToast", "Vaqt tugadi!"));
            setTimeout(() => setToastMessage(null), 4000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testStarted, submitted, timeLeft]);

  // GSAP Effects ni ro'yxatdan o'tkazish
  useEffect(() => {
    if (!gsap.effects.fadeIn) {
      gsap.registerEffect({
        name: "fadeIn",
        effect: (targets, config) => {
          return gsap.from(targets, {
            duration: config.duration || 0.6,
            opacity: 0,
            y: config.y || 15,
            ease: "power3.out",
          });
        },
        defaults: { duration: 0.6 },
      });
    }

    if (!gsap.effects.pulse) {
      gsap.registerEffect({
        name: "pulse",
        effect: (targets, config) => {
          return gsap.to(targets, {
            scale: config.scale || 1.03,
            duration: config.duration || 0.3,
            ease: "power2.out",
          });
        },
        defaults: { duration: 0.3, scale: 1.03 },
      });
    }

    if (heroRef.current && gsap.effects.fadeIn) {
      gsap.effects.fadeIn(heroRef.current, { duration: 0.9, y: 30 });
    }
  }, [screen]);

  const resetTest = () => {
    setAnswers({});
    setSubmitted(false);
    setTestStarted(false);
    setTimeLeft(1200);
    setToastMessage(null);
  };

  const goto = (s) => {
    resetTest();
    setScreen(s);
  };

  const handleCardHover = (e, enter) => {
    if (gsap.effects.pulse) {
      gsap.effects.pulse(e.currentTarget, { scale: enter ? 1.02 : 1 });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  /* ---------------- HOME ---------------- */
  if (screen === "home") {
    return (
      <div className="pt-12">
        <Shell>
          <div ref={heroRef} className="flex min-h-[75vh] flex-col items-center justify-center text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-red-500/20 to-purple-500/20 border border-red-500/30 shadow-2xl shadow-red-500/10 backdrop-blur-xl">
              <FaBookOpen className="h-9 w-9 text-red-300" />
            </div>
            <h1 className="mb-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              {t("ieltsEngine.heroTitle", "Reading & Speaking Amaliyoti")}
            </h1>
            <p className="mb-10 max-w-md text-base text-slate-400 sm:text-lg">
              {t("ieltsEngine.heroSub", "Reading, Grammar va Speaking bo'yicha darajangizga mos testlarni yeching. Har bir daraja va har bir qism (Part) — o'zining noyob mavzusi.")}
            </p>
            <button
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              onClick={() => goto("levels")}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-rose-500 to-red-600 bg-[length:200%_auto] px-10 py-5 text-lg font-bold text-white shadow-xl shadow-red-500/25 transition-all duration-500 hover:bg-[position:right_center]"
            >
              <span className="relative z-10">{t("ieltsEngine.startBtn", "Test yechish")}</span>
            </button>
          </div>
        </Shell>
      </div>
    );
  }

  /* ---------------- LEVELS ---------------- */
  if (screen === "levels") {
    return (
      <div className="pt-6">
        <Shell>
          <BackButton onClick={() => goto("home")} />
          <Header title={t("ieltsEngine.levelSelectionTitle", "Darajani tanlang")} subtitle={t("ieltsEngine.levelChoice", "Qaysi IELTS bandiga mos test yechmoqchisiz?")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {LEVELS.map((l) => (
              <button
                key={l}
                onMouseEnter={(e) => handleCardHover(e, true)}
                onMouseLeave={(e) => handleCardHover(e, false)}
                onClick={() => {
                  setLevel(l);
                  goto("skills");
                }}
                className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-left shadow-xl backdrop-blur-xl transition-all hover:border-sky-500/50 hover:bg-slate-900/90 hover:shadow-sky-500/10"
              >
                <div className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  {t("ieltsEngine.bandLevel", "IELTS")}
                </div>
                <div className="mt-1 text-3xl font-black text-white transition-colors group-hover:text-sky-300">
                  {l}.0
                </div>
              </button>
            ))}
          </div>
        </Shell>
      </div>
    );
  }

  /* ---------------- SKILLS ---------------- */
  if (screen === "skills") {
    const options = [
      { key: "reading", icon: <FaBookOpen className="h-5 w-5 text-sky-400" />, label: t("ieltsEngine.readingSkill", "Reading"), to: "readingParts", desc: t("ieltsEngine.readingMenuDesc", "Matnni o'qing va savollarga javob bering") },
      { key: "speaking", icon: <FaCommentDots className="h-5 w-5 text-emerald-400" />, label: t("ieltsEngine.speakingSkill", "Speaking"), to: "speakingParts", desc: t("ieltsEngine.speakingMenuDesc", "Ideal og'zaki javoblar namunasi") },
      { key: "grammar", icon: <FaPenNib className="h-5 w-5 text-indigo-400" />, label: t("ieltsEngine.grammarSkill", "Grammar"), to: "grammarTest", meta: t("ieltsEngine.grammarDesc", "10 ta Band {level}.0 savollari").replace("{level}", level), desc: t("ieltsEngine.grammarMenuDesc", "Grammatik qoidalar bo'yicha testlar") },
    ];
    return (
      <div className="pt-6">
        <Shell>
          <BackButton onClick={() => goto("levels")} />
          <Header title={`IELTS ${level}.0`} subtitle={t("ieltsEngine.skillSelectionTitle", "Bo'limni tanlang")} />
          <div className="grid grid-cols-1 gap-4">
            {options.map((o) => (
              <button
                key={o.key}
                onMouseEnter={(e) => handleCardHover(e, true)}
                onMouseLeave={(e) => handleCardHover(e, false)}
                onClick={() => goto(o.to)}
                className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-left shadow-xl backdrop-blur-xl transition-all hover:border-indigo-500/50 hover:bg-slate-900/90 hover:shadow-indigo-500/10"
              >
                <div className="flex items-center gap-3">
                  {o.icon}
                  <div className="text-xl font-bold text-white transition-colors group-hover:text-indigo-300">{o.label}</div>
                </div>
                <div className="mt-1 text-sm text-slate-400">{o.desc}</div>
                {o.meta && <div className="mt-2 text-xs font-semibold text-indigo-400">{o.meta}</div>}
              </button>
            ))}
          </div>
        </Shell>
      </div>
    );
  }

  /* ---------------- READING: PARTLARNI TANLASH ---------------- */
  if (screen === "readingParts") {
    return (
      <div className="pt-6">
        <Shell>
          <BackButton onClick={() => goto("skills")} />
          <Header title={`${t("ieltsEngine.readingSkill", "Reading")} — IELTS ${level}.0`} subtitle={t("ieltsEngine.readingDesc", "Qaysi qismni (Part) yechmoqchisiz?")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {PARTS.map((p) => (
              <button
                key={p}
                onMouseEnter={(e) => handleCardHover(e, true)}
                onMouseLeave={(e) => handleCardHover(e, false)}
                onClick={() => {
                  setPart(p);
                  goto("readingTest");
                }}
                className="group rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-center shadow-xl backdrop-blur-xl transition-all hover:border-sky-500/50 hover:bg-slate-900/90"
              >
                <div className="text-xl font-black text-white group-hover:text-sky-300">Part {p}</div>
                <div className="mt-2 text-xs font-medium text-slate-400">{readingByLevel[level]?.[p]?.title}</div>
              </button>
            ))}
          </div>
        </Shell>
      </div>
    );
  }

  /* ---------------- SPEAKING: PARTLARNI TANLASH ---------------- */
  if (screen === "speakingParts") {
    return (
      <div className="pt-6">
        <Shell>
          <BackButton onClick={() => goto("skills")} />
          <Header title={`${t("ieltsEngine.speakingSkill", "Speaking")} — IELTS ${level}.0`} subtitle={t("ieltsEngine.speakingDesc", "Qaysi qismni (Part) ko'rmoqchisiz?")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {PARTS.map((p) => (
              <button
                key={p}
                onMouseEnter={(e) => handleCardHover(e, true)}
                onMouseLeave={(e) => handleCardHover(e, false)}
                onClick={() => {
                  setPart(p);
                  goto("speakingContent");
                }}
                className="group rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-center shadow-xl backdrop-blur-xl transition-all hover:border-emerald-500/50 hover:bg-slate-900/90"
              >
                <div className="text-xl font-black text-white group-hover:text-emerald-300">Part {p}</div>
                <div className="mt-2 text-xs font-medium text-slate-400">{speakingByLevel[level]?.[p]?.title}</div>
              </button>
            ))}
          </div>
        </Shell>
      </div>
    );
  }

  /* ---------------- READING: TEST + RESULTS ---------------- */
  if (screen === "readingTest") {
    const topic = readingByLevel[level][part];
    const questions = topic.questions;

    let score = 0;
    if (submitted) {
      questions.forEach((q, i) => {
        if (answers[i] === q.answer) score += 1;
      });
    }

    return (
      <div className="pt-6">
        <Shell>
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-rose-600 px-6 py-3 text-sm font-bold text-white shadow-2xl animate-bounce">
              {toastMessage}
            </div>
          )}

          <BackButton onClick={() => goto("readingParts")} />
          <Header title={topic.title} subtitle={`${t("ieltsEngine.readingSkill", "Reading")} Part ${part} — IELTS ${level}.0`} />

          {/* Start tugmasi va Taymer paneli */}
          {!testStarted ? (
            <div className="mb-8 rounded-3xl border border-red-500/30 bg-slate-900/80 p-8 text-center shadow-xl backdrop-blur-xl">
              <h2 className="mb-4 text-2xl font-bold text-white">{t("ieltsEngine.readyTitle", "Testni boshlashga tayyormisiz?")}</h2>
              <p className="mb-6 text-sm text-slate-400">{t("ieltsEngine.readyDesc", "Start tugmasi bosilgach, 20 daqiqalik taymer ishga tushadi.")}</p>
              <button
                onClick={() => setTestStarted(true)}
                className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 px-8 py-4 font-bold text-white shadow-xl shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
              >
                {t("ieltsEngine.startTestBtn", "Start")}
              </button>
            </div>
          ) : (
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-4 backdrop-blur-xl">
              <span className="text-sm font-semibold text-slate-300">{t("ieltsEngine.timeLeftLabel", "Qolgan vaqt:")}</span>
              <span className={`text-lg font-black ${timeLeft < 60 ? "text-rose-500 animate-pulse" : "text-sky-400"}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          )}

          {testStarted && (
            <>
              <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-base leading-relaxed text-slate-300 shadow-xl backdrop-blur-xl">
                {topic.passage}
              </div>

              {submitted && (
                <div className="mb-8 rounded-3xl border border-emerald-500/30 bg-emerald-950/40 p-6 text-center shadow-xl backdrop-blur-xl">
                  <div className="text-sm font-semibold uppercase tracking-wider text-emerald-400">{t("ieltsEngine.resultLabel", "Natijangiz")}</div>
                  <div className="mt-1 text-4xl font-black text-emerald-300">
                    {score} / {questions.length}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {questions.map((q, i) => {
                  const opts = q.type === "tfng" ? TFNG : q.options;
                  const isCorrect = submitted && answers[i] === q.answer;
                  const isWrong = submitted && answers[i] && answers[i] !== q.answer;
                  return (
                    <div
                      key={i}
                      className={`rounded-3xl border bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl transition-colors ${
                        submitted
                          ? isCorrect
                            ? "border-emerald-500/50 bg-emerald-950/20"
                            : isWrong
                              ? "border-rose-500/50 bg-rose-950/20"
                              : "border-slate-800"
                          : "border-slate-800"
                      }`}
                    >
                      <div className="mb-4 text-sm font-bold text-white">
                        {i + 1}. {q.text}
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {opts.map((opt) => {
                          const selected = answers[i] === opt;
                          return (
                            <button
                              key={opt}
                              disabled={submitted || timeLeft === 0}
                              onClick={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                              className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
                                selected
                                  ? submitted
                                    ? opt === q.answer
                                      ? "border-emerald-500 bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                                      : "border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                                    : "border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/20"
                                  : "border-slate-800 bg-slate-800/50 text-slate-300 hover:border-slate-700 hover:bg-slate-800"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {submitted && isWrong && (
                        <div className="mt-3 text-xs font-medium text-rose-400">
                          {t("ieltsEngine.correctAnswerLabel", "To'g'ri javob")}: {q.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-center pb-12">
                {!submitted ? (
                  <button
                    onClick={() => {
                      setSubmitted(true);
                      setToastMessage(t("ieltsEngine.resultsReadyToast", "Natijalar chiqdi!"));
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 px-10 py-4 font-bold text-white shadow-xl shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    {t("ieltsEngine.viewResultBtn", "Natijani ko'rish")}
                  </button>
                ) : (
                  <button
                    onClick={() => resetTest()}
                    className="rounded-2xl bg-slate-800 px-10 py-4 font-bold text-white shadow-xl transition-all hover:bg-slate-700 active:scale-95"
                  >
                    {t("ieltsEngine.resetBtn", "Qayta yechish")}
                  </button>
                )}
              </div>
            </>
          )}
        </Shell>
      </div>
    );
  }

  /* ---------------- GRAMMAR  ---------------- */
  if (screen === "grammarTest") {
    const questions = grammarBank[level];
    let score = 0;
    if (submitted) {
      questions.forEach((q, i) => {
        if (answers[i] === q.answer) score += 1;
      });
    }
    return (
      <div className="pt-6">
        <Shell>
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-rose-600 px-6 py-3 text-sm font-bold text-white shadow-2xl animate-bounce">
              {toastMessage}
            </div>
          )}

          <BackButton onClick={() => goto("skills")} />
          <Header title={`${t("ieltsEngine.grammarSkill", "Grammar")} — IELTS ${level}.0`} subtitle={t("ieltsEngine.grammarDesc", "10 ta Band {level}.0 savollari").replace("{level}", level)} />

          {/* Start tugmasi va Taymer paneli */}
          {!testStarted ? (
            <div className="mb-8 rounded-3xl border border-red-500/30 bg-slate-900/80 p-8 text-center shadow-xl backdrop-blur-xl">
              <h2 className="mb-4 text-2xl font-bold text-white">{t("ieltsEngine.readyTitle", "Testni boshlashga tayyormisiz?")}</h2>
              <p className="mb-6 text-sm text-slate-400">{t("ieltsEngine.readyDesc", "Start tugmasi bosilgach, 20 daqiqalik taymer ishga tushadi.")}</p>
              <button
                onClick={() => setTestStarted(true)}
                className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 px-8 py-4 font-bold text-white shadow-xl shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
              >
                {t("ieltsEngine.startTestBtn", "Start")}
              </button>
            </div>
          ) : (
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-4 backdrop-blur-xl">
              <span className="text-sm font-semibold text-slate-300">{t("ieltsEngine.timeLeftLabel", "Qolgan vaqt:")}</span>
              <span className={`text-lg font-black ${timeLeft < 60 ? "text-rose-500 animate-pulse" : "text-sky-400"}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          )}

          {testStarted && (
            <>
              {submitted && (
                <div className="mb-8 rounded-3xl border border-emerald-500/30 bg-emerald-950/40 p-6 text-center shadow-xl backdrop-blur-xl">
                  <div className="text-sm font-semibold uppercase tracking-wider text-emerald-400">{t("ieltsEngine.resultLabel", "Natijangiz")}</div>
                  <div className="mt-1 text-4xl font-black text-emerald-300">
                    {score} / {questions.length}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {questions.map((q, i) => {
                  const isCorrect = submitted && answers[i] === q.answer;
                  const isWrong = submitted && answers[i] && answers[i] !== q.answer;
                  return (
                    <div
                      key={i}
                      className={`rounded-3xl border bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl transition-colors ${
                        submitted
                          ? isCorrect
                            ? "border-emerald-500/50 bg-emerald-950/20"
                            : isWrong
                              ? "border-rose-500/50 bg-rose-950/20"
                              : "border-slate-800"
                          : "border-slate-800"
                      }`}
                    >
                      <div className="mb-4 text-sm font-bold text-white">
                        {i + 1}. {q.text}
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {q.options.map((opt) => {
                          const selected = answers[i] === opt;
                          return (
                            <button
                              key={opt}
                              disabled={submitted || timeLeft === 0}
                              onClick={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                              className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
                                selected
                                  ? submitted
                                    ? opt === q.answer
                                      ? "border-emerald-500 bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                                      : "border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                                    : "border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/20"
                                  : "border-slate-800 bg-slate-800/50 text-slate-300 hover:border-slate-700 hover:bg-slate-800"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {submitted && isWrong && (
                        <div className="mt-3 text-xs font-medium text-rose-400">
                          {t("ieltsEngine.correctAnswerLabel", "To'g'ri javob")}: {q.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-center pb-12">
                {!submitted ? (
                  <button
                    onClick={() => {
                      setSubmitted(true);
                      setToastMessage(t("ieltsEngine.resultsReadyToast", "Natijalar chiqdi!"));
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 px-10 py-4 font-bold text-white shadow-xl shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    {t("ieltsEngine.viewResultBtn", "Natijani ko'rish")}
                  </button>
                ) : (
                  <button
                    onClick={() => resetTest()}
                    className="rounded-2xl bg-slate-800 px-10 py-4 font-bold text-white shadow-xl transition-all hover:bg-slate-700 active:scale-95"
                  >
                    {t("ieltsEngine.resetBtn", "Qayta yechish")}
                  </button>
                )}
              </div>
            </>
          )}
        </Shell>
      </div>
    );
  }

  /* ---------------- SPEAKING: CONTENT ---------------- */
  if (screen === "speakingContent") {
    const topic = speakingByLevel[level][part];
    return (
      <div className="pt-6">
        <Shell>
          <BackButton onClick={() => goto("speakingParts")} />
          <Header title={topic.title} subtitle={`${t("ieltsEngine.speakingSkill", "Speaking")} Part ${part} — IELTS ${level}.0 ${t("ieltsEngine.speakingDesc", "uchun ideal javoblar")}`} />
          <div className="space-y-6 pb-12">
            {topic.questions.map((item, i) => (
              <div key={i} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
                <div className="mb-3 text-base font-bold text-white">
                  {i + 1}. {item.q}
                </div>
                <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-4 text-sm leading-relaxed text-slate-300">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-amber-400">
                    {t("ieltsEngine.idealAnswerLabel", "Ideal javob")}
                  </span>
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </Shell>
      </div>
    );
  }

  return null;
}