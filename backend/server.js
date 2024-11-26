const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/generate-links', async (req, res) => {
  const { login, password, folderLink } = req.body;

  if (!login || !password || !folderLink) {
    return res.status(400).json({ message: 'Brak wymaganych danych' });
  }

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://chomikuj.pl/', { waitUntil: 'load' });

    // Logowanie
    await page.type('#login', login);
    await page.type('#password', password);
    await Promise.all([
      page.click('#loginBtn'),
      page.waitForNavigation(),
    ]);

    // Przejście do folderu
    await page.goto(folderLink, { waitUntil: 'load' });

    // Pobranie linków
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.fileItem .fileLink'))
        .map((el) => el.href);
    });

    await browser.close();
    res.json({ links });
  } catch (err) {
    res.status(500).json({ message: 'Błąd podczas generowania linków', error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend działa na porcie ${PORT}`));
