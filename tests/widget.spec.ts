import { test, expect } from '@playwright/test';
import {WidgetPage} from "./widget.page";

test.describe('Uchi.ru widget ', () => {
  let widgetPage: WidgetPage;

  test.beforeEach(async ({page, context, baseURL}) => {
    widgetPage = new WidgetPage(page);

    // main page is under A/B test, the widget exists only in group "a"
    await context.addCookies([{name: 'ab_mainpage_redesign', value: 'a', url: baseURL!}]);

    // open uchi.ru main page
    await page.goto('/');

    // close cookies popup
    await page.locator('._UCHI_COOKIE__wrap.show ._UCHI_COOKIE__button').click();
  });

  test('opens', async ({page}) => {
    await expect(widgetPage.getWidgetBody()).toBeHidden();

    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible()
  });

  test('has correct title', async ({ page }) => {
    await widgetPage.openWidget();

    await widgetPage.getPopularArticles().first().click();

    await widgetPage.clickWriteToUs();

    await expect(widgetPage.getTitle()).toHaveText('Связь с поддержкой');
  });

  test('closes', async ({page}) => {
    await widgetPage.openWidget();
    await expect(widgetPage.getWidgetBody()).toBeVisible();

    await widgetPage.closeWidget();

    await expect(widgetPage.getWidgetBody()).toBeHidden();
  });
});
