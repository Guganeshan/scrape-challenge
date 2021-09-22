const puppeteer = require("puppeteer");

const PAGE_URL =
  "https://www.hansimmo.be/appartement-te-koop-in-borgerhout/10161";

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(PAGE_URL);

  const items = await page.evaluate(() => {
    // write your querySelectors here

    return {
      description: "",
      title: "",
      price: "",
      address: "",
    };
  });

  console.log(items);

  return items;
};

main().then((data) => console.log(data));
