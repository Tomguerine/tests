const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

(async () => {
  // Lancement de Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Navigation vers la page cible
  await page.goto('https://www.cgpfrance.com/recherche?name=Paris%2C%20France&lat=48.856614&lng=2.3522219&range=4&customerType=23&commission=&officeStaff=&gender=&clientsActivesThreshold=400&language=');
  
  // Récupération des URL
  const urls = await page.evaluate(() => {
    const urls = [];
    const urlElements = document.querySelectorAll('a'); // Modifier sélecteur selon votre besoin
    urlElements.forEach((element) => {
      urls.push(element.href);
    });
    return urls;
  });
  
  // Écriture des URL dans un fichier CSV
  const csvWriter = createCsvWriter({
    path: 'urls.csv', // Nom du fichier CSV
    header: [{id: 'url', title: 'URL'}] // Entête du fichier CSV
  });
  
  const records = urls.map((url) => ({url})); // Mapping des URL dans le format attendu par le module csv-writer
  
  await csvWriter.writeRecords(records); // Écriture des enregistrements dans le fichier CSV
  
  console.log('Les URL ont été écrites dans le fichier urls.csv');
  
  // Fermeture du navigateur
  await browser.close();

  // Lecture du contenu du fichier CSV
  const csvContent = fs.readFileSync('urls.csv', 'utf-8');
  
  // Nettoyage du contenu pour ne garder que les URL commençant par "https://www.cgpfrance.com/cabinet/"
  const cleanedCsvContent = csvContent
    .split('\n')
    .filter(line => line.startsWith('https://www.cgpfrance.com/cabinet/'))
    .join('\n');
  
  // Écriture du contenu nettoyé dans le fichier CSV
  fs.writeFileSync('urls.csv', cleanedCsvContent, 'utf-8');
  
  console.log('Le fichier urls.csv a été nettoyé pour ne garder que les URL commençant par "https://www.cgpfrance.com/cabinet/".');
})();
