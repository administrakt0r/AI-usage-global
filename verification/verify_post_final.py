from playwright.sync_api import sync_playwright

def run_cuj(page):
    # Go directly to the new post
    url = "http://localhost:3000/blog-detail/not-for-profit-utilities-turn-to-energy-storage-to-hedge-ai-costs"
    page.goto(url)
    page.wait_for_timeout(5000)

    # Take screenshot
    page.screenshot(path="verification/screenshots/verification_final.png")
    print("Screenshot taken")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
