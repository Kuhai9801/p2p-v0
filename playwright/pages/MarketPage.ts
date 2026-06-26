import { Page, Locator, expect } from "@playwright/test";

/**
 * MarketPage - Handles all interactions on the P2P Markets home page (`/`).
 *
 * @example
 * ```typescript
 * const marketPage = new MarketPage(page);
 * await marketPage.gotoMarketPage();
 * await marketPage.verifyMarketPageLoaded();
 * ```
 */
export class MarketPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private get isMobile(): boolean {
        return (this.page.viewportSize()?.width ?? 1024) < 1024;
    }

    // ============================================
    // LOCATORS
    // ============================================

    /** Buy tab in the market filter */
    get buyTab(): Locator {
        return this.page.getByRole("tablist").getByTestId("markets-tab-buy");
    }

    /** Sell tab in the market filter */
    get sellTab(): Locator {
        return this.page.getByRole("tablist").getByTestId("markets-tab-sell");
    }

    /** Currency filter/selector */
    get currencyFilter(): Locator {
        return this.page.getByTestId("market-filter-currency");
    }

    /** Payment method filter */
    get paymentMethodFilter(): Locator {
        return this.page.getByTestId("market-filter-payment-method");
    }

    /** List of ad cards on the market page */
    get adCards(): Locator {
        return this.page.getByTestId("market-ad-card");
    }

    /** Empty state shown when no ads match the filter */
    get emptyState(): Locator {
        return this.page.getByTestId("market-empty-state");
    }

    /** Navigation link to My Ads */
    get myAdsNavLink(): Locator {
        return this.page.getByTestId("nav-link-ads");
    }

    /** Navigation link to Orders */
    get ordersNavLink(): Locator {
        return this.page.getByTestId("nav-link-orders");
    }

    /** Navigation link to Profile */
    get profileNavLink(): Locator {
        return this.page.getByTestId("nav-link-profile");
    }

    /** Navigation link to Wallet */
    get walletNavLink(): Locator {
        return this.page.getByTestId("nav-link-wallet");
    }

    // ============================================
    // ACTIONS
    // ============================================

    /**
     * Navigate to the P2P market page.
     */
    async gotoMarketPage(): Promise<void> {
        await this.page.goto("/");
        await this.page.waitForLoadState("domcontentloaded");
    }

    /**
     * Click the Buy tab to view buy ads.
     */
    async clickBuyTab(): Promise<void> {
        await expect(this.buyTab, "Buy tab should be visible").toBeVisible();
        await this.buyTab.click();
    }

    /**
     * Click the Sell tab to view sell ads.
     */
    async clickSellTab(): Promise<void> {
        await expect(this.sellTab, "Sell tab should be visible").toBeVisible();
        await this.sellTab.click();
    }

    /**
     * Navigate to My Ads via the nav link.
     */
    async navigateToMyAds(): Promise<void> {
        await this.myAdsNavLink.click();
        await this.page.waitForURL(/\/ads/);
    }

    /**
     * Navigate to Orders via the nav link.
     */
    async navigateToOrders(): Promise<void> {
        await this.ordersNavLink.click();
        await this.page.waitForURL(/\/orders/);
    }

    /**
     * Navigate to Profile via the nav link.
     */
    async navigateToProfile(): Promise<void> {
        await this.profileNavLink.click();
        await this.page.waitForURL(/\/profile/);
    }

    // ============================================
    // VERIFICATIONS
    // ============================================

    /**
     * Assert the market page has loaded with the core elements visible.
     */
    async verifyMarketPageLoaded(): Promise<void> {
        await expect(this.buyTab, "Buy tab should be visible on market page").toBeVisible();
        await expect(this.sellTab, "Sell tab should be visible on market page").toBeVisible();
    }
}
