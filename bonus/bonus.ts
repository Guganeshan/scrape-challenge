import * as puppeteer from "../node_modules/puppeteer";
import * as sanitizeHtml from "../node_modules/sanitize-html";
import * as fs from "fs";

const PAGE_URL =
  "https://www.hansimmo.be/appartement-te-koop-in-borgerhout/10161";

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(PAGE_URL);
  
  // Handle of the main article section where the description,
  // title, price & address exist
  const articleHandle$ = await page.$("article#detail-description-container");

  const item = await articleHandle$.evaluate(article => {
    const descriptionElement = article.querySelector("div#description");
    
    const description = descriptionElement.textContent;
    const title = descriptionElement.previousElementSibling.textContent;
    const price = article.querySelector("div.price").textContent;
    const address = article.querySelector("div.address").textContent;

    return {
      description: description,
      title: title,
      price: price,
      address: address
    };

  }, articleHandle$);

  browser.close();
  item.description = sanitizeHtml(item.description);

  return item;
};

main().then((data) =>
  fs.writeFileSync("result.json", JSON.stringify(data)));
