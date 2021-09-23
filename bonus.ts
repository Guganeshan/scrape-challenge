import * as puppeteer from "./node_modules/puppeteer";
import * as sanitizeHtml from "./node_modules/sanitize-html";
import * as fs from "fs";

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

    const description = descriptionElement.textContent;
    const title = descriptionElement.previousElementSibling.textContent;
    const price = document.querySelector(
      `${parentArticleSelector} div.price`).textContent;
    const address = document.querySelector(
      `${parentArticleSelector} div.address`).textContent;

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
