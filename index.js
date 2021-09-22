const puppeteer = require("puppeteer");
const sanitizeHtml = require("sanitize-html");
const fs = require("fs");

const PAGE_URL =
  "https://www.hansimmo.be/appartement-te-koop-in-borgerhout/10161";

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(PAGE_URL);

  const item = await page.evaluate(() => {
    const parentArticleSelector = "article#detail-description-container";
    const descriptionElement =
      document.querySelector(`${parentArticleSelector} div#description`);

    const description = descriptionElement.innerText;
    const title = descriptionElement.previousElementSibling.innerText;
    const price = document.querySelector(
      `${parentArticleSelector} div.price`).innerText;
    const address = document.querySelector(
      `${parentArticleSelector} div.address`).innerText;

    return {
      description: description,
      title: title,
      price: price,
      address: address,
    };
  });

  browser.close();
  item.description = sanitizeHtml(item.description);

  return item;
};

main().then((data) =>
  fs.writeFileSync("result.json", JSON.stringify(data)));
