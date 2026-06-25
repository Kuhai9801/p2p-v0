import { Page, Locator, expect } from "@playwright/test";

/**
 * AdsPage - Handles all interactions on the My Ads page (`/ads`).
 *
 * @example
 * ```typescript
 * const adsPage = new AdsPage(page);
 * await adsPage.gotoAdsPage();
 * await adsPage.verifyAdsPageLoaded();
 * ```
 */
export class AdsPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // ============================================
    // LOCATORS
    // ============================================

    /** "Create ad" button */
    get createAdButton(): Locator {
        return this.page.getByTestId("ads-btn-create");
    }

    /** List of my ad cards */
    get adCards(): Locator {
        return this.page.getByTestId("my-ad-card");
    }

    /** Empty state when no ads exist */
    get emptyState(): Locator {
        return this.page.getByTestId("ads-empty-state");
    }

    /** Buy ads tab */
    get buyAdsTab(): Locator {
        return this.page.getByTestId("ads-tab-buy");
    }

    /** Sell ads tab */
    get sellAdsTab(): Locator {
        return this.page.getByTestId("ads-tab-sell");
    }

    // ============================================
    // ACTIONS
    // ============================================

    /**
     * Navigate directly to the My Ads page.
     */
    async gotoAdsPage(): Promise<void> {
        await this.page.goto("/ads");
        await this.page.waitForLoadState("domcontentloaded");
    }

    /**
     * Click the Create Ad button.
     */
    async clickCreateAd(): Promise<void> {
        await expect(this.createAdButton, "Create ad button should be visible").toBeVisible();
        await this.createAdButton.click();
        await this.page.waitForURL(/\/ads\/create/);
    }

    // ============================================
    // VERIFICATIONS
    // ============================================

    /**
     * Assert the My Ads page has loaded.
     */
    async verifyAdsPageLoaded(): Promise<void> {
        await expect(this.createAdButton, "Create ad button should be visible on My Ads page").toBeVisible();
    }
}
