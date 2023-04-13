const puppeteer = require('puppeteer');
const fs = require('fs');

function getRandomTimeout(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Charger le fichier CSV
  const urls = fs.readFileSync('urls.csv', 'utf-8').split('\n').filter(url => url.trim() !== '');

  // Créer le fichier CSV et écrire l'en-tête
  const csvHeader = 'Nom de la boîte;Adresse;Code postal et ville;Email;Téléphone\n';
  fs.writeFileSync('results.csv', csvHeader);

  for (let i = 0; i < urls.length; i++) {
    try {
      const url = urls[i];

      // Naviguer vers l'URL de la fiche
      await page.goto(url, { waitUntil: 'networkidle0' });

      // Cliquer sur le bouton "Afficher les coordonnées"
      const coordButton = await page.$('#btn-show-coordonnees');
      await coordButton.click();

      // Attendre un peu pour laisser la page se charger
      await page.waitForTimeout(getRandomTimeout(3000, 5000));

      // Récupérer les informations
      const companyName = await page.$eval('.profil-name h3', el => el.textContent.trim());
      const companyAddress = await page.$eval('.col-12 > p.detail > span', el => el.textContent.trim());
      const companyCityAndPostalCode = await page.$eval('.col-12 > p.detail > span + br + span', el => el.textContent.trim());
      const companyEmail = await page.$eval('.col-12 > p.detail > a', el => el.textContent.trim());
      
      const companyPhoneElement = await page.$x("//p[contains(text(), 'Téléphone :')]/following-sibling::p");
      const companyPhone = await (await companyPhoneElement[0].getProperty('textContent')).jsonValue();

      // Afficher les informations sur la console
      console.log(`Nom de la boîte : ${companyName}`);
      console.log(`Adresse : ${companyAddress}`);
      console.log(`Code postal et ville : ${companyCityAndPostalCode}`);
      console.log(`Email : ${companyEmail}`);
      console.log(`Téléphone : ${companyPhone.trim()}`);
      console.log('-------------------------------------------');

      // Écrire les informations dans le fichier CSV
      const csvRow = `${companyName};${companyAddress};${companyCityAndPostalCode};${companyEmail};${companyPhone.trim()}\n`;
      fs.appendFileSync('results.csv', csvRow);

    } catch (error) {
        console.error(`Erreur lors de la récupération des informations pour l'URL ${urls[i]} :`, error);
        console.log('-------------------------------------------');
      }
    }

    // Fermeture du navigateur
    await browser.close();
})();
