import { Page, Locator, expect } from "@playwright/test";

/**
 * LoginPage - Handles all interactions on the /login page (Ory Kratos).
 *
 * @example
 * ```typescript
 * const loginPage = new LoginPage(page);
 * await loginPage.gotoLoginPage();
 * await loginPage.login("user@webapps.mailisk.net", "password");
 * ```
 */
export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // ============================================
    // LOCATORS
    // ============================================

    /** Main heading on the login page */
    get heading(): Locator {
        return this.page.getByRole("heading", { level: 1 });
    }

    /** Email input container */
    get emailInput(): Locator {
        return this.page.getByTestId("login-input-identifier");
    }

    /** Native <input> inside the email container */
    get emailNativeInput(): Locator {
        return this.emailInput.locator("input");
    }

    /** Label that focuses the email input */
    get emailInputLabel(): Locator {
        return this.emailInput.locator("label").first();
    }

    /** Password input field */
    get passwordInput(): Locator {
        return this.page.getByTestId("login-input-password").locator("input");
    }

    /** Log in submit button */
    get logInButton(): Locator {
        return this.page.getByTestId("login-btn-submit").getByRole("button").first();
    }

    /** Inline validation / server error */
    get validationError(): Locator {
        return this.page.getByTestId("login-input-identifier").locator("[role='alert']").first();
    }

    // ============================================
    // ACTIONS
    // ============================================

    /**
     * Navigate to the login page.
     * Uses `LOGIN_URL` env var if set, otherwise falls back to `/login`.
     */
    async gotoLoginPage(): Promise<void> {
        await this.page.goto(process.env.LOGIN_URL ?? "/login");
        await this.page.waitForLoadState("domcontentloaded");
        await expect(this.heading, "Login page heading should be visible").toBeVisible();
    }

    /**
     * Enter an email address into the identifier field.
     * Uses `pressSequentially` so JS input events fire and the form recognises an email.
     *
     * @param email - Email address to enter
     */
    async enterEmail(email: string): Promise<void> {
        await expect(this.emailInputLabel, "Email input label should be visible").toBeVisible();
        await this.emailInputLabel.dispatchEvent("click");
        await this.emailNativeInput.waitFor({ state: "visible" });
        await this.emailNativeInput.pressSequentially(email, { delay: 75 });
    }

    /**
     * Click the Log in / submit button.
     */
    async clickLogInButton(): Promise<void> {
        await expect(this.logInButton, "Log in button should be enabled").toBeEnabled();
        await this.logInButton.click();
    }

    /**
     * Complete the full login flow (email → password → market page).
     *
     * @param email - User email (falls back to `TEST_EMAIL` env var)
     * @param password - User password (falls back to `TEST_PASSWORD` env var)
     * @returns The email used to log in
     *
     * @example
     * ```typescript
     * await loginPage.login(); // uses TEST_EMAIL + TEST_PASSWORD from env
     * ```
     */
    async login(email?: string, password?: string): Promise<string> {
        const loginEmail = email ?? process.env.TEST_EMAIL;
        const loginPassword = password ?? process.env.TEST_PASSWORD;

        if (!loginEmail || !loginPassword) {
            throw new Error(
                "Login credentials not found. Provide email/password or set " +
                "TEST_EMAIL and TEST_PASSWORD in playwright/.env.staging"
            );
        }

        await this.gotoLoginPage();
        await this.enterEmail(loginEmail);
        await this.clickLogInButton();

        // Wait for password step
        await this.page.waitForURL(/\/enter-password/);
        await expect(this.passwordInput, "Password input should be visible").toBeVisible();
        await this.passwordInput.fill(loginPassword);
        await this.clickLogInButton();

        // Wait for redirect to P2P market home
        await this.page.waitForURL("/");
        await this.page.waitForLoadState("domcontentloaded");

        return loginEmail;
    }

    // ============================================
    // VERIFICATIONS
    // ============================================

    /**
     * Assert that all expected elements on the login page are visible.
     */
    async verifyLoginPageElements(): Promise<void> {
        await expect(this.heading, "Login heading should be visible").toBeVisible();
        await expect(this.emailInput, "Email input should be visible").toBeVisible();
        await expect(this.logInButton, "Log in button should be visible").toBeVisible();
    }
}
