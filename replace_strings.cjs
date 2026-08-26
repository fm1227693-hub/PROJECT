const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');

const replaceInFile = (file, replacements) => {
  const filePath = path.join(componentsDir, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replace] of Object.entries(replacements)) {
    content = content.split(search).join(replace);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
};

// Game4 (Sentence Builder)
replaceInFile('Game4.jsx', {
  '"Hamma so\'zlarni ishlating!"': 't("gamesPage.games.sentenceBuilder.errorAllWords")',
  '"To\'g\'ri topdingiz!"': 't("gamesPage.games.sentenceBuilder.correct")',
  '"Ketma-ketlik noto\'g\'ri, qaytadan urinib ko\'ring."': 't("gamesPage.games.sentenceBuilder.errorOrder")',
  '>Sentence Builder<': '>{t("gamesPage.games.sentenceBuilder.title")}<',
  '>Gap Tuzish<': '>{t("gamesPage.games.sentenceBuilder.gameTitle")}<',
  'So\'zlarni to\'g\'ri ketma-ketlikda joylashtirib mantiqiy gap tuzing.': '{t("gamesPage.games.sentenceBuilder.gameDesc")}',
  'Ball: {score}': '{t("gamesPage.common.score")} {score}',
  'So\'zlarni bu yerga yig\'ing...': '{t("gamesPage.games.sentenceBuilder.placeholder")}',
  'Keyingisi <FaCheckCircle />': '{t("gamesPage.common.next")} <FaCheckCircle />',
  '>Tekshirish<': '>{t("gamesPage.common.check")}<',
  '>Ajoyib natija!<': '>{t("gamesPage.common.greatResult")}<',
  'Siz barcha gaplarni to\'g\'ri tuzdingiz. Jami ball: {score}': '{t("gamesPage.common.totalScore")} {score}',
  'Qaytadan o\'ynash': '{t("gamesPage.common.playAgain")}'
});

// Game5 (Missing Letters)
replaceInFile('Game5.jsx', {
  '"To\'g\'ri topdingiz!"': 't("gamesPage.games.missingLetters.correct")',
  '"Xato, qaytadan urinib ko\'ring."': 't("gamesPage.games.missingLetters.incorrect")',
  '>Missing Letters<': '>{t("gamesPage.games.missingLetters.title")}<',
  '>Harflarni Topish<': '>{t("gamesPage.games.missingLetters.gameTitle")}<',
  'So\'zdagi tushib qolgan harflarni topib, to\'liq so\'zni yozing.': '{t("gamesPage.games.missingLetters.gameDesc")}',
  'Ball: {score}': '{t("gamesPage.common.score")} {score}',
  'Tushib qolgan harflar': '{t("gamesPage.games.missingLetters.label")}',
  '"To\'liq so\'zni yozing..."': 't("gamesPage.games.missingLetters.placeholder")',
  'Keyingisi <FaCheckCircle />': '{t("gamesPage.common.next")} <FaCheckCircle />',
  '>Tekshirish<': '>{t("gamesPage.common.check")}<',
  '>Ajoyib natija!<': '>{t("gamesPage.common.greatResult")}<',
  'Barcha so\'zlarni topdingiz. Jami ball: {score}': '{t("gamesPage.common.totalScore")} {score}',
  'Qaytadan o\'ynash': '{t("gamesPage.common.playAgain")}'
});

// Game6 (Odd One Out)
replaceInFile('Game6.jsx', {
  '"To\'g\'ri! Ortiqcha so\'z: " + word': 't("gamesPage.games.oddOneOut.correct") + word',
  '"Xato. Ortiqcha so\'z: " + currentItem.odd + " edi."': 't("gamesPage.games.oddOneOut.incorrect") + currentItem.odd',
  '>Odd One Out<': '>{t("gamesPage.games.oddOneOut.title")}<',
  '>Ortiqchasini Toping<': '>{t("gamesPage.games.oddOneOut.gameTitle")}<',
  'Berilgan 4 ta so\'zdan mantiqan guruhga kirmaydigan bittasini tanlang.': '{t("gamesPage.games.oddOneOut.gameDesc")}',
  'Ball: {score}': '{t("gamesPage.common.score")} {score}',
  'Keyingisi <FaCheckCircle />': '{t("gamesPage.common.next")} <FaCheckCircle />',
  '>Ajoyib natija!<': '>{t("gamesPage.common.greatResult")}<',
  '>Jami ball: {score}<': '>{t("gamesPage.common.totalScore")} {score}<',
  'Qaytadan o\'ynash': '{t("gamesPage.common.playAgain")}'
});

// Game7 (Synonym Finder)
replaceInFile('Game7.jsx', {
  '"To\'g\'ri topdingiz!"': 't("gamesPage.games.synonymFinder.correct")',
  '"Xato. To\'g\'ri javob: " + currentItem.correct': 't("gamesPage.games.synonymFinder.incorrect") + currentItem.correct',
  '>Synonym Finder<': '>{t("gamesPage.games.synonymFinder.title")}<',
  '>Sinonimni Toping<': '>{t("gamesPage.games.synonymFinder.gameTitle")}<',
  'Berilgan so\'zning ma\'nodoshini (sinonimini) toping.': '{t("gamesPage.games.synonymFinder.gameDesc")}',
  'Ball: {score}': '{t("gamesPage.common.score")} {score}',
  'Shu so\'zga sinonim toping:': '{t("gamesPage.games.synonymFinder.label")}',
  'Keyingisi <FaCheckCircle />': '{t("gamesPage.common.next")} <FaCheckCircle />',
  '>Ajoyib natija!<': '>{t("gamesPage.common.greatResult")}<',
  '>Jami ball: {score}<': '>{t("gamesPage.common.totalScore")} {score}<',
  'Qaytadan o\'ynash': '{t("gamesPage.common.playAgain")}'
});
