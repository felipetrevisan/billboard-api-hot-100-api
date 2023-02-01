"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const chrome_aws_lambda_1 = __importDefault(require("chrome-aws-lambda"));
const express_1 = require("express");
const puppeteer_1 = __importDefault(require("puppeteer"));
const router = (0, express_1.Router)();
exports.router = router;
router.get('/', async function (req, res) {
    const { date } = req.query;
    if (!date) {
        return res.status(400).json({ data: [], date: '' });
    }
    const options = process.env.NODE_ENV === 'production'
        ? {
            args: chrome_aws_lambda_1.default.args,
            executablePath: await chrome_aws_lambda_1.default.executablePath,
            headless: chrome_aws_lambda_1.default.headless,
        }
        : {};
    const browser = await puppeteer_1.default.launch(options);
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(`${process.env.BILLBOARD_API_URL}/${date}`);
    await page.waitForSelector('.chart-results-list');
    const resultsSelector = '.o-chart-results-list-row-container';
    const results = await page.evaluate((resultsSelector) => {
        return [...document.querySelectorAll(resultsSelector)].map(item => {
            const rank = item
                .querySelector('ul > li:nth-child(1) > span')
                ?.textContent?.trim();
            const song = item
                .querySelector('ul > li:nth-child(4) > ul > li:nth-child(1) > #title-of-a-story')
                ?.textContent?.trim();
            const artist = item
                .querySelector('ul > li:nth-child(4) > ul > li:nth-child(1) > span')
                ?.textContent?.trim();
            const status = item
                .querySelector('ul > li:nth-child(3) > span')
                ?.textContent?.trim() ?? '';
            const lastWeek = item
                .querySelector('ul > li:nth-child(4) > ul > li:nth-child(4) > span')
                ?.textContent?.trim();
            const peakPos = item
                .querySelector('ul > li:nth-child(4) > ul > li:nth-child(5) > span')
                ?.textContent?.trim();
            const wksOnChart = item
                .querySelector('ul > li:nth-child(4) > ul > li:nth-child(6) > span')
                ?.textContent?.trim();
            return {
                rank,
                song,
                artist,
                status,
                lastWeek,
                peakPos,
                wksOnChart,
            };
        });
    }, resultsSelector);
    await browser.close();
    return res.status(200).json({ data: results, date: date });
});
