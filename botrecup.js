const puppeteer = require('puppeteer');

async function scrape() {
    // Lancez le navigateur et ouvrez un nouvel onglet
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
  
    // Accédez à la page cible
    await page.goto('https://www.cgpfrance.com');
  
    // Attendez que l'élément de recherche soit chargé
    await page.waitForSelector('input.city-autocomplete.pac-target-input', {
      visible: true,
    });
  
    // Entrez "Paris" dans le champ de recherche
    await page.type('input.city-autocomplete.pac-target-input', 'Paris');
  
    // Vous pouvez ajouter des instructions pour soumettre le formulaire ou effectuer d'autres actions si nécessaire
  
    // Fermez le navigateur après un certain temps (par exemple, 10 secondes)
    setTimeout(async () => {
      await browser.close();
    }, 10000);
  }
  
  // Appeler la fonction scrape
  scrape();
  